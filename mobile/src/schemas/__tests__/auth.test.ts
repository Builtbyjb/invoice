import { otpFormSchema, signInFormSchema, signUpFormSchema } from '../auth';

const firstMessage = (r: { success: boolean; error?: { issues: { message: string }[] } }) =>
  r.error?.issues[0]?.message;

const validSignUp = {
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  referral: '',
  businessName: 'Acme',
  country: 'United States',
};

describe('auth form schemas (ported from invoiceTests.swift)', () => {
  it('validSignInDetails', () => {
    expect(signInFormSchema.safeParse({ email: 'test@example.com' }).success).toBe(true);
  });

  it('invalidEmailThrows', () => {
    const r = signInFormSchema.safeParse({ email: 'not-an-email' });
    expect(r.success).toBe(false);
    expect(firstMessage(r)).toBe('Please enter a valid email address.');
  });

  it('emptyEmailThrowsMissingField', () => {
    const r = signInFormSchema.safeParse({ email: '' });
    expect(r.success).toBe(false);
    expect(firstMessage(r)).toBe('Email is required.');
  });

  it('validOTPDetails', () => {
    expect(otpFormSchema.safeParse({ code: '12345678' }).success).toBe(true);
  });

  it('shortOTPThrows', () => {
    const r = otpFormSchema.safeParse({ code: '1234567' });
    expect(firstMessage(r)).toBe('Please enter a valid 8-digit OTP code.');
  });

  it('nonNumericOTPThrows', () => {
    const r = otpFormSchema.safeParse({ code: '1234567a' });
    expect(firstMessage(r)).toBe('Please enter a valid 8-digit OTP code.');
  });

  it('validSignUpDetails', () => {
    expect(signUpFormSchema.safeParse(validSignUp).success).toBe(true);
  });

  it('signUpMissingBusinessNameThrows', () => {
    const r = signUpFormSchema.safeParse({ ...validSignUp, businessName: '' });
    expect(r.success).toBe(false);
    expect(firstMessage(r)).toBe('Business Name is required.');
  });

  it('reports each missing sign-up field with the Swift message', () => {
    const r = signUpFormSchema.safeParse({ ...validSignUp, firstName: '', lastName: ' ', country: '' });
    expect(r.error?.issues.map((i) => i.message)).toEqual([
      'First Name is required.',
      'Last Name is required.',
      'Country is required.',
    ]);
  });

  it('trims the email before validating', () => {
    const r = signInFormSchema.safeParse({ email: '  test@example.com ' });
    expect(r.success && r.data.email).toBe('test@example.com');
  });
});
