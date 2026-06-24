pub fn say_hello() -> String {
    "Hello from rust".to_string()
}

uniffi::include_scaffolding!("lib");
