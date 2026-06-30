//
//  ContentView.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-26.
//

import SwiftUI

struct ContentView: View {
    @State private var selectedTab = 0

    var body: some View {
        TabView(selection: $selectedTab) {
            HomeView()
                .tag(0)
                .tabItem {
                    Label {
                        Text("Home")
                    } icon: {
                        Image(
                            uiImage: UIImage(
                                systemName: selectedTab == 0 ? "house.fill" : "house"
                            )!
                        )
                        .renderingMode(.template)
                    }
                }
            ClientsView()
                .tag(1)
                .tabItem {
                    Label {
                        Text("Clients")
                    } icon: {
                        Image(
                            uiImage: UIImage(
                                systemName: selectedTab == 1 ? "person.fill" : "person"
                            )!
                        )
                        .renderingMode(.template)
                    }
                }
            InvoicesView()
                .tag(2)
                .tabItem {
                    Label {
                        Text("Invoices")
                    } icon: {
                        Image(
                            uiImage: UIImage(
                                systemName: selectedTab == 2 ? "doc.text.fill" : "doc.text"
                            )!
                        )
                        .renderingMode(.template)
                    }
                }
            ReferralView()
                .tag(3)
                .tabItem {
                    Label {
                        Text("Referral")
                    } icon: {
                        Image(
                            uiImage: UIImage(
                                systemName: selectedTab == 3 ? "gift.fill" : "gift"
                            )!
                        )
                        .renderingMode(.template)
                    }
                }
        }
    }
}

#Preview {
    ContentView()
}
