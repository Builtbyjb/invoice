import SwiftUI

struct ContentView: View {
    @State private var greeting = ""

    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "globe")
                .imageScale(.large)
                .foregroundStyle(.tint)

            Text(greeting.isEmpty ? "Tap button" : greeting)
                .font(.title)

            Button("Say Hello from Rust") {

                // Call the Rust function
                greeting = sayHello()
            }
            .buttonStyle(.borderedProminent)
        }
        .padding()
    }
}

#Preview {
    ContentView()
}
