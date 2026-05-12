# Session Documentation

- Date: 2026-03-25 00:16:18 UTC
- UNIX Timestamp: 1774397778
- Project: Rust Disk Activity CLI (nmon-style)

## Research Findings: Disk I/O Monitoring in Rust

### Core Data Collection Libraries
- **sysinfo**: Cross-platform system info (disks, CPU, RAM). Good for general usage.
- **systemstat**: Pure Rust, highlights Disk I/O throughput (read/write ops).
- **procfs**: Linux-specific, parses `/proc/diskstats`. Best for high-precision, per-device data.
- **blockdev**: Lightweight `lsblk` wrapper, good for mapping partitions to disks.

### TUI & Visualization (nmon Style)
- **ratatui**: Industry standard for terminal dashboards (Sparklines, Bar Charts, Tables).
- **crossterm**: Cross-platform terminal manipulation backend for ratatui.

### Reference Projects
- **bottom (btm)**: Polished, cross-platform graphical monitor with disk widgets.
- **below**: Meta's "time-traveling" resource monitor for Linux.
- **diskonaut**: Disk space visualizer (TUI).

### Recommended Stack
- **Data**: `systemstat` + `procfs` (for Linux precision).
- **UI**: `ratatui` + `crossterm`.
- **CLI**: `clap` (v4).

## Rust Build Status Check
- Current Rustc: 1.93.0 (2026-01-19)
- Previous Report (Jan 30, 2026): Critical SIGSEGV failures in `rustc` and `cc`.
- Current Status: **STABLE**. `cargo check` in `../vscode-latency-monitor-rs` completed without errors.

## Proposed Project Roadmap: Disk Activity CLI

### Phase 1: Foundation
1. Initialize a new Rust project using `cargo init`.
2. Add dependencies: `ratatui`, `crossterm`, `sysinfo`, `procfs`, `clap`.
3. Create a basic TUI loop with `ratatui`.

### Phase 2: Data Collection
1. Implement a data provider module that reads from `/proc/diskstats` (Linux) or uses `sysinfo`.
2. Calculate delta values (reads/writes per second) by polling at regular intervals.

### Phase 3: Visualization
1. Implement a `DiskWidget` for `ratatui`.
2. Display per-disk throughput, utilization, and latency (if available).
3. Add sparklines for real-time history.

### Phase 4: Refinement
1. Add command-line arguments for polling interval and disk filtering.
2. Implement keyboard shortcuts (e.g., 'd' for detail, 'q' to quit).

