//
//  SubscriptionsView.swift
//  invoice
//
//  Created by OpenCode on 2026-07-22.
//

import SwiftUI

struct SubscriptionsView: View {
    var body: some View {
        Text("Subscriptions")
            .font(.largeTitle)
            .toolbar(.hidden, for: .tabBar)
    }
}

#Preview {
    SubscriptionsView()
}
