//
//  LogInView.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-26.
//

import SwiftUI

struct LogInView: View {
    @Environment(Router.self) var router

    var body: some View {
        VStack {
            Text("Log In").font(.largeTitle).padding(.bottom, 10)

            Button("Don't have an acount? Sign up") {
                // Remove last item on the navigation stack which is the LogInView
                router.pop()

                router.navigate(to: .signUp)
            }
        }
    }
}

#Preview {
    LogInView().environment(Router())
}
