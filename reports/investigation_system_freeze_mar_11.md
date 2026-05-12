# Investigation: System Freeze & Hard Reboot (March 11, 2026)
**Date:** Wednesday, March 11, 2026
**Status:** In Progress

## 1. Timeline of Events (March 11)
*   **07:45 - 13:20:** System running normally.
*   **13:45:** System booted and ran until ~19:42.
    *   **13:52:** Samsung 870 EVO SSD mounted; 25GB of Ollama models migrated from `/usr/share/ollama/.ollama` (NVMe) to `/mnt/samsung_ssd/ollama/.ollama`.
    *   **Afternoon:** Intensive Docker activity (Open WebUI) and Audacious configuration.
*   **~19:01:** Last recorded log entry in `syslog`/`kern.log` (UFW AUDIT messages).
    *   **State Analysis:** `atop` data at 18:56 showed **28GB of 32GB RAM** consumed by `phys_cache`. Free memory was critically low (~566MB).
*   **19:01 - 19:40:** **Hard System Freeze.** 38-minute gap. No kernel panic was written to disk, suggesting the I/O subsystem or interrupt handling was fully blocked.
*   **19:40:** First reboot attempted.
    *   **19:42:** System crashed/rebooted again during service initialization.
    *   **Contextual Trigger:** The failure occurred **exactly** after the RAID0 volume (`md0`) and WD Storage (`sdb2`) were mounted, and immediately after `kvm_amd` initialization.
    *   **Critical Error:** `percpu: allocation failed, size=4 align=4 atomic=1, atomic alloc failed, no space left`.
*   **19:57:** Second reboot (Current Session). System stable with 125GB RAM detected and 116GB available.

## 2. Technical Findings
### A. Kernel Memory Exhaustion (percpu)
The `percpu` memory pool is a specialized area of kernel memory used for data that is unique to each CPU core (e.g., interrupt counters, scheduler data).
*   **Diagnostic Significance:** Unlike general OOM (Out of Memory), a `percpu` failure often indicates that the kernel has exhausted its pre-allocated per-cpu metadata area. This is frequently caused by:
    *   **Driver/Module Proliferation:** Excessive initialization of network filters (UFW/iptables), block devices (RAID/LVM), or virtualization (KVM).
    *   **Memory Fragmentation:** If the kernel cannot find contiguous blocks for per-cpu structures.
*   **Correlation:** The crash occurred during the simultaneous mounting of `md0` (11T RAID0) and `sdb2` (3.6T HDD), which creates massive amounts of per-cpu metadata for the I/O path.

### B. Hardware & Environmental Details
*   **Thermal Anomaly:** `thermal_zone0` failed to read consistently. This zone usually corresponds to the PCH (Platform Controller Hub) or a motherboard sensor.
*   **Memory Layout:** The system has 128GB total RAM, but `atop` reported only 32GB at 18:56. This suggests either a hardware reporting error or a misconfiguration during that specific boot cycle.
*   **Swap Configuration:** 8GB total across two files: `/swapfile.1` (System NVMe) and `/mnt/nvme0/swapfile.2` (Second NVMe).
*   **PCI ID Shift:** Adding the Samsung 870 EVO SSD caused a shift in PCI bus addresses.
    *   **Result:** The `network-queue-optimization.service` failed because the target interface `enp8s0` changed to `enp9s0`.
    *   **Impact:** While not the cause of the freeze, failed hardware optimization scripts during boot can contribute to kernel instability and `percpu` allocation errors.

### C. I/O Subsystem
*   **RAID0 (`md0`):** Composed of `/dev/sda2` and `/dev/sdf2` (10.9T each).
*   **Utilization:** The RAID0 volume is **91% full** (9.9T used). High utilization on RAID0 increases metadata overhead and risks severe performance degradation if block allocation becomes fragmented.
*   **Potential Bottleneck:** The move of 25GB of data and the subsequent high-speed access from Docker/Ollama might have saturated the SATA bus or triggered a controller-level hang, especially if one of the RAID member disks is exhibiting latency.

## 3. Root Cause Analysis
### Hypothesis 1: Kernel Resource Deadlock (Most Likely)
The system likely suffered a "Silent OOM" where the `phys_cache` (buff/cache) aggressively expanded to manage the 25GB data move, leaving insufficient unfragmented space for `percpu` allocations required by the RAID0 and Docker network layers. When the kernel attempted to allocate metadata for new I/O requests, it hit the `no space left` limit and hung.

### Hypothesis 2: SATA Controller / RAID0 Sync Hang
A hardware-level stall on the 11T RAID0 volume could have caused all filesystem-dependent processes (including logging) to block indefinitely, resulting in the 38-minute silence.

## 4. Remediation & Hardening
*   [ ] **Validate RAM:** Run `memtest86+` to ensure all 128GB is consistently addressed and healthy.
*   [ ] **RAID Scrub:** Run `mdadm --check /dev/md0` to verify parity/integrity of the RAID0 stripe.
*   [ ] **Monitor `slabtop`:** Use `slabtop -o` to monitor which kernel caches are growing during heavy Ollama usage.
*   [ ] **I/O Scheduler:** Ensure RAID0 and HDDs are using `mq-deadline` or `none` to minimize CPU-bound I/O overhead.
