use uniffi_bindgen::generate_bindings;

fn main() {
    let udl_file = "./src/lib.udl";
    let out_dir = "./bindings/";
    uniffi_build::generate_scaffolding(udl_file).unwrap();
    generate_bindings(
        udl_file.into(),
        None,
        vec!["swift", "kotlin"],
        Some(out_dir.into()),
        None,
        true,
    )
    .unwrap();
}
