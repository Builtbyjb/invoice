//
//  ValidateOTPView.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-27.
//

import SwiftUI
import Combine

struct ValidateOTPView: View {
    @Binding var isPresented: Bool
    @Environment(AuthSession.self) private var authSession
    
    let email: String
    
    @State private var otpCode: String = ""
    @FocusState private var isFieldFocused: Bool
    
    @State private var isLoading = false
    @State private var showError = false
    @State private var errorMessage = ""
    
    @State private var isResending = false
    @State private var showResendError = false
    @State private var resendErrorMessage = ""
    
    // Timer States
    @State private var timeRemaining = 60
    @State private var isTimerActive = true
    let timer = Timer.publish(every: 1, on: .main, in: .common).autoconnect()
    
    let maxDigits = 8
    
    var body: some View {
        VStack(spacing: 32) {
            // Header text instruction
            VStack(spacing: 8) {
                Text("Verification Code")
                    .font(.title2.weight(.bold))
                
                Text("We sent an 8-digit code to your email. Please enter it below to confirm your identity.")
                    .font(.subheadline)
                    .foregroundColor(.gray)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 16)
            }
            .padding(.top, 16)
            
            ZStack {
                // Invisible hidden TextField that intercepts user keyboard entries
                TextField("", text: $otpCode)
                    .keyboardType(.numberPad)
                    .textContentType(.oneTimeCode)
                    .focused($isFieldFocused)
                    .opacity(0)
                    .disabled(otpCode.count >= maxDigits && !isFieldFocused)
                    .onChange(of: otpCode) { oldValue, newValue in
                        let filtered = newValue.filter { $0.isNumber }
                        if filtered.count > maxDigits {
                            otpCode = String(filtered.prefix(maxDigits))
                        } else {
                            otpCode = filtered
                        }
                    }
                
                // Visual Layer displaying the individual boxes
                HStack(spacing: 12) {
                    HStack(spacing: 8) {
                        ForEach(0..<4, id: \.self) { index in
                            digitBox(for: index)
                        }
                    }
                    
                    Rectangle()
                        .frame(width: 12, height: 2)
                        .foregroundColor(.gray.opacity(0.4))
                    
                    HStack(spacing: 8) {
                        ForEach(4..<8, id: \.self) { index in
                            digitBox(for: index)
                        }
                    }
                }
                .onTapGesture {
                    isFieldFocused = true
                }
            }
            .padding(.horizontal, 16)
            
            // Primary Submission Button
            Button {
                isLoading = true
                Task {
                    defer { isLoading = false }
                    do {
                        let otpDetails = OTPDetails(code: otpCode)
                        guard let token = try TokenStore.shared.read() else { return }
                        
                        _ = try await Auth.verifyOTP(otpDetails: otpDetails, tempToken: token.accessToken)
                        isPresented = false
                        authSession.markAuthenticated()
                    } catch {
                        errorMessage = error.localizedDescription
                        showError = true
                    }
                }
            } label: {
                if isLoading {
                    ProgressView()
                        .tint(.white)
                        .padding(.vertical, 14)
                        .frame(maxWidth: .infinity)
                        .background(otpCode.count == maxDigits ? Color.blue : Color.gray.opacity(0.4))
                        .cornerRadius(8)
                } else {
                    Text("Verify Code")
                        .font(.headline)
                        .foregroundColor(.white)
                        .padding(.vertical, 14)
                        .frame(maxWidth: .infinity)
                        .background(otpCode.count == maxDigits ? Color.blue : Color.gray.opacity(0.4))
                        .cornerRadius(8)
                }
            }
            .disabled(otpCode.count < maxDigits || isLoading)
            .padding(.horizontal, 16)
            .alert("Verification Failed", isPresented: $showError) {
                Button("OK", role: .cancel) {}
            } message: {
                Text(errorMessage)
            }
            
            // Reactive Resend Code Action & Timer UI
            VStack(spacing: 8) {
                Button {
                    resendOTPCode()
                } label: {
                    if isResending {
                        ProgressView()
                    } else {
                        Text("Resend Code")
                            .font(.subheadline.weight(.semibold))
                            .foregroundColor(isTimerActive ? .gray : .blue)
                    }
                }
                .disabled(isTimerActive || isResending)
                
                if isTimerActive {
                    Text("Resend available in \(timeString(from: timeRemaining))")
                        .font(.caption)
                        .foregroundColor(.gray)
                }
            }
            .alert("Resend Failed", isPresented: $showResendError) {
                Button("OK", role: .cancel) {}
            } message: {
                Text(resendErrorMessage)
            }
        }
        .padding(24)
        .onAppear {
            startTimer()
        }
        .onReceive(timer) { _ in
            guard isTimerActive else { return }
            if timeRemaining > 0 {
                timeRemaining -= 1
            } else {
                isTimerActive = false
            }
        }
        .toolbar {
            ToolbarItem(placement: .cancellationAction) {
                Button("Cancel") {
                    isPresented = false
                }
            }
        }
    }
    
    // Extracted sub-view helper for an individual character box
    @ViewBuilder
    private func digitBox(for index: Int) -> some View {
        let status = getBoxStatus(at: index)
        
        Text(status.character)
            .font(.title2.weight(.bold))
            .foregroundColor(.primary)
            .frame(maxWidth: .infinity)
            .frame(height: 56)
            .background(
                RoundedRectangle(cornerRadius: 8)
                    .stroke(status.borderColor, lineWidth: status.borderWidth)
                    .background(Color(.systemGray6).cornerRadius(8))
            )
    }
    
    private func getBoxStatus(at index: Int) -> (character: String, borderColor: Color, borderWidth: CGFloat) {
        let codeArray = Array(otpCode)
        if index < codeArray.count {
            return (String(codeArray[index]), .blue.opacity(0.5), 1)
        } else if index == codeArray.count && isFieldFocused {
            return ("", .blue, 2)
        } else {
            return ("", .gray.opacity(0.2), 1)
        }
    }
    
    // Formats seconds into a neat MM:SS layout string
    private func timeString(from totalSeconds: Int) -> String {
        let minutes = totalSeconds / 60
        let seconds = totalSeconds % 60
        return String(format: "%02d:%02d", minutes, seconds)
    }
    
    // Resets state logic to begin counting down again
    private func resendOTPCode() {
        isResending = true
        Task {
            defer { isResending = false }
            do {
                _ = try await Auth.resendOTP(email: email)
                timeRemaining = 60
                isTimerActive = true
            } catch {
                resendErrorMessage = error.localizedDescription
                showResendError = true
            }
        }
    }
    
    private func startTimer() {
        isFieldFocused = true
        timeRemaining = 60
        isTimerActive = true
    }
}

#Preview {
    ValidateOTPView(
        isPresented: .constant(true),
        email: "name@example.com",
    )
    .environment(AuthSession.shared)
}
