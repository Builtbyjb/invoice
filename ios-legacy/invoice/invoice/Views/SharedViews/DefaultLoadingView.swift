//
//  DefaultLoadingView.swift
//  invoice
//
//  Created by OpenCode on 2026-07-22.
//

import SwiftUI

struct DefaultLoadingView: View {
    var body: some View {
        ProgressView()
            .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

#Preview {
    DefaultLoadingView()
}
