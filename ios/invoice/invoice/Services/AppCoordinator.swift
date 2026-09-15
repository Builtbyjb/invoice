//
//  AppCoordinator.swift
//  invoice
//
//  Created by OpenCode on 2026-07-22.
//

import Observation
import SwiftUI

enum AppTab: Hashable {
    case home
    case clients
    case invoices
    case referral
}

enum DeepLink: Equatable {
    case client(id: String)
    case invoice(id: String)
}

@MainActor
@Observable
final class AppCoordinator {
    var selectedTab: AppTab = .home

    // One-shot filter handed to InvoicesView when switching tabs from a client detail.
    var pendingInvoiceSearchToken: SearchToken? = nil
    
    let homeRouter = AppRouter()
    let clientsRouter = AppRouter()
    let invoicesRouter = AppRouter()
    let referralRouter = AppRouter()
    
    // Switches to the target tab and pushes the resolved detail onto that tab's stack.
    // The small delay ensures the tab's NavigationStack is mounted before its path changes.
    func handle(_ link: DeepLink) async {
        switch link {
        case .client(let id):
            let client: Client
            do {
                let response = try await Client.fetch(id: id)
                if let res = response.data {
                   client =  res
                } else { return }
            } catch {
                selectedTab = .clients
                return
            }
            selectedTab = .clients
            try? await Task.sleep(for: .milliseconds(50))
            clientsRouter.path.append(client)
            
        case .invoice(let id):
            let invoice: Invoice
            do {
                let response = try await Invoice.fetch(id: id)
                if let res = response.data {
                    invoice =  res
                } else { return }
            } catch {
                selectedTab = .invoices
                return
            }
            selectedTab = .invoices
            try? await Task.sleep(for: .milliseconds(50))
            invoicesRouter.path.append(invoice)
        }
    }
}
