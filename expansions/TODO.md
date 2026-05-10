# House-keeping TODO List

## Immediate (P0)
- [ ] Stabilize `viz_refresh.sh` recursion for massive repositories.
- [ ] Add error handling to `forensic_run.sh` for when Ollama is offline.
- [ ] Standardize timestamp formats across all JSON logs.

## Maintenance (P1)
- [ ] Archive session logs older than 30 days into `archive/`.
- [ ] Prune redundant `.png` files when `.dot` files are deleted.
- [ ] Update `README.md` with new expansion diagrams.

## Long-term (P2)
- [ ] Port `semantic_check.py` to Go for zero-dependency execution.
- [ ] Implement a TUI (Terminal User Interface) for the `Hybrid Capability Assessment`.
