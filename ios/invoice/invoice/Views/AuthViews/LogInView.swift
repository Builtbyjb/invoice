//
//  LogInView.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-26.
//

import SwiftUI

struct LogInView: View {
    @Environment(Router.self) var router

    @State private var email: String = ""
    @State private var showValidateOTP: Bool = false
    @State private var isValidated: Bool = false

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {

                // View Title
                Text("Sign In")
                    .font(.system(size: 28, weight: .bold))
                    .foregroundColor(.primary)
                    .padding(.top, 20)

                // Form Fields
                VStack(spacing: 16) {
                    customTextField(
                        title: "Email Address",
                        text: $email,
                        placeholder: "name@example.com"
                    )
                    .keyboardType(.emailAddress)
                    .autocapitalization(.none)
                }

                // Submit Button
                Button {
                    // Handle sign up action here
                    showValidateOTP = true
                } label: {
                    Text("Sign In")
                        .font(.headline)
                        .foregroundColor(.white)
                        .padding(.vertical, 14)
                        .frame(maxWidth: .infinity)
                        .background(Color.blue)
                        .cornerRadius(8)
                }
                .padding(.top, 10)

                Button("Don't have an account? Sign Up") {
                    // Remove last item on the navigation stack
                    router.pop()

                    router.navigate(to: .signUp)
                }
            }
            .padding(.horizontal, 24)
            .sheet(isPresented: $showValidateOTP) {
                NavigationStack {
                    VStack {
                        ValidateOTPView(isPresented: $isValidated)
                    }
                    .navigationTitle("OTP Verification")
                    .navigationBarTitleDisplayMode(.inline)
                }
                .presentationDragIndicator(.visible)
            }
        }
    }

    // Helper view building component for input fields
    @ViewBuilder
    private func customTextField(
        title: String,
        text: Binding<String>,
        placeholder: String
    ) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title)
                .font(.footnote.weight(.semibold))
                .foregroundColor(.gray)

            TextField(placeholder, text: text)
                .padding()
                .background(Color(.systemGray6))
                .cornerRadius(8)
        }
    }
}

#Preview {
    LogInView().environment(Router())
}
