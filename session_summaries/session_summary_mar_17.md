# Session Summary: qBittorrent Path Restoration & Drive Recovery

**Date:** Tuesday, March 17, 2026
**Host:** `worlock`

## 1. qBittorrent "Missing Files" Investigation
*   **Issue:** Torrents for "Movies" and "Supernatural" were showing as "Missing Files" in the qBittorrent UI.
*   **Root Cause:** The system's drive mount points had changed. qBittorrent was configured to look for files in `/media/jeb/UUID/`, but the drives are now mounted under `/mnt/`.
    *   **RAID0:** Previously at `/media/jeb/7514e32b-65c9-4a64-a233-5db2311455f4/`, now at `/mnt/raid0/`.
    *   **500GB SSD:** Previously at `/media/jeb/500gbssd/`, now unmounted as `/dev/sdf1`.

## 2. Recovery & Fixes
*   **RAID0 (Movies & Music):**
    *   Confirmed data exists at `/mnt/raid0/movies` and `/mnt/raid0/music`.
    *   **Fix:** Created symbolic links from the old `/media/jeb/` paths to the new `/mnt/raid0/` paths. 
    *   **Paths Linked:**
        *   `/media/jeb/7514e32b-65c9-4a64-a233-5db2311455f4/movies` -> `/mnt/raid0/movies`
        *   `/media/jeb/7514e32b-65c9-4a64-a233-5db2311455f41/movies` -> `/mnt/raid0/movies` (Handled a UUID string variation found in config).
        *   Similar links created for the `music` folder.

*   **Supernatural Series Recovery:**
    *   **Discovery:** Found the missing series on an unmounted 5.4T partition (`/dev/sdf1`) labeled as an ext4 filesystem.
    *   **Persistence:** 
        *   Created a permanent mount point at `/mnt/sdf1`.
        *   Updated `/etc/fstab` with the drive's UUID (`250bc5fa-56a7-4fbf-94f4-9089c7932dd4`) to ensure it mounts automatically on boot.
    *   **Fix:** Created symbolic links so qBittorrent can find the files at its expected location:
        *   `/media/jeb/500gbssd/supernatural` -> `/mnt/sdf1/supernatural`
        *   Also added links from the RAID0 paths as a fallback.

## 3. System Configuration Changes
*   **Filesystem:** `/etc/fstab` updated to include `/mnt/sdf1`.
*   **Mount Points:** Created `/mnt/sdf1`, `/media/jeb/500gbssd/`, and `/media/jeb/7514e32b-65c9-4a64-a233-5db2311455f4/`.

---
**System Status:**
*   **qBittorrent:** Files are now reachable. (Note: A "Force Recheck" in the UI may be required for the app to pick up the changes).
*   **Storage:** All primary storage partitions are now correctly identified and mounted.
