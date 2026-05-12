# Session Summary - April 21, 2026: WireGuard Installation & PIA VPN Analysis

## Objective
Verify the presence of WireGuard on the system and install the necessary tools while ensuring no conflicts with the existing Private Internet Access (PIA) VPN client.

## Findings

### Initial State
- **WireGuard Tools:** Not installed (`wg` command missing).
- **Kernel Module:** The `wireguard` kernel module was already loaded.
- **PIA VPN:** Installed and running via `piavpn.service`. 
  - Protocol set to `wireguard`.
  - Connection state was `Disconnected`.
- **System:** Ubuntu Jammy (22.04).

### Actions Taken
1. **Installed `wireguard-tools`:** Executed `sudo apt-get install -y wireguard-tools` to provide the `wg` and `wg-quick` utilities.
2. **Verification:** Confirmed `wg --version` and the presence of `/usr/bin/wg-quick`.
3. **Coexistence Check:** Confirmed that `pia-daemon` remains active and functional.

## Configuration & Coexistence Notes

### Potential Conflict Areas
- **Routing & Killswitch:** PIA's killswitch or advanced routing features may interfere with manual WireGuard interfaces (e.g., `wg0`). If traffic is blocked on manual tunnels, ensure the PIA killswitch is disabled via `piactl`.
- **DNS Management:** Both `wg-quick` and PIA attempt to manage `/etc/resolv.conf`. Conflict may occur if both are active simultaneously.
- **Interface Naming:** PIA manages its own interfaces internally. Manual configurations should use standard naming (e.g., `/etc/wireguard/wg0.conf`) to avoid overlap.

### Useful Commands
- **Check PIA Status:** `/opt/piavpn/bin/piactl get connectionstate`
- **Check WireGuard Status:** `sudo wg show`
- **Toggle PIA Killswitch:** `/opt/piavpn/bin/piactl set killswitch [on/off]`
