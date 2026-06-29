//
//  SearchBarView.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-29.
//

import SwiftUI

struct SearchBarView: View {
    @Binding var showSearchBar: Bool
    @Binding var searchText: String
    private var placeholder: String
    
    init(showSearchBar: Binding<Bool>, searchText: Binding<String>, placeholder: String) {
        self._showSearchBar = showSearchBar
        self._searchText = searchText
        self.placeholder = placeholder
    }
    
    var body: some View {
        HStack(spacing: 8) {
            HStack(spacing: 8) {
                Image(systemName: "magnifyingglass")
                    .foregroundColor(.secondary)
                TextField(placeholder, text: $searchText)
                if !searchText.isEmpty {
                    Button {
                        searchText = ""
                    } label: {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundColor(.secondary)
                    }
                }
            }
            .padding()
            .glassEffect(.regular, in: RoundedRectangle(cornerRadius: 32))
            .shadow(
                color: .black.opacity(0.15),
                radius: 8,
                x: 0,
                y: 4
            )

            Button {
                searchText = ""
                showSearchBar = false
            } label: {
                Image(systemName: "xmark")
                    .padding(11)
                    .foregroundColor(.primary)
            }
            .buttonStyle(.glass)
            .glassEffect(.regular, in: RoundedRectangle(cornerRadius: 32))
            .buttonBorderShape(.roundedRectangle(radius: 32))
            .shadow(
                color: .black.opacity(0.15),
                radius: 8,
                x: 0,
                y: 4
            )
        }
        .padding(.horizontal, 16)
        .padding(.bottom, 8)
    }
}

#Preview {
    SearchBarView(showSearchBar: .constant(true), searchText: .constant(""), placeholder: "Search")
}
