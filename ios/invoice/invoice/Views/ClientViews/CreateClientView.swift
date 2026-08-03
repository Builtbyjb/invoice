//
//  CreateClientView.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-27.
//

import SwiftUI

struct CreateClientView: View {
    let mode: ClientFormMode
    let onSave: ((Client) -> Void)?
    @Environment(\.dismiss) var dismiss

    @State private var name: String = ""
    @State private var email: String = ""
    @State private var phone: String = ""
    @State private var address: String = ""
    @State private var city: String = ""
    @State private var country: String = ""
    @State private var note: String = ""
    @State private var isSaving: Bool = false

    init(mode: ClientFormMode, onSave: ((Client) -> Void)? = nil) {
        self.mode = mode
        self.onSave = onSave

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
            _note = State(initialValue: client.note ?? "")
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
        NavigationStack {
            Form {
                Section("Contact Information") {
                    LabeledTextField(
                        title: "Name",
                        text: $name,
                        icon: "person.fill"
                    )
                    LabeledTextField(
                        title: "Email",
                        text: $email,
                        icon: "envelope.fill",
                        keyboard: .emailAddress
                    )
                    LabeledTextField(
                        title: "Phone Number",
                        text: $phone,
                        icon: "phone.fill",
                        keyboard: .phonePad
                    )
                }

                Section("Address") {
                    LabeledTextField(
                        title: "Street Address",
                        text: $address,
                        icon: "house.fill"
                    )
                    LabeledTextField(
                        title: "City",
                        text: $city,
                        icon: "building.2.fill"
                    )
                    LabeledTextField(
                        title: "Country",
                        text: $country,
                        icon: "globe"
                    )
                }

                Section("Notes") {
                    TextEditor(text: $note)
                        .frame(minHeight: 100)
                }
            }
            .navigationTitle(title)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button {
                        dismiss()
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
    }

    private func save() {
        guard isFormValid else { return }
        isSaving = true

        Task {
            do {
                switch mode {
                case .create:
                    let response = try await Client.create(
                        name: name,
                        email: email,
                        phone: phone,
                        address: address,
                        city: city,
                        country: country,
                        note: note
                    )
                    print(response)
                    await MainActor.run {
                        if let client = response.data {
                            onSave?(client)
                        }
                    }
                case .edit(let existing):
                    let response = try await Client.update(
                        id: existing.id,
                        name: name,
                        email: email,
                        phone: phone,
                        address: address,
                        city: city,
                        country: country,
                        note: note
                    )
                    await MainActor.run {
                        if let client = response.data {
                            onSave?(client)
                        }
                    }
                }
                await MainActor.run {
                    isSaving = false
                    dismiss()
                }
            } catch {
                await MainActor.run {
                    isSaving = false
                }
                print("Failed to save client: \(error)")
            }
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
                .autocapitalization(.none)
        }
        .padding(.vertical, 4)
    }
}

#Preview {
    CreateClientView(mode: .create)
}
