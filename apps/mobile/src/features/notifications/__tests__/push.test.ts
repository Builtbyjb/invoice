import type * as Notifications from 'expo-notifications';

import { deepLinkFromNotification, parsePushData } from '../push';

describe('parsePushData', () => {
  it('parses client and invoice links', () => {
    expect(parsePushData({ type: 'client', target_id: 'c1' })).toEqual({ type: 'client', id: 'c1' });
    expect(parsePushData({ type: 'invoice', target_id: 'i1', aps: {} })).toEqual({ type: 'invoice', id: 'i1' });
  });

  it('returns null for missing or unknown keys', () => {
    expect(parsePushData(undefined)).toBeNull();
    expect(parsePushData({})).toBeNull();
    expect(parsePushData({ type: 'client' })).toBeNull();
    expect(parsePushData({ type: 'system', target_id: 'x' })).toBeNull();
    expect(parsePushData({ type: 'invoice', target_id: 42 })).toBeNull();
  });
});

describe('deepLinkFromNotification', () => {
  const make = (data: Record<string, unknown>, payload?: Record<string, unknown>) =>
    ({
      request: { identifier: 'n', content: { title: 't', body: 'b', data }, trigger: payload ? { payload } : null },
    }) as unknown as Notifications.Notification;

  it('prefers content.data', () => {
    expect(deepLinkFromNotification(make({ type: 'client', target_id: 'a' }, { type: 'invoice', target_id: 'b' }))).toEqual({
      type: 'client',
      id: 'a',
    });
  });

  it('falls back to the raw APNs trigger payload', () => {
    expect(deepLinkFromNotification(make({}, { type: 'invoice', target_id: 'b' }))).toEqual({ type: 'invoice', id: 'b' });
  });
});
