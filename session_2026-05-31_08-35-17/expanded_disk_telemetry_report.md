# Comprehensive Disk & Inode Telemetry Report
**Generated at**: 2026-05-31T09:20:37-05:00

## 1. System Inode Utilization (df -i)
All mounted filesystems show excellent inode availability, with the highest usage on the root partition (`/`) at only **9%**. There are no indications of inode pressure.

| Filesystem | Mount Point | Inodes | Used | Free | Use % |
| :--- | :--- | ---: | ---: | ---: | ---: |
| `/dev/nvme1n1p1` | `/` | 62,472,192 | 5,480,853 | 56,991,339 | 9% |
| `/dev/sdd1` | `/mnt/sdf1` | 180,178,944 | 8,022,358 | 172,156,586 | 5% |
| `/dev/sdc1` | `/mnt/sda1` | 61,054,976 | 1,389,162 | 59,665,814 | 3% |
| `/dev/sdf1` | `/media/jeb/20a5...` | 186,040,320 | 2,823,454 | 183,216,866 | 2% |
| `/dev/sda1` | `/mnt/samsung_ssd` | 30,531,584 | 223 | 30,531,361 | 1% |
| `/dev/sde1` | `/mnt/hitachi_2tb` | 122,101,760 | 163,616 | 121,938,144 | 1% |
| `/dev/nvme2n1p2` | `/mnt/nvme_staging` | 244,121,600 | 469,919 | 243,651,681 | 1% |
| `/dev/md0` | `/mnt/raid0` | 366,206,976 | 3,232,929 | 362,974,047 | 1% |

---

## 2. Hardware Health & Telemetry (SMART Data)

Below is the hardware information and total power-on time for all physical disks (both active and inactive).

### NVMe Drives
* **nvme0n1** (Unmounted)
  * **Model**: WD Black SN750 (WDS500G2X0C-00L350)
  * **Serial**: 184043802337
  * **Power-On Time**: 45,180 hours (~5.1 years)

* **nvme1n1** (OS Drive - `/`)
  * **Model**: Intel SSD 660p (INTEL SSDPEKNW010T8)
  * **Serial**: PHNH930605FY1P0B
  * **Power-On Time**: 44,843 hours (~5.1 years)

* **nvme2n1** (Staging - `/mnt/nvme_staging`)
  * **Model**: Crucial P3 Plus (CT4000P3PSSD8)
  * **Serial**: 2517E9BA422E
  * **Power-On Time**: 433 hours (~18 days)

### SATA SSDs
* **sda** (Mounted - `/mnt/samsung_ssd`)
  * **Model**: Samsung SSD 870 EVO 500GB
  * **Serial**: S6PXNS0YC00884H
  * **Power-On Time**: 1,770 hours (~73 days)

* **sdb** (Unmounted)
  * **Model**: WD Blue 1TB SSD (WDC WDS100T2B0A-00SM50)
  * **Serial**: 21313F803818
  * **Power-On Time**: 31,301 hours (~3.5 years)

### SATA Hard Disk Drives (HDDs)
* **sdc** (Mounted - `/mnt/sda1`)
  * **Model**: Western Digital AV-GP 1TB (WDC WD10EURX-63UY4Y0)
  * **Serial**: WD-WCC4J2CHPRRU
  * **Power-On Time**: 72,540 hours (~8.2 years) - *Oldest drive in the system!*

* **sdd** (RAID0 & Mount - `/mnt/sdf1`)
  * **Model**: Seagate IronWolf 12TB (ST12000VN0008-2PH103)
  * **Serial**: ZLW2HXSN
  * **Power-On Time**: 16,646 hours (~1.9 years)

* **sde** (Mounted - `/mnt/hitachi_2tb`)
  * **Model**: Hitachi Ultrastar 7K3000 2TB (Hitachi HUA723020ALA640)
  * **Serial**: MK0171YFJHSSDA
  * **Power-On Time**: 43,038 hours (~4.9 years)

* **sdf** (RAID0 & Mount - `/media/jeb/...`)
  * **Model**: Seagate IronWolf 12TB (ST12000VN0008-2PH103)
  * **Serial**: ZL2PLEG9
  * **Power-On Time**: 17,105 hours (~1.9 years)

* **sdg** (Unmounted)
  * **Model**: WD Black 4TB (WDC WD4005FZBX-00K5WB0)
  * **Serial**: VBGZSTNF
  * **Power-On Time**: 22,157 hours (~2.5 years)
