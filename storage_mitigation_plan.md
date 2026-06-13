# 📝 Plan: Storage Risks Mitigation Strategy
**Timestamp:** 2026-06-13T11:21:44-05:00  
**Machine:** worlock  

This document outlines the proposed action plan to mitigate the three identified storage configuration risks. **These changes are planned but not yet implemented.**

---

## Plan 1: Mitigating RAID0 Array Data Loss

### Goal
Provide automatic recovery capabilities for critical workspace data and databases residing on `/dev/md0` without sacrificing RAID0 processing speeds.

### Proposed Steps
1. **Identify Critical Paths:** Document all critical directories on `/dev/md0` (e.g. active Neo4j database files, workspace repositories, local checkpoints).
2. **Draft a Backup Script (`backup_raid0.sh`):**
   * Write a bash script that validates the RAID0 array is active and mounted.
   * Check space on the target backup disk (e.g., the Samsung SSD `/mnt/samsung_ssd/backups/`).
   * Perform incremental syncs using `rsync -av --delete`.
   * Log runs and notify the user on failure.
3. **Configure User Cron Job:**
   * Schedule the script to run daily at off-peak hours (e.g. `0 2 * * *`).

---

## Plan 2: Eliminating Standby HDD Shutdown Latency & Wear

### Goal
Prevent quiescent mechanical drives from spinning up during shutdown sequences, reducing system shutdown delay and preventing mechanical drive wear.

### Proposed Steps
1. **Audit Active Mounts:**
   * Identify all active mount points mapped to mechanical disks (`/dev/sdc`, `/dev/sde`, `/dev/sdg`) and check their current flags in `/etc/fstab`.
2. **Modify `/etc/fstab`:**
   * Change flags from `defaults` or `rw` to `ro,noatime,nofail`.
3. **Create Toggle Scripts:**
   * Create helper scripts (`mount_rw.sh` and `mount_ro.sh`) to simplify temporary write sessions.
   * **`mount_rw.sh`:**
     ```bash
     sudo mount -o remount,rw /mnt/archive
     ```
   * **`mount_ro.sh`:**
     ```bash
     sudo mount -o remount,ro /mnt/archive
     ```

---

## Plan 3: Stabilizing Ollama Redirection Permissions

### Goal
Ensure the symlinked model directory on the Samsung SSD maintains `ollama:ollama` ownership, preventing silent permission errors when launching models.

### Proposed Steps
1. **Create Verification Script (`verify_ollama_storage.sh`):**
   * A script that checks:
     * If `/mnt/samsung_ssd` is mounted.
     * If the target `/mnt/samsung_ssd/ollama/.ollama` exists.
     * If the owner is recursively set to UID `999` and GID `988`.
     * If permissions are incorrect, automatically repair them:
       ```bash
       sudo chown -R ollama:ollama /mnt/samsung_ssd/ollama/
       ```
2. **Configure systemd `ExecStartPre` Hook:**
   * Inject this script as a pre-launch check in the primary `ollama.service` configuration:
     ```ini
     # /etc/systemd/system/ollama.service.d/override.conf
     [Service]
     ExecStartPre=/usr/local/bin/verify_ollama_storage.sh
     ```
   * Reload systemd daemon metadata (`systemctl daemon-reload`) to apply the hook.
