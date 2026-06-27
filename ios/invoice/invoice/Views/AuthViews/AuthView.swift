//
//  AuthView.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-26.
//

import SwiftUI

struct AuthView: View {
    @Environment(Router.self) var router

    var body: some View {
        VStack {
            Text("Invoice").font(.largeTitle.bold())
            Spacer()

            Button {
                router.navigate(to: .signUp)
            } label: {
                Text("Create an account")
                    .padding(.vertical, 8)
                    .frame(width: 200)
            }
            .buttonStyle(.glassProminent)

            // Divider
            HStack {
                Color.gray.frame(height: 1)

                Text("or")
                    .font(.subheadline)
                    .foregroundColor(.gray)
                    .padding(.horizontal, 4)

                Color.gray.frame(height: 1)
            }
            .frame(maxWidth: 350)
            .padding(.vertical)

            Button {
                router.navigate(to: .logIn)
            } label: {
                Text("Sign In")
                    .padding(.vertical, 8)
                    .frame(width: 200)
            }
            .buttonStyle(.glass)
        }
    }
}

#Preview {
    AuthView().environment(Router())
}
