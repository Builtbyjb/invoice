//
//  SignUpView.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-26.
//

import SwiftUI

struct SignUpView: View {
    @Environment(Router.self) var router

    var body: some View {
        VStack {
            Text("Create an account").font(.largeTitle).padding(.bottom, 10)

            Button("Already have an account? Log In") {
                router.pop()
                router.navigate(to: .logIn)
            }
        }

    }
}

#Preview {
    SignUpView().environment(Router())
}
