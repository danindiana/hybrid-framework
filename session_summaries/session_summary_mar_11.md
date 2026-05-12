# Session Summary: Audacious Audio Troubleshooting
**Date:** Wednesday, March 11, 2026

## Objective
Investigate and resolve why Audacious was not producing sound.

## Initial State
- Audacious was installed (version 4.1) but produced no audio output.
- The system was running **PipeWire** with PulseAudio emulation.
- Audacious was running but did not appear in the PulseAudio/PipeWire sink inputs list (`pactl list sink-inputs`).

## Diagnosis & Findings
1. **Plugin Conflict:** The Audacious `plugin-registry` had the **PulseAudio** output plugin disabled and the **ALSA** plugin enabled. This caused Audacious to attempt to use ALSA directly, which resulted in `snd_pcm_open failed: No such file or directory` errors.
2. **Configuration Errors:** The `~/.config/audacious/config` file contained duplicate and conflicting `output_plugin` entries.
3. **Internal Muting:** The internal Audacious volume was set to **0%**.

## Actions Taken
1. **Graceful Shutdown:** Stopped all running Audacious processes to allow safe modification of configuration files.
2. **Config Repair:** Used `sed` to clean up the `[audacious]` section of `~/.config/audacious/config`, ensuring only a single `output_plugin=pulse_audio` entry existed.
3. **Registry Reset:** Deleted `~/.config/audacious/plugin-registry` to force Audacious to re-scan its plugins and correctly prioritize the PulseAudio output.
4. **Volume Restoration:** Used `audtool` to set the internal volume to **100%** and performed a graceful restart to ensure the setting was committed to the config.

## Verification
- **Sink Input Active:** Confirmed that Audacious now appears in `pactl list sink-inputs` during playback.
- **Playback Success:** Verified that `test.wav` plays successfully through the PulseAudio/PipeWire backend.
- **Volume Persistence:** Confirmed that the volume remains at 100% after restarts.

## Final Status
**Resolved.** Audacious is fully functional and correctly integrated with the system audio server.


---

# Session Summary: Open WebUI Docker Installation
**Date:** Wednesday, March 11, 2026

## Objective
Install the latest dockerized version of Open WebUI and verify the installation files.

## Actions Taken
1.  **Research:** Identified the official Open WebUI GitHub repository and the recommended Docker installation method.
2.  **Asset Download:** Downloaded the essential orchestration files from the official repository:
    *   `docker-compose.yaml`: The primary orchestration file.
    *   `run-compose.sh`: A helper script for setup and GPU detection.
    *   `.env.example`: Template for environment variables.
    *   `docker-compose.gpu.yaml`: Extension for NVIDIA GPU support.
    *   `docker-compose.api.yaml`: Extension for exposing the Ollama API.
3.  **Verification:** Calculated and recorded the SHA256 checksums for all downloaded files to ensure integrity:
    *   `docker-compose.yaml`: `82290e0136a238cd4851459bff399ca164d595973ff337538994da01a877f683`
    *   `run-compose.sh`: `c32ef1d17884d63109fbcedd450326121deef5d6a2a826471b207e3d1c7c9853`
    *   `.env.example`: `ac594ebe7e5c3d2c95d4d3b8d99557f51d8531115ec9c93b272f191aa2db9cd5`
    *   `docker-compose.gpu.yaml`: `278958d6e908f22cee4c7b10c5c4b00883d6beb837dfbfae52314e4482ef7bc3`
    *   `docker-compose.api.yaml`: `ed5a760db36c89482be6b0c6d07b355e8892c18bec25fbab81bcb737c11f6eab`

## Final Configuration & Results
**Completed.** Open WebUI (v0.8.10) is installed, verified, and running on port 3000.

### Key Changes
- **System Integration:** Reconfigured the Docker setup to use the **system's Ollama runtime** directly at `127.0.0.1:11434`.
- **Host Networking:** Updated `docker-compose.yaml` with `network_mode: host` to allow seamless communication with the host's loopback interface.
- **Port Mapping:** The WebUI now listens on the host's port **3000** (via `PORT=3000` environment variable).

### Verification & Persistence
- **Service Status:** Docker daemon is active and `open-webui` container is `Up` and healthy.
- **Connectivity:** Confirmed the web interface is accessible at `http://localhost:3000` (HTTP 200 OK, title verified).
- **Ollama Access:** Verified the container can successfully fetch models (e.g., `deepseek-coder`, `qwen2.5-coder`) from the system's Ollama instance.
- **Persistence:** Container is managed by Docker Compose with `restart: unless-stopped` for automatic recovery across reboots.

---

# Session Summary: Samsung SSD 870 EVO Setup & Ollama Migration
**Date:** Wednesday, March 11, 2026

## Objective
Identify, format, and mount a new 500GB Samsung SSD and migrate Ollama model storage to it.

## Actions Taken
1.  **Disk Identification:** Identified the new Samsung 870 EVO 500GB SSD as `/dev/sde`.
2.  **Partitioning & Formatting:**
    *   Created a GPT partition table on `/dev/sde`.
    *   Created a single primary partition (`/dev/sde1`) using the full disk.
    *   Formatted the partition with the `ext4` filesystem and labeled it "Samsung_500GB".
3.  **Mounting & Persistence:**
    *   Created a permanent mount point at `/mnt/samsung_ssd`.
    *   Added an entry to `/etc/fstab` using the device UUID (`f2dd6075-fa80-4695-817c-b08f28b74506`) to ensure automatic mounting on boot.
    *   Mounted the drive and changed ownership of the mount point to user `jeb`.
4.  **Ollama Migration:**
    *   Stopped the `ollama` service.
    *   Moved the existing 25GB of models from `/usr/share/ollama/.ollama` to `/mnt/samsung_ssd/ollama/`.
    *   Created a symbolic link at `/usr/share/ollama/.ollama` pointing to the new storage location on the SSD.
    *   Adjusted permissions to ensure the `ollama` user has full access to the new directory.
    *   Restarted the `ollama` service.

## Verification
- **Mount Status:** Confirmed `/dev/sde1` is mounted at `/mnt/samsung_ssd` with 410GB of free space remaining.
- **Ollama Integrity:** Verified that `ollama list` correctly shows all previously downloaded models (e.g., `qwen2.5-coder`, `hermes3`).
- **Path Verification:** Confirmed that the symbolic link is correctly configured and pointing to the SSD.

## Final Status
---

# Session Summary: System Stability Investigation
**Date:** Wednesday, March 11, 2026

## Objective
Identify the cause of a hard system freeze and subsequent unstable reboot.

## Actions Taken
1.  **Log Analysis:** Identified a 38-minute gap in logs (`19:01` - `19:40`) corresponding to a total system hang.
2.  **Kernel Error Identification:** Discovered a `percpu: allocation failed` error during the recovery boot (`19:40`), indicating kernel memory pool exhaustion.
3.  **Hardware Assessment:** Monitored system temperatures and checked RAID/SSD status. Identified a recurring thermal sensor failure (`thermal_zone0`).
4.  **Documentation:** Created `investigation_system_freeze_mar_11.md` to track findings and root cause analysis.

## Findings
- **Freeze Time:** ~19:01 CDT.
- **Critical Failure:** Kernel per-CPU memory depletion.
- **Context:** Occurred shortly after high-volume data migration (25GB) and Open WebUI/Ollama setup.

## Next Steps
- Monitor per-CPU memory usage during LLM inference.
- Run SMART tests on RAID0 member disks.
- Investigate persistent thermal sensor read failures.
