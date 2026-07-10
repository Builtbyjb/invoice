//
//  Client.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-07-10.
//

public struct Client: Equatable, Hashable, Identifiable {
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

    static func fetchClients() async throws -> [Client] {
        //        Get access token from keyChain
        //        Add the access token to the request
        //       The needed data should be encoded in the access token
        return []
    }
}
