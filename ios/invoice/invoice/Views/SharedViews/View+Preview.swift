//
//  View+Preview.swift
//  invoice
//
//  Shared preview environment wrapper that injects the same root-level objects
//  supplied by AcorpInvoiceApp.swift at the WindowGroup.
//

#if DEBUG
import SwiftUI

extension View {
    // Injects the root environment objects that `AcorpInvoiceApp` sets up at the `WindowGroup`.
    // Apply this to `#Preview` blocks whose view hierarchy reads `AuthSession`, `NotificationStore`, or `PushNotificationManager`.
    func withPreviewEnvironment() -> some View {
        self
            .environment(AuthSession.shared)
            .environment(NotificationStore.shared)
            .environment(PushNotificationManager.shared)
    }
}
#endif
