//
//  invoiceTests.swift
//  invoiceTests
//
//  Created by Ajibola Awotide on 2026-06-24.
//

import Testing
import Foundation
@testable import invoice

struct invoiceTests {

    // MARK: - Validation

    @Test func validSignInDetails() throws {
        let details = SignInDetails(email: "test@example.com")
        try details.validate()
    }

    @Test func invalidEmailThrows() {
        let details = SignInDetails(email: "not-an-email")
        #expect(throws: ValidationError.invalidEmail) {
            try details.validate()
        }
    }

    @Test func emptyEmailThrowsMissingField() {
        let details = SignInDetails(email: "")
        #expect(throws: ValidationError.missingField("Email")) {
            try details.validate()
        }
    }

    @Test func validOTPDetails() throws {
        let details = OTPDetails(code: "12345678")
        try details.validate()
    }

    @Test func shortOTPThrows() {
        let details = OTPDetails(code: "1234567")
        #expect(throws: ValidationError.invalidOTP) {
            try details.validate()
        }
    }

    @Test func nonNumericOTPThrows() {
        let details = OTPDetails(code: "1234567a")
        #expect(throws: ValidationError.invalidOTP) {
            try details.validate()
        }
    }

    @Test func validSignUpDetails() throws {
        let details = SignUpDetails(
            email: "test@example.com",
            firstname: "John",
            lastname: "Doe",
            referral: "",
            businessName: "Acme",
            country: "United States"
        )
        try details.validate()
    }

    @Test func signUpMissingBusinessNameThrows() {
        let details = SignUpDetails(
            email: "test@example.com",
            firstname: "John",
            lastname: "Doe",
            referral: "",
            businessName: "",
            country: "United States"
        )
        #expect(throws: ValidationError.missingField("Business Name")) {
            try details.validate()
        }
    }

    // MARK: - JWT claims

    @Test func preferredCurrencyFromToken() {
        let token = makeToken(payload: ["preferredCurrency": "NGN"])
        #expect(token.preferredCurrency == "NGN")
    }

    @Test func tokenIsExpired() {
        let token = makeToken(payload: ["exp": Date().timeIntervalSince1970 - 100])
        #expect(token.isExpired)
    }

    @Test func tokenIsNotExpired() {
        let token = makeToken(payload: ["exp": Date().timeIntervalSince1970 + 100])
        #expect(!token.isExpired)
    }

    @Test func tokenWithinLeewayIsTreatedAsExpired() {
        let token = makeToken(payload: ["exp": Date().timeIntervalSince1970 + 10])
        #expect(token.isExpired)
    }

    @Test func missingExpirationIsNotExpired() {
        let token = makeToken(payload: ["preferredCurrency": "USD"])
        #expect(!token.isExpired)
    }

    // MARK: - TokenStore

    @Test func tokenStoreOperations() throws {
        // Ensure a clean keychain state before running this single sequential test.
        try? TokenStore.shared.delete()
        defer { try? TokenStore.shared.delete() }

        // Round trip
        let token = makeToken(payload: ["preferredCurrency": "EUR"])
        try TokenStore.shared.save(token)
        let read = try TokenStore.shared.read()
        #expect(read?.accessToken == token.accessToken)
        #expect(read?.refreshToken == token.refreshToken)
        #expect(TokenStore.shared.preferredCurrency == "EUR")

        // Overwrite
        let second = makeToken(payload: ["preferredCurrency": "USD"])
        try TokenStore.shared.save(second)
        let read2 = try TokenStore.shared.read()
        #expect(read2?.accessToken == second.accessToken)
        #expect(TokenStore.shared.preferredCurrency == "USD")

        // Delete
        try TokenStore.shared.delete()
        #expect(try TokenStore.shared.read() == nil)
    }

    // MARK: - Helpers

    private func makeToken(payload: [String: Any]) -> Token {
        let header = Data(#"{"alg":"none"}"#.utf8).base64EncodedString()
        let payloadData = try! JSONSerialization.data(withJSONObject: payload)
        let payloadB64 = payloadData.base64EncodedString()
        return Token(accessToken: "\(header).\(payloadB64).signature", refreshToken: "refresh-token")
    }
}
