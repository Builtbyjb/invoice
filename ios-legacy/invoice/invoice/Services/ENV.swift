//
//  Environment.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-07-13.
//

import Foundation

enum ENV {
    case development
    case testFlight
    case production
    
    static var current: ENV {
        #if DEBUG
        return .development
        #else
        let receiptName = Bundle.main.appStoreReceiptURL?.lastPathComponent
        if receiptName == "sandboxReceipt" {
            return .testFlight
        } else {
            return .production
        }
        #endif
    }
    
    var baseURL: URL {
        switch self {
        case .development:
            return URL(string: "http://localhost:8585")!
        case .testFlight:
            return URL(string: "https://invoice-server-staging.acorp.app")!
        case .production:
            return URL(string: "https://invoice-server.acorp.app")!
        }
    }
}
