#!/bin/bash
set -e

LIB_NAME="core_lib"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}/core-lib/zig"

OUTDIR="../../core-lib/bindings-kotlin/jniLibs"

# Clean previous outputs
rm -rf zig-out
rm -rf "${OUTDIR}"

echo "Building Zig shared library for Android arm64-v8a..."
zig build -Dtarget=aarch64-linux-android -Doptimize=ReleaseFast -Dshared=true -Dlink_libc=false
mkdir -p "${OUTDIR}/arm64-v8a"
cp "zig-out/lib/lib${LIB_NAME}.so" "${OUTDIR}/arm64-v8a/lib${LIB_NAME}.so"

echo "Building Zig shared library for Android x86_64..."
rm -rf zig-out
zig build -Dtarget=x86_64-linux-android -Doptimize=ReleaseFast -Dshared=true -Dlink_libc=false
mkdir -p "${OUTDIR}/x86_64"
cp "zig-out/lib/lib${LIB_NAME}.so" "${OUTDIR}/x86_64/lib${LIB_NAME}.so"

echo ""
echo "Kotlin bindings: ${SCRIPT_DIR}/core-lib/bindings-kotlin/CoreLib.kt"
echo "Native libraries:"
find "${OUTDIR}" -type f

echo ""
echo "Done."
