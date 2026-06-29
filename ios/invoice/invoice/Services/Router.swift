//
//  Router.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-26.
//
import Observation
import SwiftUI

enum Route: Hashable {
    case logIn
    case signUp
    case help
    case settings
    case notification
    case createClient
//    case createInvoice
//    case clientView
}

@Observable
class Router {
    static let shared = Router()
    private init() {} // Makes the router class a singleton
    
    var path = NavigationPath()

    func navigate(to route: Route) {
        path.append(route)
    }

    func pop() {
        path.removeLast()
    }

    func popToRoot() {
        path.removeLast(path.count)
    }

    @ViewBuilder
    func switchView(route: Route) -> some View {
        switch route {
        case .logIn: LogInView()
        case .signUp: SignUpView()
        case .help: HelpView()
        case .settings: SettingView()
        case .notification: NotificationView()
        case .createClient: CreateClientView(mode: .create, clients: .constant([]))
//        case .createInvoice: CreateInvoiceView()
//        case .clientView: ClientView(client: .constant(.mock))
        }
    }
}
