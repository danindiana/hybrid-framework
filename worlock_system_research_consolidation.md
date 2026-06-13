# 🔬 consolidated research report: worlock hardware, kernel, & llm optimization
**Timestamp:** 2026-06-13T11:14:06-05:00  
**Machine:** worlock  

---

## 1. Hardware Inventory & System Health Baseline

Worlock is a high-performance workstation configured primarily for large local LLM inference, graph database hosting, and development workloads.

### 📋 Technical Specifications
* **CPU:** AMD Ryzen 9 5950X (16 physical cores, 32 execution threads, Zen 3 architecture).
* **RAM:** 128.5 GB DDR4 (configured as a single NUMA node 0).
* **Motherboard:** ASRock X570 Taichi (BIOS Platform Release: Oct/Nov 2019).
* **Network Interfaces:**
  * Ethernet: Intel I211 Gigabit (Primary, mapped to IRQs 67–71).
  * Wireless: Intel AX200 Wi-Fi 6 (Secondary, mapped to IRQ 26).
  * Virtual: 3 Docker bridges with active `veth` mapping.
* **Storage Array (37.8 TB raw capacity):**
  * **RAID0 Array:** 10.9 TB (striped across `sdd` + `sdf`, active at `/dev/md0` for scratch/speed).
  * **NVMe SSDs:** 4.8 TB combined (`nvme0`, `nvme1`, `nvme2`).
  * **SATA SSDs:** 1.9 TB combined (`sda`, `sdb`).
  * **Mechanical HDDs:** 19.2 TB combined (`sdc`, `sde`, `sdg` for archival).
* **Graphics Hardware (Dual GPU, 142W active/combined draw):**
  * **Primary GPU:** NVIDIA RTX 5080 (16GB VRAM, peak power rating 300W, idle temp ~45°C).
  * **Secondary GPU:** NVIDIA RTX 3080 (10GB VRAM, peak power rating 300W, idle temp ~47°C).

### 🌡️ Thermal & Pressure Performance (PSI)
* **CPU Thermal Status:** Running stable with a peak reading of **76.2°C** under load.
* **Storage Thermal Status:** NVMe SSDs operating safely in the **44°C to 51°C** band.
* **System Pressure Stall Information (PSI):**
  * **CPU Pressure:** `some avg10 = 0.99%` (healthy CPU task queuing).
  * **Memory Pressure:** `some avg10 = 0.00%` (abundant RAM overhead; no paging or swapping).
  * **I/O Pressure:** `some avg10 = 0.04%` (NVMe queuing keeps disk overhead minimal).

---

## 2. Low-Level Firmware, CPU, & Kernel Performance Tuning

### 🧬 Zen 3 CCD Thermal Balancing
Ryzen 9 5950X consists of two Core Complex Dies (CCD1 and CCD2). These dies can throttle independently under uneven thermal stress.
* **Root Causes of CCD Thermal Thrashing:** Driven by asymmetric load scheduling, PPT/TDC/EDC limits set too high in BIOS, or VRMs exceeding 100°C.
* **Mitigation Strategy:** Adjust Package Power Tracking (PPT) limits and monitor temperature deltas between CCD1 and CCD2 during intensive parallel inference.

### 🐧 Kernel Performance Flags
Worlock's kernel is heavily optimized to prioritize throughput and eliminate execution bottlenecks:
* **Mitigations=Off:** Security patches for CPU speculative execution vulnerabilities (Spectre, Meltdown, MDS) are disabled via boot parameters. This recovers up to 15-20% raw CPU performance during fast context switches, but makes the host vulnerable to untrusted local execution.
* **ASPM Disabled:** Active State Power Management for PCIe is disabled, forcing PCIe links to remain in L0 high-power states, eliminating bus wake-up latency.
* **NVMe Queuing Optimization:** Tuned for aggressive queue depths (16 write queues, 1023 queue depth) to maximize NVMe parallel writes.
* **IOMMU Passthrough:** Configured in `passthrough` mode to allow direct hardware level GPU virtualization (VFIO) mapping if needed.

---

## 3. Storage Optimization & Quiescent HDD Spin-Downs

### 🚨 Striped Storage Risk
The 10.9 TB RAID0 partition (`/dev/md0`) lacks parity or disk mirroring. While optimal for data parsing speed, a single disk failure will result in complete array loss. **Critical model weights and databases must be backed up to the mechanical or SATA drive arrays.**

### 💾 HDD Standby & Unmount Hanging
When mechanical archive disks are parked in sleep mode to reduce acoustics and power, standard Linux system shutdowns often hang for up to 26 seconds.
* **The Culprit:** Filesystems mounted as read-write (`rw`) must update superblock journals upon system shutdown. This forces the kernel to spin up sleeping HDD platters to perform physical write cycles before unmounting.
* **The Solution:** Mount quiescent archival drives as read-only (`ro,noatime,nofail`) in `/etc/fstab`. This removes the unmount write signature, permitting instant unmounts and preserving drive motor lifespans.

---

## 4. Ollama LLM Orchestration & Redirection

### 📂 Samsung SSD Storage Redirection
To protect the root disk, Ollama's model storage is redirected to a high-speed Samsung SSD:
* **Symlink Mapping:** `/usr/share/ollama/.ollama` ➔ `/mnt/samsung_ssd/ollama/.ollama`
* **Permissions Warning:** Storage folders must maintain `ollama:ollama` (UID 999 / GID 998) ownership. If ownership changes (e.g., to `root`), the service fails to load or download models.

### 🔀 Multi-Instance Port Layout
To balance inference loads across the two discrete GPUs (RTX 5080 and RTX 3080), three systemd services run in parallel:

| Systemd Service | Listener Port | Allocated GPU | Process Owner | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `ollama.service` | `11434` | GPU 0 (RTX 5080) | `ollama` | System-wide default inference engine. |
| `ollama-secondary.service` | `11435` | GPU 1 (RTX 3080) | `ollama` | Overflow and load-balancing instance. |
| `ollama-coder.service` | `11436` | GPU 1 (RTX 3080) | `jeb` | Dedicated coder model service. |

---

## 5. Telemetry & Telemetry Clean-up (Netdata)

Netdata is installed on Worlock for real-time monitoring, but is **disabled on system boot** to conserve background resources.

### 🧹 Netdata Switch Tool
Netdata's standard systemd daemon (`systemctl stop netdata`) frequently leaves orphaned data-collector plugins (like `nvidia-smi` and `apps.plugin`) running in the background.
* **Switch scripts:** Managed cleanly via files in `./netdata-switch/`.
* **Aggressive Stop (`stop.sh`):** Gracefully stops the service and then searches the process table for any remaining processes owned by the `netdata` system user, executing a clean `kill -9` cleanup.

---

## 6. Code Graphing and Memory Limits (Graphify)

Graphify is utilized to index codebase structures, but poses scalability challenges on high-performance machines:
* **Segmentation Faults (Sig=11):** Processing massive repositories (38k+ files) using 32 parallel worker threads causes AST parser recursion stacks to exceed memory allocation boundaries, crashing the Python interpreter.
* **Resolution:** Limit concurrency (`--max-workers 4`) and exclude dependency trees (such as Node modules) by formatting `.graphifyignore` with flat wildcard patterns (e.g. `*.png` rather than recursive directories).
* **Remote Visualization:** Due to Neo4j database endpoint URL loopbacks, serving graphs on the LAN can fail. Graphify's zero-dependency `graph.html` bypasses database connections entirely by hosting the complete D3 data array inside a single page.
