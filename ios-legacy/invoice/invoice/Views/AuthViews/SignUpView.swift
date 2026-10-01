//
//  SignUpView.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-26.
//

import SwiftUI

struct SignUpView: View {
    @Environment(AuthRouter.self) var router
    @Environment(AuthSession.self) private var authSession

    // Form Input States
    @State private var email = ""
    @State private var firstName = ""
    @State private var lastName = ""
    @State private var referral = ""
    @State private var businessName = ""
    @State private var selectedCountry = "United States"

    @State private var isLoading = false
    @State private var showError = false
    @State private var errorMessage = ""
    @State private var showValidateOTP: Bool = false
    @State private var otpEmail: String = ""

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                titleView
                formFields
                signUpButton
                signInLink
            }
            .padding(.horizontal, 24)
            .frame(maxHeight: .infinity)
            .contentShape(Rectangle())
        }
        .sheet(isPresented: $showValidateOTP) {
            NavigationStack {
                VStack {
                    ValidateOTPView(
                        isPresented: $showValidateOTP,
                        email: otpEmail,
                    )
                }
                .navigationTitle("OTP Verification")
                .navigationBarTitleDisplayMode(.inline)
            }
            .presentationDragIndicator(.visible)
        }
    }

    private var titleView: some View {
        Text("Create your account")
            .font(.system(size: 28, weight: .bold))
            .foregroundColor(.primary)
            .padding(.top, 20)
    }

    private var formFields: some View {
        VStack(alignment: .leading, spacing: 12) {
            customTextField(title: "First Name", text: $firstName, placeholder: "John")
            customTextField(title: "Last Name", text: $lastName, placeholder: "Doe")
            customTextField(title: "Email Address", text: $email, placeholder: "name@example.com")
                .keyboardType(.emailAddress)
                .autocapitalization(.none)
            customTextField(title: "Business Name", text: $businessName, placeholder: "Acme Corp")
            countryPicker
            customTextField(title: "Referral Code", text: $referral, placeholder: "", isRequired: false)
        }
    }

    @ViewBuilder
    private var countryPicker: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack {
                Text("Country")
                    .font(.footnote.weight(.semibold))
                    .foregroundColor(.gray)
                
                Text("*")
                    .foregroundColor(.red)
                    .font(.footnote.weight(.semibold))
            }

            Picker("Select Country", selection: $selectedCountry) {
                ForEach(countries, id: \.self) { country in
                    Text(country)
                }
            }.pickerStyle(.menu)
                .padding(6)
                .frame(minWidth: 350, alignment: .leading)
                .background(Color(.systemGray6))
                .cornerRadius(8)
        }
    }

    private var signUpButton: some View {
        Button {
            isLoading = true
            Task {
                defer { isLoading = false }
                do {
                    let signUpDetails = SignUpDetails(
                        email: email,
                        firstname: firstName,
                        lastname: lastName,
                        referral: referral,
                        businessName: businessName,
                        country: selectedCountry
                    )
                    let response = try await Auth.signUp(signUpDetails: signUpDetails)
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
                Text("Sign Up")
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
        .alert("Sign Up Failed", isPresented: $showError) {
            Button("OK", role: .cancel) {}
        } message: {
            Text(errorMessage)
        }
    }

    private var signInLink: some View {
        Button("Already have an account? Sign In") {
            // Remove last item on the navigation stack which is the LogInView
            router.pop()
            router.navigate(to: .logIn)
        }
    }

    @ViewBuilder
    private func customTextField(
        title: String,
        text: Binding<String>,
        placeholder: String,
        isRequired: Bool = true
    ) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack {
                Text(title)
                    .font(.footnote.weight(.semibold))
                    .foregroundColor(.gray)

                if isRequired {
                    Text("*")
                        .foregroundColor(.red)
                        .font(.footnote.weight(.semibold))
                }
            }

            TextField(placeholder, text: text)
                .padding(12)
                .background(Color(.systemGray6))
                .cornerRadius(8)
        }
    }
}

#Preview {
    SignUpView().environment(AuthRouter()).environment(AuthSession.shared)
}
