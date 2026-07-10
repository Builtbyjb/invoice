/* Controls which view is rendered on initial load, depending on auth state */

import Observation
import SwiftUI

// Server side authentication state
enum ServerAuthState {
    case authenticated, notAuthenticated
}

// In app authentication state
enum AuthState {
    case undefined, authenticating, authenticated, notAuthenticated
}

struct MainView: View {
    @State private var authState: AuthState = .undefined

    var body: some View {
        Group {
            switch authState {
            case .undefined:
                InitLoadingView().task {
                    do {
                        authState = try await checkAuth()
                    } catch {
                        print(error.localizedDescription)
                    }
                }
            case .authenticating: ProgressView()
            case .authenticated: ContentView()
            case .notAuthenticated: AuthView()
            }

        }
    }

    func checkAuth() async throws -> AuthState {
        //        try to get token from keychain if no token, set authState to notAuthenticated
        // if token set authState to authentication and call signup function
        //        if let token = KeyChainH
        //        try await Task.sleep(for: .seconds(3))
        return .notAuthenticated
    }

}

#Preview {
    MainView()
}
