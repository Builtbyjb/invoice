//
//  Client.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-07-10.
//

import Foundation

private struct ClientRequest: Encodable {
    let name: String
    let email: String
    let phone: String
    let address: String
    let city: String
    let country: String
    let note: String
}

public struct Client: Equatable, Hashable, Identifiable, Codable {
    public var id: String
    public var organizationId: UInt64
    public var name: String
    public var email: String
    public var phone: String
    public var address: String
    public var city: String
    public var country: String
    public var note: String?
    public var createdAt: String

    public init(
        id: String,
        organizationId: UInt64,
        name: String,
        email: String,
        phone: String,
        address: String,
        city: String,
        country: String,
        note: String,
        createdAt: String
    ) {
        self.id = id
        self.organizationId = organizationId
        self.name = name
        self.email = email
        self.phone = phone
        self.address = address
        self.city = city
        self.country = country
        self.note = note
        self.createdAt = createdAt
    }

    static func fetchClients() async throws -> Response<[Client]> {
        return try await APIClient.shared.request(
            path: "/api/v1/clients",
            method: "GET",
            requiresAuth: true
        )
    }

    static func search(query: String) async throws -> Response<[Client]> {
        let encoded = query.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? query
        return try await APIClient.shared.request(
            path: "/api/v1/clients?search=\(encoded)",
            method: "GET",
            requiresAuth: true
        )
    }

    static func create(
        name: String,
        email: String,
        phone: String,
        address: String,
        city: String,
        country: String,
        note: String
    ) async throws -> Response<Client> {
        let body = ClientRequest(
            name: name,
            email: email,
            phone: phone,
            address: address,
            city: city,
            country: country,
            note: note,
        )
        return try await APIClient.shared.request(
            path: "/api/v1/clients/create",
            method: "POST",
            body: body,
            requiresAuth: true
        )
    }

    static func update(
        id: String,
        name: String,
        email: String,
        phone: String,
        address: String,
        city: String,
        country: String,
        note: String
    ) async throws -> Response<Client> {
        let body = ClientRequest(
            name: name,
            email: email,
            phone: phone,
            address: address,
            city: city,
            country: country,
            note: note
        )
        return try await APIClient.shared.request(
            path: "/api/v1/clients/\(id)/edit",
            method: "PUT",
            body: body,
            requiresAuth: true
        )
    }

    static func fetch(id: String) async throws -> Response<Client> {
        return try await APIClient.shared.request(
            path: "/api/v1/clients/\(id)",
            method: "GET",
            requiresAuth: true
        )
    }
    
    static func delete(id: String) async throws -> Response<Client> {
        return try await APIClient.shared.request(
            path: "/api/v1/clients/\(id)/delete",
            method: "DELETE",
            requiresAuth: true
        )
    }
}
