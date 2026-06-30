//
//  ClientCardView.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-29.
//

import SwiftUI

struct ClientCard: View {
    let client: Client
    
    var body: some View {
        HStack(spacing: 16) {
            ZStack {
                Circle()
                    .fill(Color.blue.opacity(0.15))
                    .frame(width: 48, height: 48)
                Text(String(client.name.prefix(1)))
                    .font(.system(size: 20, weight: .semibold))
                    .foregroundColor(.blue)
            }
            
            VStack(alignment: .leading, spacing: 4) {
                Text(client.name)
                    .font(.headline)
                    .foregroundColor(.primary)
                
                Text(client.displayContact)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .lineLimit(1)
                
                Text(client.displayLocation)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            Spacer()
            
            Image(systemName: "chevron.right")
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .padding()
        .background(Color(.systemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 16)) // 2. Add border radius
        .overlay(
            RoundedRectangle(cornerRadius: 16) // 3. Match the shape for the border
                .stroke(Color.black.opacity(0.05), lineWidth: 1)
        )
        .shadow(color: .black.opacity(0.1), radius: 4, x: 0, y: 2)
    }
}
