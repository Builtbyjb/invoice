import { z } from 'zod';

import { envelope } from '@/schemas/common';

import { apiRequest, type RequestOptions } from './client';
import { ApiError } from './errors';

type EnvelopeOptions<S extends z.ZodType> = Omit<RequestOptions<S>, 'schema'> & { data: S };

/** Envelope endpoint whose `data` is required (create / update / fetch one / delete). */
export async function requestData<S extends z.ZodType>({ data, ...opts }: EnvelopeOptions<S>): Promise<z.output<S>> {
  const res = await apiRequest({ ...opts, requiresAuth: true, schema: envelope(data) });
  if (res.data === undefined || res.data === null) throw ApiError.decodingFailed();
  return res.data as z.output<S>;
}

/** Envelope list endpoint: returns `data ?? []`. `meta` is ignored for now (no pagination, as in Swift). */
export async function requestList<S extends z.ZodType>({ data, ...opts }: EnvelopeOptions<S>): Promise<z.output<S>[]> {
  const res = await apiRequest({ ...opts, requiresAuth: true, schema: envelope(z.array(data)) });
  return (res.data ?? []) as z.output<S>[];
}
