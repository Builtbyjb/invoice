//
//  LegalView.swift
//  invoice
//
//  Created by OpenCode on 2026-07-22.
//

import SwiftUI

struct LegalView: View {
    var body: some View {
        Text("Legal")
            .font(.largeTitle)
            .toolbar(.hidden, for: .tabBar)
    }
}

#Preview {
    LegalView()
}
