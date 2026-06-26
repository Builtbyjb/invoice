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
    @State private var router = Router()

    var body: some View {
        Group {
            NavigationStack(path: $router.path) {
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
                case .authenticating:
                    ProgressView()
                case .authenticated:
                    ContentView().navigationDestination(for: Route.self){ route in
                        router.switchView(route: route)
                        
                    }.toolbar{
                        ToolbarItemGroup(placement: .topBarTrailing) {
                            ControlGroup {
                                Button(action: {
                                    router.navigate(to: .help)
                                }) {
                                    Image(systemName: "questionmark.circle")
                                }
                                Button(action: {
                                    router.navigate(to: .notification)
                                }) {
                                    Image(systemName: "bell")
                                }
                                Button(action: {
                                    router.navigate(to: .settings)
                                    
                                }) {
                                    Image(systemName: "gear")
                                }
                            }
                        }
                    }
                case .notAuthenticated:
                    AuthView().navigationDestination(for: Route.self) { route in
                        router.switchView(route: route)
                    }
                }

            }
        }.environment(router)
    }

    func checkAuth(demo: AuthState) async throws -> AuthState {
        try await Task.sleep(for: .seconds(3))
        return demo
    }

}

#Preview {
    MainView()
}
