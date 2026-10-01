//
//  SearchDropdownView.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-07-27.
//

import SwiftUI

struct SearchDropdownView<T: Identifiable>: View {
    @Binding var selection: T?
    let placeholder: String
    let titleKeyPath: KeyPath<T, String>
    let subtitleKeyPath: KeyPath<T, String>?
    let search: (String) async throws -> [T]

    @State private var query: String = ""
    @State private var results: [T] = []
    @State private var isLoading: Bool = false
    @State private var searchTask: Task<Void, Never>?
    @FocusState private var searchFocused: Bool

    init(
        selection: Binding<T?>,
        placeholder: String,
        titleKeyPath: KeyPath<T, String>,
        subtitleKeyPath: KeyPath<T, String>? = nil,
        search: @escaping (String) async throws -> [T]
    ) {
        self._selection = selection
        self.placeholder = placeholder
        self.titleKeyPath = titleKeyPath
        self.subtitleKeyPath = subtitleKeyPath
        self.search = search
    }

    var body: some View {
        HStack(spacing: 6) {
            TextField(placeholder, text: $query)
                .focused($searchFocused)
                .multilineTextAlignment(.trailing)
                .textInputAutocapitalization(.never)
                .autocorrectionDisabled()

            if !query.isEmpty {
                Button {
                    selection = nil
                    query = ""
                } label: {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundColor(.secondary)
                }
                .buttonStyle(.borderless)
            }
        }
        .popover(
            isPresented: Binding(
                get: { searchFocused },
                set: { if !$0 { searchFocused = false } }
            ),
            arrowEdge: .top
        ) {
            resultsPanel
                .presentationCompactAdaptation(.popover)
        }
        .onChange(of: query) { _, newQuery in
            guard searchFocused else { return }
            debouncedSearch(newQuery)
        }
        .onChange(of: searchFocused) { _, focused in
            if focused {
                performSearch(query)
            } else {
                searchTask?.cancel()
                results = []
                query = selection?[keyPath: titleKeyPath] ?? ""
            }
        }
        .onDisappear {
            searchTask?.cancel()
        }
    }

    private var resultsPanel: some View {
        VStack(spacing: 0) {
            if isLoading {
                ProgressView()
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
            } else if results.isEmpty {
                Text(query.isEmpty ? "No items" : "No results for \"\(query)\"")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
            } else {
                ScrollView {
                    LazyVStack(alignment: .leading, spacing: 0) {
                        ForEach(results) { item in
                            Button {
                                select(item)
                            } label: {
                                VStack(alignment: .leading, spacing: 2) {
                                    Text(item[keyPath: titleKeyPath])
                                        .foregroundColor(.primary)
                                    if let subtitleKeyPath {
                                        Text(item[keyPath: subtitleKeyPath])
                                            .font(.caption)
                                            .foregroundColor(.secondary)
                                    }
                                }
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .padding(.horizontal, 12)
                                .padding(.vertical, 8)
                                .contentShape(Rectangle())
                                .cornerRadius(0)
                            }
                            .buttonStyle(.plain)
                        }
                    }
                }
                .frame(maxHeight: 240)
            }
        }
        .frame(width: 280)
    }

    private func select(_ item: T) {
        searchTask?.cancel()
        selection = item
        searchFocused = false
        query = item[keyPath: titleKeyPath]
        results = []
    }

    private func debouncedSearch(_ query: String) {
        searchTask?.cancel()
        searchTask = Task {
            try? await Task.sleep(for: .milliseconds(300))
            guard !Task.isCancelled else { return }
            await runSearch(query)
        }
    }

    private func performSearch(_ query: String) {
        searchTask?.cancel()
        searchTask = Task {
            await runSearch(query)
        }
    }

    private func runSearch(_ query: String) async {
        await MainActor.run { isLoading = true }
        do {
            let items = try await search(query)
            await MainActor.run {
                results = items
                isLoading = false
            }
        } catch is CancellationError {
            // A newer search superseded this one; leave state alone.
        } catch {
            await MainActor.run { isLoading = false }
            print(error.localizedDescription)
        }
    }
}

#Preview {
    @Previewable @State var selection: Client?

    Form {
        Section("Invoice Information") {
            HStack {
                Text("Client")
                Spacer()
                SearchDropdownView(
                    selection: $selection,
                    placeholder: "Select a client",
                    titleKeyPath: \.name,
                    subtitleKeyPath: \.email
                ) { query in
                    try? await Task.sleep(for: .milliseconds(300))
                    if query.isEmpty { return DemoData.clients }
                    return DemoData.clients.filter {
                        $0.name.localizedCaseInsensitiveContains(query)
                            || $0.email.localizedCaseInsensitiveContains(query)
                    }
                }
            }
        }
    }
}
