# Rust Build Check Report

**Date:** Friday, January 30, 2026
**Workspace:** `/home/jeb/programs/` (Parent Directory)
**Projects:**
*   `pdf-tools-workspace/pdf-crawler`
*   `pdf_validator/pdf_validator_rs`
*   `rust_progs/pdf_crawler`
*   `vscode-latency-monitor-rs`

## Findings

### 1. Build Status: **CRITICAL FAILURE**
The Rust build is failing due to repeated **Segmentation Faults (SIGSEGV)** in the compiler itself (`rustc`) and the system C compiler (`cc`).

### 2. Details
*   **Crates Causing Crash:** `zerocopy`, `markup5ever`, `ring`, `libc`, `parking_lot`, `indexmap`.
*   **Error Type:** `signal: 11, SIGSEGV: invalid memory reference`.
*   **Internal Compiler Errors (ICE):**
    *   `rustc` panicked at `compiler/rustc_ast_lowering/src/path.rs:94:60`.
    *   `cc` (compiling `ring` C code) crashed with `internal compiler error: Segmentation fault`.

### 3. Attempted Mitigations
*   **Stack Size:** Increased `RUST_MIN_STACK` to `16MB`, `32MB`, and `64MB`.
*   **Clean Build:** Performed `cargo clean` to remove artifacts.
*   **Result:** Crashes persist and affect different crates randomly, which is a strong indicator of system instability.

### 4. Diagnosis
The fact that both `rustc` (Rust) and `cc` (C) are crashing with segmentation faults on standard, widely-used libraries suggests one of the following:
1.  **Hardware Instability:** Bad RAM or CPU instability.
2.  **Corrupted Toolchain:** The installed `rustc` or system `gcc`/`clang` libraries might be corrupted.
3.  **OS/Library Corruption:** Issues with `glibc` or kernel compatibility (though less likely to cause random compiler crashes unless severe).

## Recommendations
1.  **Update/Reinstall Toolchain:** Run `rustup update` or `rustup toolchain install stable --force` to repair the Rust compiler.
2.  **Hardware Check:** Run a memory test (`memtest86+`) if possible.
3.  **System Update:** Ensure system packages are up to date (`sudo apt update && sudo apt upgrade`).
