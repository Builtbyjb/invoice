//
//  ContentView.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-26.
//

import SwiftUI

struct ContentView: View {
    var body: some View {
        TabView {
            HomeView().tabItem {
                Label("Home", systemImage: "house")
            }
            ClientsView().tabItem {
                Label("Clients", systemImage: "person.fill")
            }
            InvoicesView().tabItem {
                Label("Invoices", systemImage: "doc.text.fill")
            }
            ReferralView().tabItem {
                Label("Referral", systemImage: "gift.fill")
            }
        }
    }
}

#Preview {
    ContentView()
}
