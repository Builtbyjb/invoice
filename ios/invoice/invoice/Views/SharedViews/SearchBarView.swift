//
//  SearchBarView.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-29.
//

import SwiftUI

struct SearchToken: Equatable {
    var tag: String
    var value: String
    var label: String
}

struct SearchBarView<T>: View {
    let onSearch: ((T) -> Void)?
    @Binding var showSearchBar: Bool
    @Binding var searchText: String
    @Binding private var token: SearchToken?
    private var placeholder: String

    init(
        showSearchBar: Binding<Bool>,
        searchText: Binding<String>,
        placeholder: String,
        token: Binding<SearchToken?>? = nil,
        onSearch: ((T) -> Void)?
    ) {
        self._showSearchBar = showSearchBar
        self._searchText = searchText
        self._token = token ?? .constant(nil)
        self.placeholder = placeholder
        self.onSearch = onSearch
    }

    var body: some View {
        HStack(spacing: 8) {
            HStack(spacing: 8) {
                Image(systemName: "magnifyingglass")
                    .foregroundColor(.secondary)
                if let token {
                    HStack(spacing: 4) {
                        Text(token.tag)
                            .foregroundColor(.secondary)
                        Text(token.label)
                        Button {
                            self.token = nil
                        } label: {
                            Image(systemName: "xmark.circle.fill")
                                .foregroundColor(.secondary)
                        }
                    }
                    .font(.subheadline)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 6)
                    .background(Color.blue.opacity(0.15), in: Capsule())
                    .clipShape(Capsule())
                }
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
            .clipShape(RoundedRectangle(cornerRadius: 32))
            .overlay(
                RoundedRectangle(cornerRadius: 32)
                    .stroke(Color.black.opacity(0.1), lineWidth: 1)
            )
            .shadow(
                color: .black.opacity(0.15),
                radius: 8,
                x: 0,
                y: 4
            )

            Button {
                searchText = ""
                token = nil
                showSearchBar = false
            } label: {
                Image(systemName: "xmark")
                    .padding(11)
                    .foregroundColor(.primary)
            }
            .buttonStyle(.glass)
            .glassEffect(.regular, in: RoundedRectangle(cornerRadius: 32))
            .buttonBorderShape(.roundedRectangle(radius: 32))
            .clipShape(RoundedRectangle(cornerRadius: 32))
            .overlay(
                RoundedRectangle(cornerRadius: 32)
                    .stroke(Color.black.opacity(0.1), lineWidth: 1)
            )
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

extension SearchBarView where T == Client {
    init(
        showSearchBar: Binding<Bool>,
        searchText: Binding<String>,
        placeholder: String,
        token: Binding<SearchToken?>? = nil
    ) {
        self.init(
            showSearchBar: showSearchBar,
            searchText: searchText,
            placeholder: placeholder,
            token: token,
            onSearch: nil
        )
    }
}

#Preview {
    SearchBarView(showSearchBar: .constant(true), searchText: .constant(""), placeholder: "Search")
}
