# GPU Power Consumption Investigation Report
**Date:** Friday, May 8, 2026
**Investigator:** Gemini CLI

## Executive Summary
An investigation was conducted into why the NVIDIA GeForce RTX 3080 (GPU 1) is consistently drawing approximately 100W-120W of power while seemingly idle or under low utilization. The primary cause is a combination of an active compute workload (Ollama) and a multi-monitor configuration, both of which prevent the GPU and its memory from downclocking to their lowest power states.

## Technical Findings

### 1. Current Status (at time of investigation)
- **Power Draw:** ~117.52 W (Average)
- **Performance State:** P2 (High Performance)
- **GPU Utilization:** 9%
- **Memory Utilization:** 9%
- **VRAM Usage:** 9403 MiB / 10240 MiB (91.8%)
- **Clocks:**
    - **Graphics:** 1785 MHz
    - **Memory:** 9251 MHz (Near max supported clock of 9501 MHz)

### 2. Deep Dive: Root Causes

#### A. Active Compute Workload (Ollama)
The process `/usr/local/bin/ollama` (PID 3571527) is consuming ~9GB of VRAM on the RTX 3080. 
- **P-State Locking:** An active CUDA context typically forces NVIDIA GPUs into the **P2** state. This state maintains higher voltages and clocks to ensure compute stability, preventing the card from entering the ultra-low-power **P8** or **P12** states.

#### B. Multi-Monitor "Memory Clock Lock"
The system drives three disparate displays:
1. **DP-1:** 1680x1050 @ 60Hz
2. **HDMI-1:** 2560x1080 @ 60Hz
3. **DP-5:** 1440x900 @ 60Hz

- **Synchronization & Flickering:** Each display has its own Vertical Blanking Interval. Because the resolutions and timings differ, these intervals do not align. If the GPU were to downclock its memory frequency during an active refresh, it would cause visible screen flickering or blackouts.
- **Driver Behavior:** To ensure a stable user experience, the NVIDIA driver locks the memory at a high clock speed (**9251 MHz**) when multiple heads are active, even if idle.

#### C. GDDR6X Power Characteristics
The RTX 3080 utilizes **GDDR6X** memory, which is fundamentally different from standard GDDR6:
- **PAM4 Signaling:** Unlike the binary (NRZ) signaling of GDDR6, GDDR6X uses **4-level Pulse Amplitude Modulation (PAM4)**. This allows it to transmit **2 bits per clock cycle per pin** by using four distinct voltage levels.
- **Precision Requirements:** Maintaining the signal integrity of these four voltage levels requires extremely precise (and power-hungry) voltage regulation.
- **High Idle Baseline:** Because the memory is locked at nearly 10Gbps (per pin) to drive the three monitors, the GDDR6X chips themselves are responsible for a significant portion (~30-50W) of the total board power draw.

#### D. Architectural Efficiency Comparison
The **RTX 5080 (Blackwell)** in the same system is drawing only **~56W** while running a similar Ollama workload. This demonstrates the generational leap in "partial load" efficiency, where the 5080 manages its power states and internal gating much more aggressively than the Ampere-based 3080.

## Recommendations & Applied Optimizations

### 1. Applied Optimizations (May 8, 2026)
Following the investigation, the following optimizations were successfully applied to the RTX 3080:
- **Persistence Management:** Enabled `nvidia-persistenced` and Persistence Mode to ensure stable state transitions.
- **Power Capping:** Set the TDP limit to **250W** (down from 340W) to improve thermal efficiency during compute loads.
- **Clock Locking (Eco Mode):** Manually locked the Memory clock to **405 MHz** and the Core clock to **210 MHz**.

**Results:**
- **Initial Idle Power:** ~122.3 W
- **Optimized Idle Power:** **~43.7 W**
- **Total Savings:** **~78.6 Watts** at idle.

### 2. Power Management Script
A utility script `gpu_power_toggle.sh` has been created in the `ampere-vision-archival` repository.
- `sudo ./gpu_power_toggle.sh eco`: Locks clocks and caps power for maximum efficiency.
- `sudo ./gpu_power_toggle.sh perf`: Resets clocks to automatic management for AI training or gaming.

## Appendix: Raw Data Snippet
```
# Optimized State (P8)
43.74 W, P8, 405 MHz, 210 MHz
```

