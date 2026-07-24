//
//  LogInView.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-26.
//

import SwiftUI

struct LogInView: View {
    @Environment(AuthRouter.self) var router
    @Environment(AuthSession.self) private var authSession

    @State private var email: String = ""
    @State private var showValidateOTP: Bool = false
    @State private var otpEmail: String = ""
    @State private var isLoading = false
    @State private var showError = false
    @State private var errorMessage = ""

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                Text("Sign In")
                    .font(.system(size: 28, weight: .bold))
                    .foregroundColor(.primary)
                    .padding(.top, 20)

                VStack(spacing: 16) {
                    customTextField(
                        title: "Email Address",
                        text: $email,
                        placeholder: "name@example.com"
                    )
                    .keyboardType(.emailAddress)
                    .autocapitalization(.none)
                }

                Button {
                    isLoading = true
                    Task {
                        defer { isLoading = false }
                        do {
                            let signInDetails = SignInDetails(email: email)
                            let response = try await Auth.signIn(signInDetails: signInDetails)
                            try TokenStore.shared.save(Token(accessToken: response.accessToken, refreshToken: ""))
                            
                            otpEmail = email
                            showValidateOTP = true
                        } catch {
                            errorMessage = error.localizedDescription
                            showError = true
                        }
                    }
                } label: {
                    if isLoading {
                        ProgressView()
                            .tint(.white)
                            .padding(.vertical, 14)
                            .frame(maxWidth: .infinity)
                            .background(Color.blue)
                            .cornerRadius(8)
                    } else {
                        Text("Sign In")
                            .font(.headline)
                            .foregroundColor(.white)
                            .padding(.vertical, 14)
                            .frame(maxWidth: .infinity)
                            .background(Color.blue)
                            .cornerRadius(8)
                    }
                }
                .disabled(isLoading)
                .padding(.top, 10)
                .alert("Sign In Failed", isPresented: $showError) {
                    Button("OK", role: .cancel) {}
                } message: {
                    Text(errorMessage)
                }

                Button("Don't have an account? Sign Up") {
                    router.pop()
                    router.navigate(to: .signUp)
                }
            }
            .padding(.horizontal, 24)
            .sheet(isPresented: $showValidateOTP) {
                NavigationStack {
                    VStack {
                        ValidateOTPView(
                            isPresented: $showValidateOTP,
                            email: otpEmail
                        )
                    }
                    .navigationTitle("OTP Verification")
                    .navigationBarTitleDisplayMode(.inline)
                }
                .presentationDragIndicator(.visible)
            }
        }
    }

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
    LogInView().environment(AuthRouter()).environment(AuthSession.shared)
}
