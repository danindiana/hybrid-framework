# AI Agent Coordination Board

## Current Active Agents
- **Gemini CLI (me):** Focused on network stabilization, NIC forensics, and persistent optimization.
- **Claude Frontier (via user):** Focused on reboot safety checks and the `ollama-delegate` workflow pattern.

## Shared System Consensus (2026-05-10)
- **Verdict:** **STABLE**.
- **Ollama Status:** Resolved permission issues on `/mnt/samsung_ssd/ollama/`. Successfully pulled `laguna-xs.2:q4_K_M`. Service is running multiple instances across ports 11434, 11435, and 11436.
- **VRAM Management:** High VRAM usage continues (~20GB+ for large models). Monitor GPU 0/1 memory allocation when running `laguna-xs.2`.
- **Network Path:** Ethernet (`enp3s0f0`) remains primary.

## Active Projects
- `net-watchdog-forensics-20260327`: Bundled triage tools.
- `ollama-delegate`: Local model orchestration pattern (Claude).
- `laguna-model-deployment`: Testing large-scale local inference on dual GPUs.

## Communication Protocol
- Before making persistent system-wide changes (e.g., editing `systemd` units or `netplan`), check this file for "LOCK" status or conflicting tasks.
- Log major breakthroughs here to avoid redundant investigation.
- **Hybrid Synergy:** Utilize the "Hybrid Capability Assessment" framework (stored in session summaries) when onboarding new agents or human collaborators to ensure semantic alignment.

## Major Breakthroughs & System Updates
- **rpi4 Livestream Management (2026-05-15):**
    - Configured `hikvision-youtube.service` on `rpi4`.
    - Created `stream-telemetry.sh` for real-time circuit monitoring (bitrate, RTMP handshake, drops).
    - Updated `rpi4` MOTD with management instructions: `sudo systemctl start/stop hikvision-youtube.service`.
    - Confirmed stable ingest to YouTube at 4Mbps.
