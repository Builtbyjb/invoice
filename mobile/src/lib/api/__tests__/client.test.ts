import { z } from 'zod';

import { tokenStore } from '@/lib/auth/token-store';
import { makeToken } from '@/test-utils/jwt';

import { apiRequest, buildUrl, setUnauthorizedHandler } from '../client';
import { ApiError } from '../errors';

type FakeResponse = { status: number; statusText: string; url: string; text: () => Promise<string> };

const respond = (status: number, body?: unknown, statusText = ''): FakeResponse => ({
  status,
  statusText,
  url: 'http://test',
  text: async () => (body === undefined ? '' : typeof body === 'string' ? body : JSON.stringify(body)),
});

const fetchMock = jest.fn<Promise<FakeResponse>, [string, RequestInit]>();
const unauthorized = jest.fn();
const schema = z.object({ ok: z.boolean() });

const REFRESH_PATH = '/api/v1/auth/refresh-token';
const isRefresh = (url: string) => url.endsWith(REFRESH_PATH);
const authHeader = (init: RequestInit) => (init.headers as Record<string, string>).Authorization;

beforeAll(() => {
  global.fetch = fetchMock as unknown as typeof fetch;
  setUnauthorizedHandler(unauthorized);
});

beforeEach(async () => {
  fetchMock.mockReset();
  unauthorized.mockReset();
  await tokenStore.save(makeToken({ n: 'old' }, 'refresh-1'));
});

const newToken = makeToken({ n: 'new' }, 'refresh-2');

