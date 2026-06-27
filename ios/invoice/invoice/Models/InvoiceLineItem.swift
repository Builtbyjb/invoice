//
//  InvoiceLineItem.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-27.
//

import Foundation

struct InvoiceLineItem: Identifiable, Hashable, Codable {
    let id: UUID
    var description: String
    var quantity: Double
    var unit: String
    var price: Double
    
    init(
        id: UUID = UUID(),
        description: String,
        quantity: Double,
        unit: String,
        price: Double
    ) {
        self.id = id
        self.description = description
        self.quantity = quantity
        self.unit = unit
        self.price = price
    }
    
    var total: Double {
        quantity * price
    }
}
