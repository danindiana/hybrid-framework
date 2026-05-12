# Session Documentation - 2026-03-27

## Network Connectivity Investigation (X540-T2)

### 1. Hardware & Interface Status
- **NIC:** Intel X540-AT2 (Dual Port 10GbE).
- **Link State:** Both ports (enp3s0f0, enp3s0f1) are active at 1Gbps, Full Duplex.
- **MTU:** Set to 9000 (Jumbo Frames) on both ports.
- **IP Assignment:**
  - enp3s0f0: 192.168.1.135 (Primary, Metric 100)
  - enp3s0f1: 192.168.1.113 (Secondary, Metric 200)

### 2. Routing Misconfiguration (The "Race Condition")
- **Multipath Route Detected:** A manual/scripted multipath default route existed in the main table with metric 0 (preferred).
  - `default nexthop via 192.168.1.254 dev enp3s0f0 weight 1 nexthop via 192.168.1.254 dev enp3s0f1 weight 1`
- **Impact on VPN:**
  - PIA VPN uses policy routing (fwmark 0x3213) to bypass the tunnel for its own encrypted traffic.
  - This marked traffic hit the main table and was load-balanced across both ports, causing instability.

### 3. DNS Configuration
- **Previous State:** Multiple overlapping files in `/etc/systemd/resolved.conf.d/` caused a "Too many DNS servers" warning in `resolv.conf`.
- **Current State:** Redundant overrides removed. System uses primary DNS (1.1.1.1, 1.0.0.1) with PIA providing link-specific DNS (1.1.1.1, 8.8.8.8).

### 4. Actions Taken (2026-03-27)
- **Removed Multipath Route:** Successfully deleted the ECMP default route to stop unstable load balancing.
- **Hardened ARP Settings:**
  - `net.ipv4.conf.all.arp_ignore` set to 1.
  - `net.ipv4.conf.all.arp_announce` set to 2.
- **DNS Cleanup:** Deleted `/etc/systemd/resolved.conf.d/99-custom-dns.conf`, `custom-dns.conf`, and `00-dns-override.conf`.
- **Status:** VPN tunnel packets now pinned to enp3s0f0 by interface metric. DNS warnings resolved.
