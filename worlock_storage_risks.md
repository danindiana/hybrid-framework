# 💾 Storage Configuration Risks & Mitigation Guide
**Timestamp:** 2026-06-13T11:19:25-05:00  
**Machine:** worlock  

---

## 1. RAID0 Array Failure Risk (Critical)

### 🔍 Risk Analysis
Worlock has a **10.9 TB RAID0 partition (`/dev/md0`)** striped across physical disks `sdd` and `sdf`.
* **No Redundancy:** RAID0 stripes data blocks evenly across both drives. It contains zero parity or mirroring.
* **Failure Multiplier:** The probability of volume failure is twice that of a single drive. If either `sdd` or `sdf` experiences a hardware fault, sector corruption, or connection drop, the entire 10.9 TB filesystem becomes unrecoverable.
* **Impact:** Loss of local databases (e.g. Neo4j graph databases used by Graphify), active workspace files, or transient LLM outputs stored on the array.

### 🛠️ Mitigation Steps
1. **Work Isolation:** Use `/dev/md0` strictly for scratch directories, cache, and high-speed temporary operations (such as processing large raw text files or running temporary indexing workers).
2. **Automated Backup Routing:** Ensure that all code repositories, custom-trained weights, and configuration files are pushed to remote hosts (e.g. GitHub) or backed up to non-RAID disks.
3. **Array Monitoring:** Keep `mdadm` monitoring active. Check RAID health periodically:
   ```bash
   cat /proc/mdstat
   sudo mdadm --detail /dev/md0
   ```

---

## 2. Mechanical Disk Standby & Unmount Thrashing (Medium)

### 🔍 Risk Analysis
To conserve power and keep acoustics low, the mechanical drives (totaling 19.2 TB across `sdc`, `sde`, and `sdg`) are configured to spin down and park their heads during inactivity.
* **Spin-up Thrashing:** If these filesystems are mounted as read-write (`rw`), standard Linux shutdown or unmount sequences require writing metadata updates to the superblocks. This forces the kernel to send spin-up commands to the sleeping drives.
* **System Latency:** The unmount process blocks while waiting for the physical platters to reach operational RPM (typically causing a **11–26 second delay** during shutdowns).
* **Hardware Degradation:** Forcing mechanical drives to repeatedly spin up and down during system operations increases physical motor wear and shortens the Mean Time Between Failures (MTBF).

### 🛠️ Mitigation Steps
For static archival partitions (such as downloaded model blobs, research papers, or media archives), configure them as **read-only** in `/etc/fstab`:
1. **Identify the UUID:**
   ```bash
   blkid /dev/sdX1
   ```
2. **Configure `/etc/fstab`:**
   Modify the mount flags to include `ro` (read-only), `noatime`, and `nofail` (prevents boot hang if the drive is missing):
   ```fstab
   UUID=xxxx-xxxx-xxxx    /mnt/archive    ext4    ro,noatime,nofail    0    2
   ```
3. **Remount dynamically:**
   If temporary write access is required, remount read-write, perform the write, and immediately return the drive to read-only status:
   ```bash
   sudo mount -o remount,rw /mnt/archive
   # ... perform write ...
   sudo mount -o remount,ro /mnt/archive
   ```

---

## 3. Redirected Ollama Storage Permissions (Service Stability)

### 🔍 Risk Analysis
Because LLM model files are very large, the default Ollama home folder is symlinked to an external high-speed Samsung SSD:
* `/usr/share/ollama/.ollama` ➔ `/mnt/samsung_ssd/ollama/.ollama`
* **Ownership Sensitivity:** Ollama runs under a dedicated system user/group (`ollama:ollama`). If permissions on the external mount are modified (for example, if a model file or registry key is copied using `sudo` or the `jeb` user), ownership shifts.
* **Failure Symptom:** If the identity key (`/mnt/samsung_ssd/ollama/.ollama/id_ed25519`) or model directories are not readable/writable by the `ollama` user, the service crashes, fails to load models, or fails to fetch new weights with generic permission errors.

### 🛠️ Mitigation Steps
If permissions are broken or model downloads fail, run a recursive ownership restoration command:
```bash
sudo chown -R ollama:ollama /mnt/samsung_ssd/ollama/
sudo chmod -R 775 /mnt/samsung_ssd/ollama/
```
Ensure the target SSD is successfully mounted *before* starting or restarting the `ollama.service` systemd unit.
