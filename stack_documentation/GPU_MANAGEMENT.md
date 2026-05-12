# GPU Management & Eviction Logic

This document details how the system arbitrates between long-running LLM processes (Ollama) and high-priority training jobs (XGBoost).

## Hardware Configuration
- **Total VRAM:** ~26GB across two GPUs.
- **GPU 0 (RTX 5080):** 16GB. Primary target for Ollama models (e.g., `gpt-oss:20b`).
- **GPU 1 (RTX 3080):** 10GB. Secondary accelerator.

## Custom Scripts
The scripts are located in `/usr/local/bin/` and are globally executable.

### 1. `gpu-status`
- **Purpose:** Fast check of VRAM and current Ollama model state.
- **Output:** Combines `nvidia-smi` query with `ollama ps` info.

### 2. `gpu-evict`
- **Purpose:** Forcefully (but gracefully) clear VRAM for training.
- **Mechanism:**
    1. Polls `http://localhost:11434/api/ps`.
    2. Sends `/api/generate` request with `keep_alive: 0` for all active models.
    3. Waits up to 20 seconds (configurable) for VRAM to be reported as free by `nvidia-smi`.

## Code Integration: `evict_and_claim()`
Training scripts implement a standard "Claim" pattern:
1. **Request Eviction:** Call `gpu-evict`.
2. **Poll Status:** Wait up to 60 seconds for `openclaw-gateway` or other proxies to finish active generations.
3. **Claim GPU:** Once VRAM > 4GB free, proceed with CUDA initialization.
4. **CPU Fallback:** If the timeout is reached and VRAM is still locked, the script falls back to CPU (if supported) or alerts for human intervention.
