//
//  auth.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-07-13.
//

import Foundation


struct SignResponse: Codable {
    let message: String
    let accessToken: String
}

struct RefreshRequest: Codable {
    let refreshTokenId: String
}

struct ResendOTPRequest: Codable {
    let email: String
}

struct ResendOTPResponse: Codable {
    let message: String
}

struct SignUpDetails: Codable {
    let email: String
    let firstname: String
    let lastname: String
    let referral: String
    let businessName: String
    let country: String
    
    func validate() throws {
        guard !email.isEmpty else { throw ValidationError.missingField("Email") }
        guard email.isValidEmail else { throw ValidationError.invalidEmail }
        guard !firstname.isEmpty else { throw ValidationError.missingField("First Name") }
        guard !lastname.isEmpty else { throw ValidationError.missingField("Last Name") }
        guard !businessName.isEmpty else { throw ValidationError.missingField("Business Name") }
        guard !country.isEmpty else { throw ValidationError.missingField("Country") }
    }
}

struct SignInDetails: Codable {
    let email: String
    
    func validate() throws {
        guard !email.isEmpty else { throw ValidationError.missingField("Email") }
        guard email.isValidEmail else { throw ValidationError.invalidEmail }
    }
}

struct OTPDetails: Codable {
    let code: String
    
    func validate() throws {
        guard code.count == 8 else { throw ValidationError.invalidOTP }
        guard code.allSatisfy({ $0.isNumber }) else { throw ValidationError.invalidOTP }
    }
}

enum ValidationError: LocalizedError, Equatable {
    case missingField(String)
    case invalidEmail
    case invalidOTP
    
    var errorDescription: String? {
        switch self {
        case .missingField(let field):
            return "\(field) is required."
        case .invalidEmail:
            return "Please enter a valid email address."
        case .invalidOTP:
            return "Please enter a valid 8-digit OTP code."
        }
    }
}

extension String {
    var isValidEmail: Bool {
        let regex = #"^[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"#
        return NSPredicate(format: "SELF MATCHES %@", regex).evaluate(with: self)
    }
}

struct Auth {
    static func signUp(signUpDetails: SignUpDetails) async throws -> SignResponse {
        try signUpDetails.validate()
        let response: SignResponse = try await APIClient.shared.request(
            path: "/api/v1/auth/signup",
            method: "POST",
            body: signUpDetails
        )
        return response
    }
    
    static func signIn(signInDetails: SignInDetails) async throws -> SignResponse {
        try signInDetails.validate()
        let response: SignResponse = try await APIClient.shared.request(
            path: "/api/v1/auth/signin",
            method: "POST",
            body: signInDetails
        )
        return response
    }
    
    static func verifyOTP(otpDetails: OTPDetails, tempToken: String) async throws -> Token {
        try otpDetails.validate()
        let token: Token = try await APIClient.shared.request(
            path: "/api/v1/auth/verify-otp",
            method: "POST",
            body: otpDetails,
            requiresAuth: true,
        )
        
        try TokenStore.shared.save(token)
        return token
    }
    
    static func refresh(refreshToken: String) async throws -> Token {
        let request = RefreshRequest(refreshTokenId: refreshToken)
        let token: Token = try await APIClient.shared.request(
            path: "/api/v1/auth/refresh-token",
            method: "POST",
            body: request
        )
        return token
    }
    
    static func resendOTP(email: String) async throws -> ResendOTPResponse {
        let request = ResendOTPRequest(email: email)
        let response: ResendOTPResponse = try await APIClient.shared.request(
            path: "/api/v1/auth/resend-otp",
            method: "POST",
            body: request
        )
        return response
    }
}
