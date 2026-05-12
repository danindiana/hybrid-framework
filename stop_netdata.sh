#!/bin/bash

# Script to safely stop Netdata service while the OS is running.
# The service will start normally upon the next reboot because 'systemctl disable' is NOT called.

echo "Checking Netdata service status..."
if systemctl is-active --quiet netdata; then
    echo "Stopping Netdata service..."
    sudo systemctl stop netdata
    if [ $? -eq 0 ]; then
        echo "Netdata service has been stopped successfully."
    else
        echo "Failed to stop Netdata service. Please check for errors."
        exit 1
    fi
else
    echo "Netdata service is not currently running."
fi

echo "Note: Netdata remains enabled and will start automatically upon next reboot."
