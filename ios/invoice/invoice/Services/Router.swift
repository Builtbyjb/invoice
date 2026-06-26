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
    
}

@Observable
class Router {
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
}
