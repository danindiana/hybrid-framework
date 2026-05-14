# Session: Ollama Linux & BIOS Optimization
Date: 2026-05-14
System: ASRock X570 Taichi | AMD Ryzen 9 5950X | 128GB RAM | Dual RTX 5080/3080

## Overview
This session focused on identifying and addressing hardware/runtime bottlenecks for local LLM workloads (Ollama) on a high-end Linux workstation.

## Completed Tasks
1.  **Hardware Audit:** Identified ASRock X570 motherboard, dual-CCD 5950X processor, and dual-GPU topology.
2.  **Workload Analysis:** Confirmed Ollama is running large models (35B+) that span multiple GPUs and saturate system memory bandwidth.
3.  **Baseline Research:** Generated initial BIOS optimization recommendations (XMP, PBO, ReBAR).
4.  **Deep Research:** Investigated advanced Linux runtime optimizations including:
    - **NUMA Topology:** Splitting the 5950X into 2 domains for better cache locality.
    - **PCIe Ten-Bit Tags:** Enabling higher concurrency for multi-GPU P2P.
    - **Kernel Tuning:** Hugepages (1GB) and IOMMU Passthrough.
    - **Thread Optimization:** Identifying the "Sweet Spot" (12-16 threads) for dual-channel memory controllers.

## Key Findings
- The Ryzen 5950X is heavily memory-bandwidth limited for LLMs; using 32 threads is counter-productive.
- BIOS-level NUMA domain splitting (L3 as NUMA Domain) is essential for Zen 3 LLM performance.
- PCIe Ten-Bit Tag Support is a hidden but critical setting for high-bandwidth P2P between the RTX 5080 and 3080.
- Linux Hugepages can reduce memory latency by up to 10% during large weight accesses.

## Documents Generated
- `session_20260514_142500_ollama_bios_optimization/optimization_report.md`: General BIOS settings.
- `session_20260514_142500_ollama_bios_optimization/advanced_tuning_report.md`: Deep technical tuning for Linux & Zen 3.

## Next Steps for User
1. Apply BIOS changes in two phases (Baseline then Advanced).
2. Update GRUB with `iommu=pt` and `hugepages` parameters.
3. Benchmark token generation speed before and after using `ollama run <model> --verbose`.
