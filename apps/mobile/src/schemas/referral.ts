import { z } from 'zod';

export const referralSchema = z.object({
  totalReferrals: z.number(),
  activeReferrals: z.number(),
  totalEarnings: z.number(),
  payout: z.number(),
  referralCode: z.string(),
});
export type Referral = z.infer<typeof referralSchema>;
