# Advanced Ollama Linux & BIOS Optimization Report - 2026-05-14

## Deep-Dive System Analysis

### Bottleneck Identification
1.  **Memory Bandwidth Starvation:** The Ryzen 5950X has 16 cores but only 2 memory channels. Running Ollama with all 32 threads (default) saturates the memory bus, causing cores to stall.
2.  **CCD Cross-Talk:** The 5950X has two 8-core CCDs. When the model is split across all 16 cores, data frequently crosses the Infinity Fabric, increasing latency.
3.  **PCIe Tag Limits:** With two high-end GPUs (5080 + 3080), the default PCIe "tag" limit (256) can bottleneck peer-to-peer (P2P) transfers during tensor-parallel inference.
4.  **TLB Overhead:** The system currently has Transparent Hugepages (THP) disabled, causing high TLB (Translation Lookaside Buffer) miss rates during multi-gigabyte weight accesses.

---

## 1. Advanced BIOS Optimizations (Level 2)

### A. NUMA Domain Splitting (Cache Locality)
By default, your 5950X is a single UMA node. Splitting it tells the Linux kernel to keep threads closer to the local L3 cache of each CCD.
- **Path:** `Advanced` > `AMD CBS` > `DF Common Options`
- **Setting:** `ACPI SRAT L3 Cache as NUMA Domain` -> **Enabled**.
- **Impact:** Reduces cross-CCD latency; `lscpu` should show 2 NUMA nodes after reboot.

### B. PCIe Bus Optimization (Multi-GPU P2P)
Critical for models that span both the 5080 and 3080.
- **Path:** `Advanced` > `AMD CBS` > `NBIO Common Options`
- **Setting:** `PCIe Ten Bit Tag Support` -> **Enabled**.
- **Impact:** Increases concurrent outstanding PCIe requests from 256 to 1024, preventing bus stalls during GPU-to-GPU data sync.

### C. Latency & Security Trade-offs
- **Advanced > AMD CBS > CPU Common Options:**
    - **Global C-state Control:** **Disabled** (if the machine is a dedicated server; prevents latency spikes when cores "wake up" to process a token).
- **Advanced > AMD CBS > Security:**
    - **TSME (Transparent Secure Memory Encryption):** **Disabled**.
    - **Impact:** Saves ~2-5ns of latency per memory access by bypassing the on-the-fly encryption engine.

---

## 2. Linux Kernel & Runtime Optimizations

### A. Kernel Boot Parameters
Edit `/etc/default/grub` and update the `GRUB_CMDLINE_LINUX_DEFAULT` line:
```bash
# Add these flags
iommu=pt transparent_hugepage=always default_hugepagesz=1G hugepagesz=1G hugepages=32
```
- `iommu=pt`: Enables 1:1 hardware mapping (bypass translation overhead).
- `transparent_hugepage=always`: Simplifies memory management for large models.
- `hugepages=32`: Allocates 32GB of RAM to 1GB Hugepages (adjust based on your typical model size).

**To apply:**
```bash
sudo update-grub
sudo reboot
```

### B. Runtime Environment Variables
Set these in your Ollama service file or shell profile to optimize the `llama.cpp` backend:
```bash
export OLLAMA_NUMA=1
export OLLAMA_FLASH_ATTENTION=1
export OLLAMA_NOPREVIEW=1
```

### C. Specific GPU Finding: Partial Resizable BAR
An audit of your PCIe bus shows a configuration mismatch:
- **RTX 5080:** Resizable BAR is **Enabled** (Addressing full 16GB).
- **RTX 3080:** Resizable BAR is **Disabled** (Addressing only 256MB).
- **Resolution:** This is likely due to the "Above 4G Decoding" being enabled but the "Re-size BAR" setting only applying to the primary slot, or the 3080 requiring a VBIOS update for ReBAR support (common for older 30-series cards). Ensure **Re-size BAR** is set to **Auto** or **Enabled** specifically for all PCIe slots in the BIOS.

### D. The "Sweet Spot" Thread Tuning
Research indicates that for a 5950X, **using 32 threads is often 15-20% slower** than using fewer, more efficient threads.
- **Recommendation:** Manually set thread count to **12 or 16**.
- **Why?** This prevents memory bandwidth "choke" and allows the 5950X to sustain much higher boost frequencies on the active cores.

---

## 3. Revised Implementation Checklist

| Goal | BIOS/OS Setting | Recommended Value |
| :--- | :--- | :--- |
| **Cache Locality** | BIOS: L3 as NUMA | **Enabled** |
| **P2P Bandwidth** | BIOS: 10-Bit Tag | **Enabled** |
| **DMA Speed** | GRUB: IOMMU | `iommu=pt` |
| **Memory Latency**| BIOS: TSME | **Disabled** |
| **TLB Efficiency**| GRUB: Hugepages | `transparent_hugepage=always` |
| **Kernel Latency**| Linux: Governor | `performance` |
