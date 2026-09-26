import type { Token } from '@/schemas/auth';

/** Port of Token+Claims.swift. Returns null for malformed tokens. */
export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  let b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
  const pad = 4 - (b64.length % 4);
  if (pad !== 4) b64 += '='.repeat(pad);
  try {
    const json: unknown = JSON.parse(atob(b64));
    return json !== null && typeof json === 'object' && !Array.isArray(json)
      ? (json as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

export function preferredCurrency(token: Token): string | undefined {
  const c = decodeJwtPayload(token.accessToken)?.preferredCurrency;
  return typeof c === 'string' ? c : undefined;
}

/** 30-second leeway. Missing exp → not expired (same as Swift). */
export function isExpired(token: Token, now: number = Date.now()): boolean {
  const exp = decodeJwtPayload(token.accessToken)?.exp;
  return typeof exp === 'number' ? now / 1000 >= exp - 30 : false;
}
