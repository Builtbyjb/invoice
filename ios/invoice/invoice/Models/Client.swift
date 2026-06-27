//
//  Client.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-27.
//

import Foundation

struct Client: Identifiable, Hashable, Codable {
    let id: UUID
    var name: String
    var email: String
    var phone: String
    var address: String
    var city: String
    var country: String
    
    init(
        id: UUID = UUID(),
        name: String,
        email: String,
        phone: String,
        address: String,
        city: String,
        country: String
    ) {
        self.id = id
        self.name = name
        self.email = email
        self.phone = phone
        self.address = address
        self.city = city
        self.country = country
    }
    
    var displayContact: String {
        if !email.isEmpty && !phone.isEmpty {
            return "\(email) · \(phone)"
        } else if !email.isEmpty {
            return email
        } else if !phone.isEmpty {
            return phone
        }
        return "No contact info"
    }
    
    var displayLocation: String {
        if !city.isEmpty && !country.isEmpty {
            return "\(city), \(country)"
        } else if !city.isEmpty {
            return city
        } else if !country.isEmpty {
            return country
        }
        return "No location"
    }
}
