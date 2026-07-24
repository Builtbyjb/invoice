/* Controls which view is rendered on initial load, depending on auth state */

import SwiftUI

struct MainView: View {
    @Environment(AuthSession.self) private var authSession

    var body: some View {
        Group {
            switch authSession.state {
            case .undefined:
                InitLoadingView()
            case .authenticated:
                ContentView()
            case .notAuthenticated:
                AuthView()
            }
        }.task {
            await authSession.initialize()
        }
    }
}

#Preview {
    MainView().environment(AuthSession.shared)
}
