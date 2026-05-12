#!/bin/bash
# Network Health Check Script

echo "--- Network Health Check ---"

# 1. Check DNS Resolution
echo -n "[1/3] Testing DNS Resolution... "
if host google.com > /dev/null 2>&1; then
    echo "OK"
else
    echo "FAILED"
fi

# 2. Check systemd-resolved mode
echo -n "[2/3] Checking Resolver Mode... "
MODE=$(resolvectl status | grep "resolv.conf mode" | awk '{print $NF}')
if [ "$MODE" == "stub" ]; then
    echo "OK (stub)"
else
    echo "WARNING ($MODE)"
fi

# 3. Check for Multipath Routes
echo -n "[3/3] Checking for Rogue Routes... "
MULTI=$(ip route show default | grep "nexthop" | wc -l)
if [ "$MULTI" -eq 0 ]; then
    echo "OK (Clean)"
else
    echo "WARNING (Multipath Detected)"
fi

echo "--------------------------"
