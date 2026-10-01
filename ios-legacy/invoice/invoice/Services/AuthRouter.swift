//
//  AuthRouter.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-07-21.
//

import Observation
import SwiftUI

enum AuthRoute: Hashable {
    case logIn
    case signUp
}

@Observable
final class AuthRouter {
    var path = NavigationPath()
    
    func navigate(to route: AuthRoute) {
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
    func switchView(route: AuthRoute) -> some View {
        switch route {
        case .logIn:
            LogInView()
        case .signUp:
            SignUpView()
        }
    }
}
