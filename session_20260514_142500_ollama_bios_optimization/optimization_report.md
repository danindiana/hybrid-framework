# Ollama BIOS Optimization Report - 2026-05-14

## System Analysis

### Hardware Specifications
- **Motherboard:** ASRock X570 Taichi (AM4)
- **CPU:** AMD Ryzen 9 5950X (16 Cores, 32 Threads)
- **RAM:** 128 GB DDR4-3200 (4 x 32GB G.Skill Ripjaws V)
- **GPU 0:** NVIDIA GeForce RTX 5080 (16 GB VRAM)
- **GPU 1:** NVIDIA GeForce RTX 3080 (10 GB VRAM)
- **Total VRAM:** 26 GB

### Current Workload (Ollama)
The system is running large language models (LLMs) ranging from 3B to 35B+ parameters. 
- Models like `qwen3:35b` and `nemotron-terminal-32b` are spanning across both GPUs.
- High CPU usage (900%+) indicates intensive model processing or offloading logic.
- Total VRAM (26GB) is near capacity for 30B+ parameter models, making memory bandwidth (both VRAM and System RAM) the primary bottleneck.

---

## Recommended BIOS Optimizations

Access BIOS by pressing **F2** or **Del** during boot.

### 1. Memory & Infinity Fabric (Primary Performance)
LLM performance on CPU is heavily dependent on memory latency and bandwidth.
- **OC Tweaker > DRAM Information:**
    - **Load XMP Setting:** Set to **XMP 2.0 Profile 1** (to hit 3200 MT/s).
- **Advanced > AMD Overclocking > DDR/Infinity Fabric:**
    - **Infinity Fabric Frequency and Dividers:** Set to **1600MHz**.
    - *Note:* This must be exactly half your DRAM MT/s (3200 / 2 = 1600) to maintain a **1:1 ratio**, which minimizes latency.
- **Advanced > AMD CBS > UMCT Common Options > DDR4 Common Options:**
    - **Gear Down Mode:** **Enabled** (increases stability for 4-stick 128GB configurations).

### 2. GPU & PCIe (Multi-GPU Efficiency)
Crucial for large models spanning two NVIDIA cards.
- **Advanced > PCI Configuration:**
    - **Above 4G Decoding:** **Enabled**.
    - **Re-size BAR Support:** **Enabled**.
    - **SR-IOV Support:** **Enabled** (if using virtualization/containers).
- **Advanced > AMD CBS > NBIO Common Options:**
    - **PCIe X16 Bus Geometry:** Ensure both slots are running at the highest possible speed (typically x8/x8 or x16/x4 depending on the specific lanes occupied). X570 Taichi supports PCIe Gen 4; ensure **Gen 4** is selected for all populated slots.

### 3. CPU Performance (PBO & Curve Optimizer)
Improves sustained all-core boost clocks for processing model layers that overflow from VRAM.
- **Advanced > AMD Overclocking > Precision Boost Overdrive:**
    - **Precision Boost Overdrive:** **Advanced**.
    - **PBO Limits:** **Manual**.
        - **PPT:** 200W
        - **TDC:** 140A
        - **EDC:** 160A (Adjust based on cooling; the 5950X can get very hot).
    - **Curve Optimizer:** **All Cores**.
    - **All Core Curve Optimizer Sign:** **Negative**.
    - **All Core Curve Optimizer Magnitude:** Start at **15** (Try 20 or 25 if stable). This reduces voltage/heat, allowing higher sustained clocks.

### 4. Virtualization & System (Ollama/Docker Support)
- **Advanced > CPU Configuration:**
    - **SVM Mode:** **Enabled** (Required for Docker/WSL/Virtualization).
- **Advanced > AMD CBS > NBIO Common Options:**
    - **IOMMU:** **Enabled** (Helps with hardware passthrough and isolation).

### 5. Stability & Power
- **OC Tweaker:**
    - **CPU Load-Line Calibration:** **Level 3** (Balances voltage stability under heavy load).
    - **VDDCR_SOC Voltage:** **Manual (1.1V)** (Helps stabilize the Infinity Fabric at 128GB RAM capacity).

---

## Summary Checklist
| Goal | BIOS Path | Setting |
| :--- | :--- | :--- |
| **Memory Sync** | OC Tweaker / Advanced | XMP Profile 1 + FCLK 1600MHz |
| **GPU Bandwidth** | Advanced / PCI | Above 4G + Resizable BAR + PCIe Gen 4 |
| **Sustained Boost** | AMD Overclocking | PBO Advanced + Negative Curve Optimizer (-15) |
| **Virtualization** | Advanced / CPU | SVM Mode Enabled |
| **Stability** | OC Tweaker | LLC Level 3 + SOC Voltage 1.1V |
