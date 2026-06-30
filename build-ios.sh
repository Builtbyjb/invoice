#!/bin/bash
set -e

CRATE_NAME="core_lib"
STATIC_LIB_NAME="lib${CRATE_NAME}.a"
XCFRAMEWORK_NAME="core_lib.xcframework"

# Paths
cd "$(dirname "$0")/core-lib"   # Go into Rust crate
OUTDIR="../ios/invoice"
BINDINGS_DIR="bindings"
HEADER_DIR="${BINDINGS_DIR}/ios-include"

echo "Building Rust library for iOS..."

# Build all needed targets
cargo build --target aarch64-apple-ios --release
cargo build --target aarch64-apple-ios-sim --release

echo "Creating XCFramework..."

mkdir -p "${HEADER_DIR}"
cp "${BINDINGS_DIR}/core_libFFI.h" "${HEADER_DIR}/"
cp "${BINDINGS_DIR}/lib.modulemap" "${HEADER_DIR}/module.modulemap"

rm -rf "${OUTDIR}/${XCFRAMEWORK_NAME}"

xcodebuild -create-xcframework \
    -library "target/aarch64-apple-ios/release/${STATIC_LIB_NAME}" \
    -headers "${HEADER_DIR}" \
    -library "target/aarch64-apple-ios-sim/release/${STATIC_LIB_NAME}" \
    -headers "${HEADER_DIR}" \
    -output "${OUTDIR}/${XCFRAMEWORK_NAME}"

echo "Copying Swift bindings..."
#  Remove old bindings first
rm -rf "${OUTDIR}/invoice/core_lib.swift"
cp "${BINDINGS_DIR}/core_lib.swift" "${OUTDIR}/invoice/core_lib.swift"
