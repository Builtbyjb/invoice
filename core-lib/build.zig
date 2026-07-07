const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});
    const shared = b.option(bool, "shared", "Build shared library (.so/.dylib) instead of static") orelse false;
    const link_libc = b.option(bool, "link_libc", "Link libc (required for iOS, disable for bare Linux/Android)") orelse true;

    const mod = b.createModule(.{
        .root_source_file = b.path("src/root.zig"),
        .target = target,
        .optimize = optimize,
        .link_libc = link_libc,
    });

    const lib = b.addLibrary(.{
        .name = "core_lib",
        .root_module = mod,
        .linkage = if (shared) .dynamic else .static,
    });
    b.installArtifact(lib);

    const install_header = b.addInstallHeaderFile(b.path("include/core_libFFI.h"), "core_libFFI.h");
    b.getInstallStep().dependOn(&install_header.step);

    const test_mod = b.createModule(.{
        .root_source_file = b.path("src/root.zig"),
        .target = target,
        .optimize = optimize,
        .link_libc = link_libc,
    });

    const lib_tests = b.addTest(.{
        .name = "core_lib_tests",
        .root_module = test_mod,
    });

    const run_lib_tests = b.addRunArtifact(lib_tests);
    const test_step = b.step("test", "Run unit tests");
    test_step.dependOn(&run_lib_tests.step);
}
