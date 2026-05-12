#!/bin/bash
# Network Repair Script - Created 2026-04-22
# This script targets DNS mode, Port 53 conflicts, and Routing instability.

echo "--- Starting Network Repair ---"

# 1. Stop and Disable dnsmasq (Conflict on Port 53)
if systemctl is-active --quiet dnsmasq; then
    echo "[1/4] Stopping conflicting dnsmasq service..."
    sudo systemctl stop dnsmasq
    sudo systemctl disable dnsmasq
else
    echo "[1/4] dnsmasq is already stopped/disabled. (OK)"
fi

# 2. Restore Resolver Stub Mode
echo "[2/4] Restoring systemd-resolved to standard stub mode..."
# Remove the override if it exists
if [ -f /etc/systemd/resolved.conf.d/no-stub.conf ]; then
    sudo rm /etc/systemd/resolved.conf.d/no-stub.conf
    echo "  -> Removed no-stub.conf override."
fi

# Fix the symlink
EXPECTED="/run/systemd/resolve/stub-resolv.conf"
CURRENT=$(readlink -f /etc/resolv.conf)
if [ "$CURRENT" != "$EXPECTED" ]; then
    sudo ln -sf "$EXPECTED" /etc/resolv.conf
    echo "  -> Restored /etc/resolv.conf symlink."
fi

# 3. Clean Rogue Multipath Routes
echo "[3/4] Cleaning routing table..."
# Check for any unexpected multipath routes on the primary interface
ACTIVE_IFACE=$(ip -br link show | grep -E "^e" | grep "UP" | awk '{print $1}')
if [ -n "$ACTIVE_IFACE" ] && ip route show default | grep -q "nexthop"; then
    sudo ip route del default 2>/dev/null
    sudo dhclient "$ACTIVE_IFACE" 2>/dev/null
    echo "  -> Cleaned multipath routes on $ACTIVE_IFACE."
else
    echo "  -> No rogue multipath routes detected. (OK)"
fi

# 4. Refresh Services
echo "[4/4] Restarting systemd-resolved..."
sudo systemctl restart systemd-resolved
sleep 2

echo "--------------------------"
# Run the check script to verify
if [ -f "./check_network.sh" ]; then
    ./check_network.sh
else
    echo "Repair complete. Please test your connection."
fi
