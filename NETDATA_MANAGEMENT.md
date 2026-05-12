# Netdata Management

This documentation explains how to manage the Netdata service.

**Important Update:** Netdata is now **DISABLED** on system boot by default to save resources.

## Netdata Switch Utility

A dedicated management folder has been created at `./netdata-switch/`. It contains scripts for clean, aggressive service management.

### Recommended Usage

To manage the service, use the scripts in the `netdata-switch` directory:

- **Start:** `./netdata-switch/start.sh`
- **Stop (Aggressive Cleanup):** `./netdata-switch/stop.sh`
- **Toggle:** `./netdata-switch/toggle.sh`
- **Status:** `./netdata-switch/status.sh`

### Script Functionality
The `stop.sh` script is specifically designed to handle orphaned plugins (like `nvidia-smi` or `apps.plugin`) that often linger after a standard `systemctl stop`. It performs:
1.  **Graceful Stop**: `sudo systemctl stop netdata`.
2.  **Orphan Search**: Scans for processes by name and by the `netdata` user.
3.  **Force Termination**: Uses `kill -9` on any lingering components.

## Manual Management

If you prefer to manage the service manually:

### Stop Netdata (temporary)
```bash
sudo systemctl stop netdata
```

### Start Netdata
```bash
sudo systemctl start netdata
```

### Enable/Disable Boot Start
```bash
sudo systemctl enable netdata   # Turn on boot-start
sudo systemctl disable netdata  # Turn off boot-start (Current Default)
```
