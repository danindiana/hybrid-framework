# Session Summary: OpenClaw Ollama Model Selection Fix
**Date:** Tuesday, April 7, 2026

## Objective
Investigate and resolve an issue where the `openclaw tui` was not allowing the user to select any Ollama models other than the single default model (`devstral:24b`), despite having many models installed locally.

## Investigation Findings
- **Model Discovery:** Running `ollama list` confirmed that the system had approximately 30 models installed (e.g., `deepseek-r1`, `qwen3.5`, `nemotron-terminal`, `ministral`, etc.).
- **OpenClaw Configuration:**
    - The main configuration file is located at `~/.openclaw/openclaw.json`.
    - The agent-specific model list is at `~/.openclaw/agents/main/agent/models.json`.
- **Root Cause:** 
    1. **Authentication:** OpenClaw had not performed a discovery scan for the local Ollama provider, resulting in a "Missing auth" status for the provider.
    2. **Configuration State:** Even when models were present in the internal catalog, they were not marked as "configured." OpenClaw's TUI only displays models that are explicitly configured for the active agent.

## Actions Taken
1.  **Provider Authentication:** 
    - Executed `openclaw models auth login --provider ollama`. 
    - This triggered a discovery scan of the local Ollama instance at `http://127.0.0.1:11434`, identifying all 30+ installed models.
2.  **Bulk Model Activation:** 
    - Programmatically updated `~/.openclaw/openclaw.json` to add all discovered Ollama models to the `agents.defaults.models` list.
    - This changed their status from "available" (in the catalog) to "configured" (available for selection in the TUI).
3.  **Service Synchronization:** 
    - Restarted the `openclaw-gateway` systemd service using `openclaw gateway restart` to ensure the running gateway picked up the configuration changes.
4.  **Validation:** 
    - Verified the fix with `openclaw models list`, which now correctly shows all 30+ local models as `configured`.

## Outcome
The `openclaw tui` now allows selection of any locally installed Ollama model. The default model was successfully changed during the process and the full catalog is now active.

## Recommendation for Future Syncs
If you download new models via `ollama pull`, you can sync them into OpenClaw by running:
```bash
openclaw models auth login --provider ollama
```
This will re-scan the local instance and update the internal model definitions.
