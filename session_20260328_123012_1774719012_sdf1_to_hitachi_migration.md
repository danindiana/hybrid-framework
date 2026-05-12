# Session Documentation: sdf1 to hitachi_2tb Migration
**Date:** Saturday, March 28, 2026
**Timestamp:** 20260328_123012
**Unix Time:** 1774719012

## Objective
Move all files from disk `sdf1` to `hitachi_2tb` while respecting an ongoing `rsync` archive move on `sdf1`.

## Current Status
- **Active**: The migration is running with `ionice -c 3` and `--bwlimit=5M`.
- **Process ID**: `613500` (jeb).
- **Verification**: Confirmed disk writes to `/dev/sdb` and partial files (e.g., `.GOPR0963.MP4.m3hmiA`) appearing in the destination.
- **Log**: The operator is monitoring via `tee` in a separate terminal.

## Plan
1. Use `rsync` to move files from `/mnt/sdf1/` to `/mnt/hitachi_2tb/sdf1_migration/`.
2. Apply `ionice -c 3` (idle priority) to the new move.
3. Apply `rsync --bwlimit=5M` to further reduce impact on the ongoing `raid0` rsync.
4. Use `--remove-source-files` to ensure it's a "move" rather than just a "copy", while maintaining safety.
