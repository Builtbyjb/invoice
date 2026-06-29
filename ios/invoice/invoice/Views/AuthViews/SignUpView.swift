//
//  SignUpView.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-26.
//

import SwiftUI

struct SignUpView: View {
    @Environment(Router.self) var router
    
    // Form Input States
    @State private var email = ""
    @State private var firstName = ""
    @State private var lastName = ""
    @State private var username = ""
    @State private var businessName = ""
    @State private var selectedCountry = "United States"
    
    // Sample Country List (Expand as needed)
    let countries = ["United States", "Canada", "United Kingdom", "Australia", "Germany"]
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                
                // View Title
                Text("Create your account")
                    .font(.system(size: 28, weight: .bold))
                    .foregroundColor(.primary)
                    .padding(.top, 20)
                
                // Form Fields
                VStack(spacing: 16) {
                    customTextField(title: "First Name", text: $firstName, placeholder: "John")
                    customTextField(title: "Last Name", text: $lastName, placeholder: "Doe")
                    customTextField(title: "Email Address", text: $email, placeholder: "name@example.com")
                        .keyboardType(.emailAddress)
                        .autocapitalization(.none)
                    customTextField(title: "Username", text: $username, placeholder: "johndoe123")
                        .autocapitalization(.none)
                    customTextField(title: "Business Name", text: $businessName, placeholder: "Acme Corp")
                    
                    // Country Dropdown (Picker)
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Country")
                            .font(.footnote.weight(.semibold))
                            .foregroundColor(.gray)
                        
                        Picker("Select Country", selection: $selectedCountry) {
                            ForEach(countries, id: \.self) { country in
                                Text(country).tag(country)
                            }
                        }
                        .pickerStyle(.menu)
                        .padding()
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(Color(.systemGray6))
                        .cornerRadius(8)
                    }
                }
                
                // Submit Button
                Button {
                    // Handle sign up action here
                } label: {
                    Text("Sign Up")
                        .font(.headline)
                        .foregroundColor(.white)
                        .padding(.vertical, 14)
                        .frame(maxWidth: .infinity)
                        .background(Color.blue)
                        .cornerRadius(8)
                }
                .padding(.top, 10)
                
                Button("Already have an account? Sign In") {
                    // Remove last item on the navigation stack which is the LogInView
                    router.pop()

                    router.navigate(to: .logIn)
                }
                
            }
            .padding(.horizontal, 24)
        }
    }
    
    // Helper view building component for input fields
    @ViewBuilder
    private func customTextField(title: String, text: Binding<String>, placeholder: String) -> some View {
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
    SignUpView().environment(Router.shared)
}
