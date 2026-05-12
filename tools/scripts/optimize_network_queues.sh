#!/bin/bash
# Network Queue Optimization Script
# Dynamically detects physical network interfaces and sets combined queues to the maximum supported.

# Get all physical ethernet interfaces that are UP
INTERFACES=$(ip -br link show | grep -E "^e" | grep "UP" | awk '{print $1}')

if [ -z "$INTERFACES" ]; then
    echo "No active physical network interfaces found."
    exit 0
fi

for IFACE in $INTERFACES; do
    echo "Optimizing interface: $IFACE"
    
    # Get max combined queues
    MAX_COMBINED=$(ethtool -l "$IFACE" 2>/dev/null | grep -A 5 "Pre-set maximums:" | grep "Combined:" | awk '{print $2}')
    
    if [ -z "$MAX_COMBINED" ] || [ "$MAX_COMBINED" -le 1 ]; then
        echo "  -> Interface $IFACE does not support multiple combined queues (Max: ${MAX_COMBINED:-1}). Skipping."
        continue
    fi
    
    echo "  -> Setting combined queues to $MAX_COMBINED"
    ethtool -L "$IFACE" combined "$MAX_COMBINED"
done
