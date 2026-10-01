//
//  AccountView.swift
//  invoice
//
//  Created by OpenCode on 2026-07-22.
//

import SwiftUI

struct AccountView: View {
    var body: some View {
        Text("Account")
            .font(.largeTitle)
            .toolbar(.hidden, for: .tabBar)
    }
}

#Preview {
    AccountView()
}
