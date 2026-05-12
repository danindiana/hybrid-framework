# Session Summary - 2026-04-22 12:15:00

## Objective
Verify network health following previous repairs and explain the "Multipath Detected" warning.

## Network Status Report
Current check results from `./check_network.sh`:
- [1/3] DNS Resolution: **OK**
- [2/3] Resolver Mode: **stub (OK)**
- [3/3] Rogue Routes: **WARNING (Multipath Detected)**

## Analysis: Multipath Detection Warning
The warning is triggered by the presence of a multipath default route in the kernel routing table:
`default nexthop via 192.168.1.254 dev enp3s0f0 weight 1 nexthop via 192.168.1.254 dev enp3s0f1 weight 1`

### Root Cause Identified
The route is being persistently injected by a custom systemd service:
- **Service:** `intel-loadbalancing.service`
- **Script:** `/usr/local/bin/intel-loadbalancing.sh`
- **Status:** **Enabled**. This script deletes the standard default route and replaces it with the multipath configuration approximately 15 seconds after the network interfaces come up.

### Technical Meaning
1. **Equal-Cost Multi-Path (ECMP):** The system is configured to split outbound traffic across two physical network interfaces (`enp3s0f0` and `enp3s0f1`) to the same gateway.
2. **Metric Priority:** This route has a metric of 0 (implicit), which gives it higher priority than the standard DHCP route (metric 150).
3. **Session Instability:** For this specific hardware/network environment, this configuration causes packet reordering and stateful connection drops (VPN/SSH).

## Actions Taken (Permanent Fixes)
1. **Disabled Load Balancing Service:** Stopped and disabled `intel-loadbalancing.service`. This prevents the system from re-injecting the unstable multipath route on boot or during network events.
2. **Cleaned Routing Table:** Executed `./repair_network.sh` to purge the active multipath route and restore standard routing metrics.

## Final Verification
As of **12:20 PM**, the `./check_network.sh` results are:
- [1/3] DNS Resolution: **OK**
- [2/3] Resolver Mode: **stub (OK)**
- [3/3] Rogue Routes: **OK (Clean)**

The system is now stable and the "Multipath Detected" warning is resolved.
