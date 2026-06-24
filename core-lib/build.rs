use camino::Utf8PathBuf;
use uniffi_bindgen::bindings::{TargetLanguage, GenerateOptions};

fn main() {
    let udl_file: Utf8PathBuf = "./src/lib.udl".into();
    let out_dir: Utf8PathBuf = "./bindings/".into();

    uniffi_build::generate_scaffolding(&udl_file).unwrap();

    // Generate Swift bindings
    let swift_options = uniffi_bindgen::bindings::SwiftBindingsOptions {
        generate_swift_sources: true,
        generate_headers: true,
        generate_modulemap: true,
        source: udl_file.clone(),
        out_dir: out_dir.clone(),
        ..Default::default()
    };
    uniffi_bindgen::bindings::generate_swift_bindings(swift_options).unwrap();

    // Generate Kotlin bindings
    let kotlin_options = GenerateOptions {
        languages: vec![TargetLanguage::Kotlin],
        source: udl_file,
        out_dir,
        format: true,
        ..Default::default()
    };
    uniffi_bindgen::bindings::generate(kotlin_options).unwrap();
}
