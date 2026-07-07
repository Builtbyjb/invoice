#!/bin/bash
set -e

LIB_NAME="core_lib"
XCFRAMEWORK_NAME="core_lib.xcframework"

# Paths
SCRIPT_DIR="./core-lib"
cd "${SCRIPT_DIR}"

HEADER_DIR="include"
OUTDIR="../ios/invoice"

# Clean previous outputs
rm -rf zig-out
rm -rf "${OUTDIR}/${XCFRAMEWORK_NAME}"

echo "Building Zig library for iOS device..."
zig build -Dtarget=aarch64-ios -Doptimize=ReleaseFast
cp "zig-out/lib/lib${LIB_NAME}.a" "/tmp/lib${LIB_NAME}_ios.a"

echo "Building Zig library for iOS simulator..."
rm -rf zig-out
zig build -Dtarget=aarch64-ios-simulator -Doptimize=ReleaseFast
cp "zig-out/lib/lib${LIB_NAME}.a" "/tmp/lib${LIB_NAME}_sim.a"

echo "Creating XCFramework..."
xcodebuild -create-xcframework \
    -library "/tmp/lib${LIB_NAME}_ios.a" -headers "${HEADER_DIR}" \
    -library "/tmp/lib${LIB_NAME}_sim.a" -headers "${HEADER_DIR}" \
    -output "${OUTDIR}/${XCFRAMEWORK_NAME}"

echo "Copying Swift bindings..."
rm -f "${OUTDIR}/invoice/Lib/core_lib.swift"
cp "./bindings-swift/core_lib.swift" "${OUTDIR}/invoice/Lib/core_lib.swift"

echo "Done."
