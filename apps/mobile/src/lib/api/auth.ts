import {
    messageResponseSchema,
    signResponseSchema,
    tokenSchema,
    type SignUpFormOutput,
    type Token,
} from "../../schemas/auth";

import { apiRequest } from "./client";

export function signUp(v: SignUpFormOutput) {
    return apiRequest({
        path: "/api/v1/auth/signup",
        method: "POST",
        schema: signResponseSchema,
        body: {
            email: v.email,
            firstname: v.firstName,
            lastname: v.lastName,
            referral: v.referral,
            businessName: v.businessName,
            country: v.country,
        },
    });
}

export function signIn(email: string) {
    return apiRequest({
        path: "/api/v1/auth/signin",
        method: "POST",
        schema: signResponseSchema,
        body: { email },
    });
}

/** Verifies the OTP using the temporary token from sign in/up. Does NOT persist the returned token. */
export function verifyOtp(code: string, tempToken: string): Promise<Token> {
    return apiRequest({
        path: "/api/v1/auth/verify-otp",
        method: "POST",
        schema: tokenSchema,
        body: { code },
        requiresAuth: true,
        authToken: tempToken,
        skipRefresh: true,
    });
}

export function refresh(refreshToken: string): Promise<Token> {
    return apiRequest({
        path: "/api/v1/auth/refresh-token",
        method: "POST",
        schema: tokenSchema,
        body: { refreshTokenId: refreshToken },
    });
}

export function resendOtp(email: string) {
    return apiRequest({
        path: "/api/v1/auth/resend-otp",
        method: "POST",
        schema: messageResponseSchema,
        body: { email },
    });
}