describe('apiRequest', () => {
  it('1. decodes a 2xx response and sends JSON + bearer headers', async () => {
    fetchMock.mockResolvedValueOnce(respond(200, { ok: true }));
    await expect(apiRequest({ path: '/x', method: 'GET', schema, requiresAuth: true })).resolves.toEqual({ ok: true });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('http://localhost:8585/x');
    expect(init.headers).toEqual({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${(await tokenStore.read())!.accessToken}`,
    });
  });

  it('2. maps non-2xx {message} to "Error 400: Bad email"', async () => {
    fetchMock.mockResolvedValueOnce(respond(400, { message: 'Bad email' }));
    await expect(apiRequest({ path: '/x', method: 'POST', schema, body: {} })).rejects.toThrow('Error 400: Bad email');
  });

  it('2b. falls back to the status text when the error body is not JSON', async () => {
    fetchMock.mockResolvedValueOnce(respond(404, '<html>'));
    await expect(apiRequest({ path: '/x', method: 'GET', schema })).rejects.toThrow('Error 404: not found');
  });

  it('2c. reports decoding failures', async () => {
    fetchMock.mockResolvedValueOnce(respond(200, { ok: 'nope' }));
    await expect(apiRequest({ path: '/x', method: 'GET', schema })).rejects.toThrow('Failed to decode response');
  });

  it('2d. reports network failures', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Network request failed'));
    await expect(apiRequest({ path: '/x', method: 'GET', schema })).rejects.toMatchObject({
      kind: 'network',
      message: 'Network request failed',
    });
  });

  it('3. on 401 refreshes and retries with the new token', async () => {
    fetchMock.mockImplementation(async (url, init) => {
      if (isRefresh(url)) return respond(200, newToken);
      return authHeader(init) === `Bearer ${newToken.accessToken}` ? respond(200, { ok: true }) : respond(401);
    });
    await expect(apiRequest({ path: '/x', method: 'GET', schema, requiresAuth: true })).resolves.toEqual({ ok: true });
    const refreshCall = fetchMock.mock.calls.find(([url]) => isRefresh(url))!;
    expect(JSON.parse(refreshCall[1].body as string)).toEqual({ refreshTokenId: 'refresh-1' });
    expect(await tokenStore.read()).toEqual(newToken);
    expect(unauthorized).not.toHaveBeenCalled();
  });

  it('4. on 401 with a failing refresh calls the unauthorized handler once', async () => {
    fetchMock.mockImplementation(async (url) => (isRefresh(url) ? respond(401, { message: 'expired' }) : respond(401)));
    await expect(apiRequest({ path: '/x', method: 'GET', schema, requiresAuth: true })).rejects.toMatchObject({
      kind: 'unauthorized',
      message: 'Unauthorized. Please sign in again.',
    });
    expect(unauthorized).toHaveBeenCalledTimes(1);
  });

  it('4b. signs out when the retry still returns 401', async () => {
    fetchMock.mockImplementation(async (url) => (isRefresh(url) ? respond(200, newToken) : respond(401)));
    await expect(apiRequest({ path: '/x', method: 'GET', schema, requiresAuth: true })).rejects.toBeInstanceOf(ApiError);
    expect(unauthorized).toHaveBeenCalledTimes(1);
  });

  it('4c. does not sign out when the refresh fails with a network error', async () => {
    fetchMock.mockImplementation(async (url) => {
      if (isRefresh(url)) throw new TypeError('offline');
      return respond(401);
    });
    await expect(apiRequest({ path: '/x', method: 'GET', schema, requiresAuth: true })).rejects.toMatchObject({
      kind: 'network',
    });
    expect(unauthorized).not.toHaveBeenCalled();
  });

  it('5. two concurrent 401s trigger exactly one refresh', async () => {
    let resolveRefresh!: () => void;
    const refreshGate = new Promise<void>((r) => (resolveRefresh = r));
    fetchMock.mockImplementation(async (url, init) => {
      if (isRefresh(url)) {
        await refreshGate;
        return respond(200, newToken);
      }
      return authHeader(init) === `Bearer ${newToken.accessToken}` ? respond(200, { ok: true }) : respond(401);
    });
    const a = apiRequest({ path: '/a', method: 'GET', schema, requiresAuth: true });
    const b = apiRequest({ path: '/b', method: 'GET', schema, requiresAuth: true });
    await new Promise((r) => setTimeout(r, 0));
    resolveRefresh();
    await expect(Promise.all([a, b])).resolves.toEqual([{ ok: true }, { ok: true }]);
    expect(fetchMock.mock.calls.filter(([url]) => isRefresh(url))).toHaveLength(1);
  });

  it('6. skipRefresh does not refresh', async () => {
    fetchMock.mockResolvedValueOnce(respond(401, { message: 'Invalid code' }));
    await expect(
      apiRequest({ path: '/v', method: 'POST', schema, requiresAuth: true, authToken: 'temp', skipRefresh: true }),
    ).rejects.toThrow('Error 401: Invalid code');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(authHeader(fetchMock.mock.calls[0][1])).toBe('Bearer temp');
    expect(unauthorized).not.toHaveBeenCalled();
  });

  it('7. missing token with requiresAuth calls the handler and throws unauthorized', async () => {
    await tokenStore.delete();
    await expect(apiRequest({ path: '/x', method: 'GET', schema, requiresAuth: true })).rejects.toMatchObject({
      kind: 'unauthorized',
    });
    expect(unauthorized).toHaveBeenCalledTimes(1);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('treats an empty 2xx body as {}', async () => {
    fetchMock.mockResolvedValueOnce(respond(200));
    await expect(apiRequest({ path: '/x', method: 'POST', schema: z.object({}) })).resolves.toEqual({});
  });

  it('rethrows AbortError unchanged', async () => {
    const abort = Object.assign(new Error('Aborted'), { name: 'AbortError' });
    fetchMock.mockRejectedValueOnce(abort);
    await expect(apiRequest({ path: '/x', method: 'GET', schema })).rejects.toBe(abort);
  });
});

describe('buildUrl', () => {
  it('omits undefined query values and encodes the rest', () => {
    expect(buildUrl('/r', { currency: 'USD', year: undefined }, 'http://h:1/')).toBe('http://h:1/r?currency=USD');
    expect(buildUrl('/c', { name: 'a b&c' }, 'http://h')).toBe('http://h/c?name=a%20b%26c');
  });

  it('rejects invalid URLs', () => {
    expect(() => buildUrl('/x', undefined, 'not a url')).toThrow('Invalid URL');
  });
});
