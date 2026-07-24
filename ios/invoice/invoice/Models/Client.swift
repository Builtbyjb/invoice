//
//  Client.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-07-10.
//

struct ClientResponse: Decodable {
    public var message: String
    public var clients: [Client]
}

private struct ClientRequest: Encodable {
    let name: String
    let email: String
    let phone: String
    let address: String
    let city: String
    let country: String
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
        self.createdAt = createdAt
    }

    static func fetchClients() async throws -> ClientResponse {
        return try await APIClient.shared.request(
            path: "/api/v1/clients",
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
        country: String
    ) async throws -> Client {
        let body = ClientRequest(
            name: name,
            email: email,
            phone: phone,
            address: address,
            city: city,
            country: country
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
        country: String
    ) async throws -> Client {
        let body = ClientRequest(
            name: name,
            email: email,
            phone: phone,
            address: address,
            city: city,
            country: country
        )
        return try await APIClient.shared.request(
            path: "/api/v1/clients/\(id)",
            method: "PUT",
            body: body,
            requiresAuth: true
        )
    }
    
    static func fetch(id: String) async throws -> Client {
        #if DEBUG
        if DemoData.client.id == id { return DemoData.client }
        #endif
        return try await APIClient.shared.request(
            path: "/api/v1/clients/\(id)",
            method: "GET",
            requiresAuth: true
        )
    }
}

