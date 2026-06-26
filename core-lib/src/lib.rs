uniffi::include_scaffolding!("lib");

pub fn say_hello() -> String {
    "Hello from rust".to_string()
}
