# speedsys-rs Phase 2 — Quick Start Guide

## Build & Run
```bash
cd speedsys-rs
cargo build --release
./target/release/speedsys-rs
```

## Interactive Mode (TUI)
Navigate using **F1–F4** or **Tab/Shift-Tab**:

### 1. Overview Screen (F1)
Shows:
- System inventory (CPU, memory, caches, storage devices)
- CPU benchmark (Mops/s) vs reference ladder
- Memory throughput staircase graph

**Keys:** F1 (stay), F2 (go to Disks), r (rerun), q (quit)

### 2. Disk Selector (F2)
Lists all block devices with model and size.

**Keys:**
- `↑` / `↓` — scroll through disk list
- `Enter` — open test mode for selected disk
- `t` — start quick test (T1: 64 × 8 MB)
- `T` — start full test (T2: 512 × 16 MB)
- `q` / `Esc` — back to Overview

### 3. Disk Test Results
Shows per-device benchmarks as they complete:
- **Linear Read Performance:** avg/min/max MB/s
- **Random Access:** avg/max seek time (ms)
- **Mini scatter plot:** seek latencies (visual)
- Smart health (temperature, if available)

### Test Modes
| Mode | Samples | Block Size | Time (est.) | Use Case |
|------|---------|-----------|------------|----------|
| Quick (t) | 64 | 8 MB | 30s | Fast overview |
| Full (T) | 512 | 16 MB | 2–5 min | Detailed graph |

## Headless Mode
For CI, screenshots, or automation:
```bash
./target/release/speedsys-rs --dump
```
Renders one frame as ASCII/ANSI and exits.

## What Each Test Measures

### Linear Read Speed
- Samples disk at positions 0%, 25%, 50%, 75%, 100%
- **HDD:** Shows speed decline (outer → inner tracks)
- **SSD/NVMe:** Shows flat line (consistent speed)
- **Typical values:**
  - Spinning HDD: 50–150 MB/s
  - SATA SSD: 400–550 MB/s
  - NVMe: 2000–7000+ MB/s

### Random Access Time
- 200 (quick) or 1000 (full) random 4 KB reads
- **HDD:** 5–20 ms per seek
- **NVMe:** <0.5 ms per access
- Shows mechanical vs electronic latency

### Drive Comparison
Plots your device's avg linear speed against:
- IDE 1998 (~10 MB/s)
- SATA HDD (~180 MB/s)
- SATA SSD (~550 MB/s)
- NVMe Gen3 (~3500 MB/s)
- NVMe Gen4 (~7000 MB/s)

## Requirements
- Linux (Ubuntu 22.04+ tested)
- Rust 1.74+ (`cargo build --release`)
- Sufficient permissions (sudo for raw device reads on locked systems)

## Terminal Size
Recommended: **100×34** or larger (like the original SPEEDSYS)
- Scales to available terminal size
- Minimum recommended: 80×24

## Performance Notes
- **CPU benchmark:** ~1–2 seconds
- **Memory sweep:** ~2–3 seconds
- **Disk tests:** 30 seconds (quick) to 2–5 minutes (full)
- All tests are non-destructive (read-only)

## Troubleshooting

### "Permission denied" on raw device
```bash
sudo ./target/release/speedsys-rs
```

### Seek test hangs on md/dm stacks
Falls back to buffered reads automatically (marked in UI).

### Terminal looks garbled
Ensure terminal supports Unicode (UTF-8) and 256+ colors.
Try increasing terminal size (min 80×24).

### Benchmark numbers seem off
Ensure no other heavy I/O or CPU workloads running.
Run on bare metal (not VM) for accurate disk timings.

## Next Features (Phase 3–5)
- [ ] Memory error testing (address-in-address, moving-inversions)
- [ ] Multi-core CPU variant
- [ ] Export results as ANSI/HTML report
- [ ] CLI argument parity with original SPEEDSYS

## Tips
1. **Compare disks:** Run quick test on multiple devices to see the comparison ladder update
2. **Optimal test:** Full test (T) gives better graphs for presentations
3. **Export:** `--dump` output can be captured to file for documentation
4. **Automation:** Use `--dump --screen disks` (Phase 1.1) in CI pipelines

---
**Need help?** See PHASE_2_IMPLEMENTATION.md for technical details.
