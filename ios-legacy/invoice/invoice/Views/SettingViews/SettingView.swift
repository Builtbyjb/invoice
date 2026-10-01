//
//  SettingView.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-26.
//

import SwiftUI

struct SettingView: View {
    @Environment(AuthSession.self) private var authSession
    
    var body: some View {
        Form {
            Section("Account") {
                NavigationLink(value: AppRoute.account) {
                    Label("Account", systemImage: "person.fill")
                }
                NavigationLink(value: AppRoute.payment) {
                    Label("Payment", systemImage: "creditcard.fill")
                }
                NavigationLink(value: AppRoute.legal) {
                    Label("Legal", systemImage: "doc.text.fill")
                }
                NavigationLink(value: AppRoute.subscriptions) {
                    Label("Subscriptions", systemImage: "crown.fill")
                }
            }
            
            Section {
                Button("Sign Out", role: .destructive) {
                    authSession.signOut()
                }
            } footer: {
                Text("Version 0.1.0")
            }
        }
        .navigationTitle("Settings")
        .toolbar(.hidden, for: .tabBar)
    }
}

#Preview {
    SettingView()
        .environment(AuthSession.shared)
}
