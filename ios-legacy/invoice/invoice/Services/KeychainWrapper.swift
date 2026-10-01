//
//  KeychainWrapper.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-07-13.
//
import Foundation
import Security

struct Token: Codable {
    let accessToken: String
    let refreshToken: String
//    let accessTokenExpiry: Date
}

enum TokenStoreError: Error {
    case saveFailed(OSStatus)
    case readFailed(OSStatus)
    case deleteFailed(OSStatus)
}

final class TokenStore {
    static let shared = TokenStore()

    private let service: String
    private let account = "tokens"

    private init() {
        self.service = Bundle.main.bundleIdentifier ?? "com.acorp.auth"
    }

    func save(_ pair: Token) throws {
        let data = try JSONEncoder().encode(pair)

        let deleteQuery: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: account,
        ]
        
        SecItemDelete(deleteQuery as CFDictionary)

        let addQuery: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: account,
            kSecValueData as String: data,
            kSecAttrAccessible as String: kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly,
        ]

        let status = SecItemAdd(addQuery as CFDictionary, nil)
        guard status == errSecSuccess else {
            throw TokenStoreError.saveFailed(status)
        }
    }

    func read() throws -> Token? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: account,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne,
        ]

        var item: CFTypeRef?
        let status = SecItemCopyMatching(query as CFDictionary, &item)

        if status == errSecItemNotFound { return nil }
        
        guard status == errSecSuccess, let data = item as? Data else {
            throw TokenStoreError.readFailed(status)
        }

        return try JSONDecoder().decode(Token.self, from: data)
    }

    func delete() throws {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: account,
        ]
        
        let status = SecItemDelete(query as CFDictionary)
        guard status == errSecSuccess || status == errSecItemNotFound else {
            throw TokenStoreError.deleteFailed(status)
        }
    }
}
