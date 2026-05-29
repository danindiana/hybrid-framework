# System Examination Session Report
**Date:** 2026-05-29T12:44:21-05:00

## Overview
This document contains the findings of a system examination conducted on the host machine. The server is running **Ubuntu 22.04.5 LTS**. We analyzed the hardware configuration, storage topology, network setup, and running services.

## Hardware Summary
- **CPU**: AMD Ryzen 9 5950X 16-Core Processor (32 Threads)
- **RAM**: 125 GiB Total
- **Architecture**: x86_64

## Storage Summary
The system has a diverse mix of NVMe drives and standard SATA SSDs/HDDs:
- **Boot Drive**: `nvme1n1` (953.9G)
- **RAID Configurations**: A software RAID 0 (`md0`) spanning 10.9T across partitions on `sdd` and `sdf`.
- **Additional Storage**: Multiple SSDs/HDDs up to 10.9T each.

## Network Summary
- **Main Interface**: `enp8s0` with IP `192.168.1.85`
- **Docker/Virtualization**: Virtual bridges `docker0` and `br-13c044b77bd3` are present.

## Security Audit
Several services are publicly listening on all interfaces (`0.0.0.0`):
- Ports 80, 443, 8080 (Web Traffic)
- Port 3000 (Likely a Node.js or Grafana frontend)
- Port 22222 (Likely an SSH server on a non-standard port)

Several localized services are running on `127.0.0.1`, including Ollama (Port 11434).

## Graphviz Diagrams
Accompanying this report are Graphviz `.dot` files detailing the system visually:
1. `hardware_topology.dot`
2. `network_topology.dot`
3. `storage_configuration.dot`
4. `security_audit.dot`
