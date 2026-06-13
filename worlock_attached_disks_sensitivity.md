# 📊 Worlock Attached Disks & Spin-Down Wear Sensitivity
**Timestamp:** 2026-06-13T11:23:05-05:00  
**Machine:** worlock  

This document maps all attached storage devices on the **worlock** system, their active mount points, filesystem types, UUIDs, and their relative risk level regarding HDD spin-down mechanical wear.

---

## 1. System Storage Map

The following map is compiled from active kernel disk descriptors (`lsblk`), filesystem mounts (`df`), and static system configurations (`/etc/fstab`):

| Device | Partitions & Type | Size | Mount Point | UUID | Active Flags (`/etc/fstab`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`nvme2n1`** | `nvme2n1p1` (ext4)<br>`nvme2n1p2` (vfat) | 953.9 GB | `/`<br>`/boot/efi` | `2bd8e49f-7ea3-4755-8999-7b78f4223812`<br>`6832-AA83` | `defaults,noatime,discard,errors=remount-ro`<br>`umask=0077,nofail` |
| **`nvme0n1`** | `nvme0n1p2` (ext4) | 3.6 TB | `/mnt/nvme_staging` | `cc851e1e-0d21-48de-a35d-43f0b1d7597a` | `defaults,nofail` |
| **`sda`** | `sda1` (ext4) | 465.8 GB | `/mnt/samsung_ssd` | `f2dd6075-fa80-4695-817c-b08f28b74506` | `defaults,nofail` |
| **`sdc`** | `sdc1` (ext4) | 931.5 GB | `/mnt/sda1` | `bdfa8aeb-2dba-4de8-a5e4-e116f8166c87` | `ro,noatime,nofail` |
| **`sde`** | `sde1` (ext4) | 1.8 TB | `/mnt/hitachi_2tb` | `3d285e0a-9860-42ec-8aa9-a89b17ce7262` | `ro,noatime,nofail,x-systemd.device-timeout=5s` |
| **`sdd`** | `sdd1` (ext4)<br>`sdd2` (RAID0 member) | 10.9 TB | `/mnt/sdf1`<br>`/mnt/raid0` (`md0`) | `250bc5fa-56a7-4fbf-94f4-9089c7932dd4`<br>`7514e32b-65c9-4a64-a233-5db2311455f4` | `defaults,noatime,nofail`<br>`defaults,noatime,commit=60,nofail` |
| **`sdf`** | `sdf1` (ext4)<br>`sdf2` (RAID0 member) | 10.9 TB | Unmounted<br>`/mnt/raid0` (`md0`) | `20a55990-09e7-424b-9737-a689b1c7cbb7`<br>`7514e32b-65c9-4a64-a233-5db2311455f4` | N/A<br>`defaults,noatime,commit=60,nofail` |
| **`sdg`** | `sdg1` (ext4) | 3.6 TB | `/mnt/pdf_backup` | `674dd29f-6ba6-4f0f-80a8-58a0dded2c98` | `defaults,noatime,commit=60,nofail,noauto` |
| **`sdb`** | Spare (ext4) | 931.5 GB | Unmounted | `ba4c008c-3079-47f1-8e31-cc3547f6307f` | N/A |
| **`nvme1n1`**| Spare (ext4) | 465.8 GB | Unmounted | `1811ac93-d0fa-4131-83a4-29fa033d9d7e` | N/A |

---

## 2. HDD Spin-Down Wear Sensitivity Profiles

Disk drive structures fall into three distinct sensitivity classes based on their physical mechanisms and active mount flags:

### Class A: Zero Sensitivity (Solid-State Disks)
* **Devices:** `nvme2n1` (System Root), `nvme0n1` (Staging SSD), `sda` (Ollama SSD), `nvme1n1` (Spare).
* **Sensitivity:** **None**. These drives use NAND flash memory blocks. They lack mechanical actuators, motors, or platters, making them immune to spin-up/spin-down physical wear.

### Class B: Low Sensitivity / Protected (Read-Only Mechanical HDDs)
* **Devices:** `sdc` (WD Blue Backup, 931.5 GB), `sde` (Hitachi, 1.8 TB).
* **Sensitivity:** **Minimal**. Since these partitions are configured with the `ro` (read-only) mount flag, the system kernel does not perform file access writes, superblock updates, or log flushes during shutdown. They can remain in standby (low power, parked heads) without being woken up when the workstation is powered off.

### Class C: High Sensitivity / Active (Read-Write Mechanical HDDs)
* **Devices:** `sdd` & `sdf` (Enterprise 10.9 TB Disks), `sdg` (3.6 TB HDD).
* **Sensitivity:** **Critical**. Because these drives are mounted as read-write (`defaults`/`rw`), system cache syncs and unmount commands at shutdown immediately wake them up.
* **Impact Details:**
  * **Mechanical Stress:** Spinning up 10.9 TB high-capacity platters requires high startup current, introducing thermal load to the drive electronics and torque stress to the motor spindle.
  * **Head Friction:** Parked heads must load back onto the platter surface, increasing physical wear on head sliders and landing zones.
  * **System Latency:** The unmount service delays system shutdowns by up to **26 seconds** while waiting for physical drive spin-ups to complete.
