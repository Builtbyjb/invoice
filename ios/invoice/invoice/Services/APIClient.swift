//
//  APIClient.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-07-15.
//

import Foundation

struct APIErrorResponse: Codable {
    let message: String
}

enum APIError: LocalizedError {
    case invalidURL
    case encodingFailed
    case decodingFailed
    case networkError(URLError)
    case unauthorized
    case serverError(statusCode: Int, message: String)
    case unknown

    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "Invalid URL"
        case .encodingFailed:
            return "Failed to encode request"
        case .decodingFailed:
            return "Failed to decode response"
        case .networkError(let urlError):
            return urlError.localizedDescription
        case .unauthorized:
            return "Unauthorized. Please sign in again."
        case .serverError(let statusCode, let message):
            return "Error \(statusCode): \(message)"
        case .unknown:
            return "An unknown error occurred"
        }
    }
}

// Serializes concurrent token refresh attempts into a single network call.
actor TokenRefresher {
    static let shared = TokenRefresher()
    private init() {}

    private var currentTask: Task<Token, Error>?

    func refresh() async throws -> Token {
        if let task = currentTask {
            return try await task.value
        }

        let task = Task { () -> Token in
            guard let token = try await TokenStore.shared.read() else {
                throw APIError.unauthorized
            }
            let newToken = try await Auth.refresh(refreshToken: token.refreshToken)
            try await TokenStore.shared.save(newToken)
            return newToken
        }

        currentTask = task
        defer { currentTask = nil }

        return try await task.value
    }
}

final class APIClient {
    static let shared = APIClient()
    private init() {}

    func request<T: Decodable>(
        path: String,
        method: String,
        body: Encodable? = nil,
        requiresAuth: Bool = false,
    ) async throws -> T {
        // Get base URL
        let baseURL = ENV.current.baseURL.appendingPathComponent(path)
        guard let url = URL(string: baseURL.absoluteString) else { throw APIError.invalidURL }

        var request = URLRequest(url: url)
        request.httpMethod = method
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        if requiresAuth {
            guard let token = try TokenStore.shared.read() else {
                AuthSession.shared.handleUnauthorized()
                throw APIError.unauthorized
            }

            request.setValue("Bearer \(token.accessToken)", forHTTPHeaderField: "Authorization")
        }

        if let body = body { request.httpBody = try JSONEncoder().encode(body) }

        let (data, httpResponse) = try await performRequest(request)

        // Retry request is access token is expired
        if httpResponse.statusCode == 401, requiresAuth {
            do {
                let newToken = try await TokenRefresher.shared.refresh()
                request.setValue("Bearer \(newToken.accessToken)", forHTTPHeaderField: "Authorization")
                let (retryData, retryResponse) = try await performRequest(request)
                if retryResponse.statusCode == 401 {
                    AuthSession.shared.handleUnauthorized()
                    throw APIError.unauthorized
                }
                return try decodeResponse(retryData, response: retryResponse)
            } catch APIError.unauthorized {
                AuthSession.shared.handleUnauthorized()
                throw APIError.unauthorized
            }
        }

        return try decodeResponse(data, response: httpResponse)
    }

    private func performRequest(_ request: URLRequest) async throws -> (Data, HTTPURLResponse) {
        let (data, response): (Data, URLResponse)
        do {
            (data, response) = try await URLSession.shared.data(for: request)
        } catch let urlError as URLError {
            throw APIError.networkError(urlError)
        } catch {
            throw APIError.unknown
        }

        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.unknown
        }

        return (data, httpResponse)
    }

    private func decodeResponse<T: Decodable>(_ data: Data, response: HTTPURLResponse) throws -> T {
        let statusCode = response.statusCode

        switch statusCode {
        case 200...299:
            do {
                return try JSONDecoder().decode(T.self, from: data)
            } catch {
                throw APIError.decodingFailed
            }
        default:
            let errorMessage: String
            do {
                let apiError = try JSONDecoder().decode(APIErrorResponse.self, from: data)
                errorMessage = apiError.message
            } catch {
                errorMessage = HTTPURLResponse.localizedString(forStatusCode: statusCode)
            }
            throw APIError.serverError(statusCode: statusCode, message: errorMessage)
        }
    }
}
