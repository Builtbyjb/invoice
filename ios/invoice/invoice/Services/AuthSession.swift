//
//  AuthSession.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-07-15.
//

import Foundation
import Observation

enum AuthState {
    case undefined, authenticated, notAuthenticated
}

@MainActor
@Observable
final class AuthSession {
    static let shared = AuthSession()
    
    var state: AuthState = .undefined
    private let tokenStore = TokenStore.shared
    
    private init() {}
    
    func initialize() async {
        do {
            guard let token = try tokenStore.read() else {
                state = .notAuthenticated
                return
            }
            
            if token.isExpired {
                await refreshSession(using: token.refreshToken)
            } else {
                state = .authenticated
            }
        } catch {
            print("AuthSession initialization error: \(error.localizedDescription)")
            handleUnauthorized()
        }
    }
    
    func markAuthenticated() {
        state = .authenticated
    }
    
    // Clears stored credentials and resets the session. Safe to call from any isolation context.
    func handleUnauthorized() {
        try? tokenStore.delete()
        state = .notAuthenticated
    }
    
    func signOut() {
        try? tokenStore.delete()
        state = .notAuthenticated
    }
    
    private func refreshSession(using refreshToken: String) async {
        do {
            let token = try await Auth.refresh(refreshToken: refreshToken)
            try tokenStore.save(token)
            state = .authenticated
        } catch {
            print("AuthSession refresh failed: \(error.localizedDescription)")
            handleUnauthorized()
        }
    }
}
