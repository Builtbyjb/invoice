import { tokenStore } from '@/lib/auth/token-store';
import { demoClient, demoInvoiceJson } from '@/lib/demo-data';
import { shouldRetry } from '@/lib/query/query-client';
import { makeToken } from '@/test-utils/jwt';

import * as auth from '../auth';
import * as clients from '../clients';
import * as dashboard from '../dashboard';
import { ApiError } from '../errors';
import * as invoices from '../invoices';
import * as referral from '../referral';

const fetchMock = jest.fn();
const ok = (body: unknown) => ({ status: 200, statusText: '', url: '', text: async () => JSON.stringify(body) });

beforeAll(() => {
  global.fetch = fetchMock as unknown as typeof fetch;
});

beforeEach(async () => {
  fetchMock.mockReset();
  await tokenStore.save(makeToken({}));
});

const req = { ...demoInvoiceJson, signature: null, items: [...demoInvoiceJson.items] } as unknown as Parameters<
  typeof invoices.createInvoice
>[0];
const clientValues = { name: 'a', email: 'a@a.co', phone: '', address: '', city: '', country: '', note: '' };
const tokens = { accessToken: 'a', refreshToken: 'r' };
const stats = { paidCount: 1, sentCount: 2, overdueCount: 3, draftCount: 4 };
const ref = { totalReferrals: 1, activeReferrals: 1, totalEarnings: 2, payout: 3, referralCode: 'ABC' };

// Section 3.3 of the rewrite plan: method + path for every endpoint.
const cases: [string, () => Promise<unknown>, unknown, string, string, boolean][] = [
  ['A2 signin', () => auth.signIn('a@a.co'), { message: 'm', accessToken: 't' }, 'POST', '/api/v1/auth/signin', false],
  ['A4 refresh', () => auth.refresh('r'), tokens, 'POST', '/api/v1/auth/refresh-token', false],
  ['A5 resend', () => auth.resendOtp('a@a.co'), { message: 'm' }, 'POST', '/api/v1/auth/resend-otp', false],
  ['C1 list', () => clients.listClients(), { message: 'm', data: [] }, 'GET', '/api/v1/clients', true],
  ['C2 create', () => clients.createClient(clientValues), { message: 'm', data: demoClient }, 'POST', '/api/v1/clients/create', true],
  ['C3 edit', () => clients.updateClient('c1', clientValues), { message: 'm', data: demoClient }, 'PUT', '/api/v1/clients/c1/edit', true],
  ['C4 get', () => clients.getClient('c1'), { message: 'm', data: demoClient }, 'GET', '/api/v1/clients/c1', true],
  ['C5 delete', () => clients.deleteClient('c1'), { message: 'm', data: demoClient }, 'DELETE', '/api/v1/clients/c1/delete', true],
  ['I1 list', () => invoices.listInvoices(), { message: 'm', data: [demoInvoiceJson] }, 'GET', '/api/v1/invoices', true],
  ['I2 create', () => invoices.createInvoice(req), { message: 'm', data: demoInvoiceJson }, 'POST', '/api/v1/invoices/create', true],
  ['I3 edit', () => invoices.updateInvoice('i1', req), { message: 'm', data: demoInvoiceJson }, 'PUT', '/api/v1/invoices/i1/edit', true],
  ['I4 get', () => invoices.getInvoice('i1'), { message: 'm', data: demoInvoiceJson }, 'GET', '/api/v1/invoices/i1', true],
  ['I5 delete', () => invoices.deleteInvoice('i1'), { message: 'm', data: demoInvoiceJson }, 'DELETE', '/api/v1/invoices/i1/delete', true],
  ['D1 stats', () => dashboard.getDashboardStats(), stats, 'GET', '/api/v1/user/dashboard/stats', true],
  ['R1 referral', () => referral.getReferral(), ref, 'GET', '/api/v1/referral/details', true],
];

describe.each(cases)('%s', (_, call, body, method, path, authed) => {
  it(`${method} ${path}`, async () => {
    fetchMock.mockResolvedValueOnce(ok(body));
    await call();
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(`http://localhost:8585${path}`);
    expect(init.method).toBe(method);
    const headers = init.headers as Record<string, string>;
    expect(headers['Content-Type']).toBe('application/json');
    expect(Boolean(headers.Authorization)).toBe(authed);
  });
});

describe('shouldRetry', () => {
  it('does not retry auth, decoding or 4xx errors', () => {
    expect(shouldRetry(0, ApiError.unauthorized())).toBe(false);
    expect(shouldRetry(0, ApiError.decodingFailed())).toBe(false);
    expect(shouldRetry(0, ApiError.server(404, 'x'))).toBe(false);
  });

  it('retries network and 5xx errors up to twice', () => {
    expect(shouldRetry(0, ApiError.network('offline'))).toBe(true);
    expect(shouldRetry(1, ApiError.server(503, 'x'))).toBe(true);
    expect(shouldRetry(2, ApiError.server(503, 'x'))).toBe(false);
  });
});
