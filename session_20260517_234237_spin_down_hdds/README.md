# Session: Spin Down HDDs
**Date:** 2026-05-17 23:42:37
**Goal:** Reduce wear and heat by spinning down rotational disk drives.

## Identified HDDs
The following rotational drives were identified:
- `/dev/sdc`: WDC WD10EURX-63UY4Y0 (931.5G)
- `/dev/sdd`: ST12000VN0008-2PH103 (10.9T)
- `/dev/sde`: ST12000VN0008-2PH103 (10.9T)
- `/dev/sdf`: WDC WD4005FZBX-00K5WB0 (3.6T)

## Actions
1. Set spin-down timeout to 10 minutes (`hdparm -S 120`).
2. Triggered immediate standby (`hdparm -y`).
3. Persisted settings in `/etc/hdparm.conf` using persistent device IDs:
   - `ata-WDC_WD10EURX-63UY4Y0_WD-WCC4J2CHPRRU` (/dev/sdc)
   - `ata-ST12000VN0008-2PH103_ZLW2HXSN` (/dev/sdd)
   - `ata-ST12000VN0008-2PH103_ZL2PLEG9` (/dev/sde)
   - `ata-WDC_WD4005FZBX-00K5WB0_VBGZSTNF` (/dev/sdf)

## Status
- [x] /dev/sdc: Standby (10 min timeout) - **Persisted**
- [x] /dev/sdd: Standby (10 min timeout) - **Persisted**
- [x] /dev/sde: Standby (10 min timeout) - **Persisted**
- [x] /dev/sdf: Standby (10 min timeout) - **Persisted**

## Conclusion
All rotational drives have been successfully transitioned to standby mode. They will automatically spin down after 10 minutes of inactivity if they are woken up.
