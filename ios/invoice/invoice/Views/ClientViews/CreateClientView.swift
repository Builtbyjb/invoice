//
//  CreateClientView.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-27.
//

import SwiftUI

struct CreateClientView: View {
    let mode: ClientFormRoute
    @Binding var clients: [Client]
    let onComplete: () -> Void
    
    @State private var name: String = ""
    @State private var email: String = ""
    @State private var phone: String = ""
    @State private var address: String = ""
    @State private var city: String = ""
    @State private var country: String = ""
    @State private var isSaving: Bool = false
    
    init(mode: ClientFormRoute, clients: Binding<[Client]>, onComplete: @escaping () -> Void) {
        self.mode = mode
        self._clients = clients
        self.onComplete = onComplete
        
        switch mode {
        case .create:
            break
        case .edit(let client):
            _name = State(initialValue: client.name)
            _email = State(initialValue: client.email)
            _phone = State(initialValue: client.phone)
            _address = State(initialValue: client.address)
            _city = State(initialValue: client.city)
            _country = State(initialValue: client.country)
        }
    }
    
    var isFormValid: Bool {
        !name.isEmpty && !email.isEmpty
    }
    
    var title: String {
        switch mode {
        case .create: return "New Client"
        case .edit: return "Edit Client"
        }
    }
    
    var body: some View {
        Form {
            Section("Contact Information") {
                LabeledTextField(title: "Name", text: $name, icon: "person.fill")
                LabeledTextField(title: "Email", text: $email, icon: "envelope.fill", keyboard: .emailAddress)
                LabeledTextField(title: "Phone Number", text: $phone, icon: "phone.fill", keyboard: .phonePad)
            }
            
            Section("Address") {
                LabeledTextField(title: "Street Address", text: $address, icon: "house.fill")
                LabeledTextField(title: "City", text: $city, icon: "building.2.fill")
                LabeledTextField(title: "Country", text: $country, icon: "globe")
            }
        }
        .navigationTitle(title)
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .cancellationAction) {
                Button {
                    onComplete()
                } label: {
                    Image(systemName: "xmark")
                        .font(.system(size: 17, weight: .semibold))
                }
            }
            ToolbarItem(placement: .confirmationAction) {
                Button {
                    save()
                } label: {
                    if isSaving {
                        ProgressView()
                    } else {
                        Image(systemName: "checkmark")
                            .font(.system(size: 17, weight: .semibold))
                    }
                }
                .disabled(!isFormValid || isSaving)
            }
        }
    }
    
    private func save() {
        isSaving = true
        
        // Simulate async save
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            switch mode {
            case .create:
                let newClient = Client(
                    name: name,
                    email: email,
                    phone: phone,
                    address: address,
                    city: city,
                    country: country
                )
                clients.append(newClient)
            case .edit(let existing):
                if let index = clients.firstIndex(where: { $0.id == existing.id }) {
                    clients[index].name = name
                    clients[index].email = email
                    clients[index].phone = phone
                    clients[index].address = address
                    clients[index].city = city
                    clients[index].country = country
                }
            }
            isSaving = false
            onComplete()
        }
    }
}

struct LabeledTextField: View {
    let title: String
    @Binding var text: String
    let icon: String
    var keyboard: UIKeyboardType = .default
    
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .foregroundColor(.secondary)
                .frame(width: 24)
            TextField(title, text: $text)
                .keyboardType(keyboard)
        }
        .padding(.vertical, 4)
    }
}

#Preview {
    NavigationStack {
        CreateClientView(mode: .create, clients: .constant([])) {}
    }
}
