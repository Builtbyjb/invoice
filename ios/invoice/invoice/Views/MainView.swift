/* Controls which view is rendered on initial load, depending on auth state */

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
                            authState = try await checkAuth(
                                demo: .authenticated
                            )

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

    func checkAuth(demo: AuthState) async throws -> AuthState {
        try await Task.sleep(for: .seconds(3))
        return demo
    }

}

#Preview {
    MainView()
}
