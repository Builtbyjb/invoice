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
            Spacer()
            
            Button("Create an Account") {
                router.navigate(to: .signUp)
            }.buttonStyle(.borderedProminent)
            
            Button("Sign In") {
                router.navigate(to: .logIn)
            }.buttonStyle(.bordered)
        }
    }
}

#Preview {
    AuthView().environment(Router())
}
