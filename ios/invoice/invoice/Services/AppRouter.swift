//
//  AppRouter.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-07-21.
//

import Observation
import SwiftUI

enum AppRoute: Hashable {
    case help
    case settings
    case notification
    case account
    case payment
    case legal
    case subscriptions
}

enum ClientFormRoute: Hashable {
    case create
    case edit(Client)
}

enum InvoiceFormRoute: Hashable {
    case create(Client?)
    case edit(Invoice)
}

@Observable
final class AppRouter {
    var path = NavigationPath()
    
    func navigate(to route: AppRoute) {
        path.append(route)
    }
    
    func pop() {
        guard !path.isEmpty else { return }
        path.removeLast()
    }
    
    func popToRoot() {
        path.removeLast(path.count)
    }
    
    @ViewBuilder
    func switchView(route: AppRoute) -> some View {
        switch route {
        case .help:
            HelpView()
        case .settings:
            SettingView()
        case .notification:
            NotificationView()
        case .account:
            AccountView()
        case .payment:
            PaymentView()
        case .legal:
            LegalView()
        case .subscriptions:
            SubscriptionsView()
        }
    }
    
    @ViewBuilder
    func switchToClientView(client: Client, clients: Binding<[Client]>) -> some View {
        ClientView(client: client, clients: clients)
    }
    
    @ViewBuilder
    func switchToClientCreateView(mode: ClientFormRoute, clients: Binding<[Client]>) -> some View {
        CreateClientView(mode: mode, clients: clients)
    }
}
