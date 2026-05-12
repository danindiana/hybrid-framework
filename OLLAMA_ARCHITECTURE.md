# Ollama System Architecture & Storage Management

This document outlines the specialized Ollama configuration on the **worlock** system, specifically regarding storage redirection to external disks and multi-instance orchestration.

## 1. Storage Architecture

To prevent the root partition from filling up with large LLM weights, the Ollama data directory is redirected to an external high-speed SSD.

### The Redirected Path
The default Ollama home directory is symlinked to the external mount:
*   **Standard Path:** `/usr/share/ollama/.ollama`
*   **Physical Path:** `/mnt/samsung_ssd/ollama/.ollama`

### Directory Structure
*   `models/`: Contains the manifest files and the large blob files (shards).
*   `id_ed25519`: The identity key for the Ollama instance, used for authenticating with the model registry (crucial for `pull` operations).
*   `cache/`: Temporary files and download fragments.

### Critical Permissions
Files on the external storage **must** be owned by the `ollama` user (UID 999) and group (GID 998).
*   **Correction Command:** `sudo chown -R ollama:ollama /mnt/samsung_ssd/ollama/`
*   **Failure Symptom:** If ownership is incorrect (e.g., owned by `coder` or `root`), the service will fail to pull models with a "permission denied" error on the identity key.

## 2. Multi-Instance Service Configuration

This system runs three distinct Ollama instances to segregate workloads and manage dual GPUs.

| Service Name | Port | GPU Focus | User | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `ollama.service` | `11434` | GPU 0 (RTX 3090) | `ollama` | Primary system instance. |
| `ollama-secondary.service` | `11435` | GPU 1 (RTX 3080) | `ollama` | Secondary instance for load balancing. |
| `ollama-coder.service` | `11436` | GPU 1 (RTX 3080) | `jeb` | Specialized instance for coding models. |

### Resource Management
*   **OLLAMA_MAX_LOADED_MODELS**: Set to `2` on the primary instance to allow concurrent model usage.
*   **OLLAMA_NUM_PARALLEL**: Typically set to `1` to maximize token throughput per request.
*   **OLLAMA_KEEP_ALIVE**: Set to `60m` to keep models in VRAM for performance.

## 3. Maintenance & Troubleshooting

### Pulling Models
When pulling models, the primary instance (`ollama.service`) uses the credentials stored in the symlinked SSD path. Ensure the SSD is mounted before starting the services.

### Monitoring
Use the `ollama_wizard.sh` script in the workspace to:
*   `status`: View loaded models across instances.
*   `follow`: Monitor real-time logs for the main service.

### Service Overrides
Main service environment variables are managed via systemd overrides:
`/etc/systemd/system/ollama.service.d/override.conf`
