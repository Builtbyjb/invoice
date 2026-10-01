//
//  PaymentView.swift
//  invoice
//
//  Created by OpenCode on 2026-07-22.
//

import SwiftUI

struct PaymentView: View {
    var body: some View {
        Text("Payment")
            .font(.largeTitle)
            .toolbar(.hidden, for: .tabBar)
    }
}

#Preview {
    PaymentView()
}
