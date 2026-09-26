import { z } from 'zod';

import { emailField, requiredString } from './common';

export const tokenSchema = z.object({ accessToken: z.string(), refreshToken: z.string() });
export type Token = z.infer<typeof tokenSchema>;

export const signResponseSchema = z.object({ message: z.string(), accessToken: z.string() });
export type SignResponse = z.infer<typeof signResponseSchema>;

export const messageResponseSchema = z.object({ message: z.string() });

export const signInFormSchema = z.object({ email: emailField });
export type SignInFormValues = z.input<typeof signInFormSchema>;
export type SignInFormOutput = z.output<typeof signInFormSchema>;

export const signUpFormSchema = z.object({
  firstName: requiredString('First Name'),
  lastName: requiredString('Last Name'),
  email: emailField,
  businessName: requiredString('Business Name'),
  country: requiredString('Country'),
  referral: z.string().trim(), // optional, may be ''
});
export type SignUpFormValues = z.input<typeof signUpFormSchema>;
export type SignUpFormOutput = z.output<typeof signUpFormSchema>;

export const OTP_LENGTH = 8;

export const otpFormSchema = z.object({
  code: z.string().regex(/^\d{8}$/, 'Please enter a valid 8-digit OTP code.'),
});
