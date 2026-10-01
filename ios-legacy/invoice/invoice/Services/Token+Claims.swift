//
//  Token+Claims.swift
//  invoice
//
//  Created by OpenCode on 2026-07-16.
//

import Foundation

extension Token {
    private struct Claims: Codable {
        let preferredCurrency: String?
        let exp: Double?
    }

    private var payloadData: Data? {
        let segments = accessToken.split(separator: ".")
        guard segments.count == 3 else { return nil }

        var base64 = String(segments[1])
        base64 = base64
            .replacingOccurrences(of: "-", with: "+")
            .replacingOccurrences(of: "_", with: "/")

        let padding = 4 - base64.count % 4
        if padding != 4 {
            base64.append(contentsOf: repeatElement("=", count: padding))
        }

        return Data(base64Encoded: base64)
    }

    private var claims: Claims? {
        guard let payloadData else { return nil }
        return try? JSONDecoder().decode(Claims.self, from: payloadData)
    }

    var preferredCurrency: String? {
        claims?.preferredCurrency
    }

    /// Checks whether the access token is expired, with a 30-second leeway to avoid edge-case rejections.
    var isExpired: Bool {
        guard let exp = claims?.exp else { return false }
        return Date().timeIntervalSince1970 >= (exp - 30)
    }
}

extension TokenStore {
    var preferredCurrency: String? {
        guard let token = try? read() else { return nil }
        return token.preferredCurrency
    }
}
