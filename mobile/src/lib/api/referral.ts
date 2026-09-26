import { referralSchema } from '@/schemas/referral';

import { apiRequest } from './client';

export function getReferral(signal?: AbortSignal) {
  return apiRequest({
    path: '/api/v1/referral/details',
    method: 'GET',
    schema: referralSchema,
    requiresAuth: true,
    signal,
  });
}
