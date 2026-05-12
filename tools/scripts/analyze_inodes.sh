#!/bin/bash

OUTPUT_FILE="inode_report_raw.txt"
echo "Inode Analysis Started at $(date)" > "$OUTPUT_FILE"

analyze_mount() {
    MOUNT_POINT="$1"
    NAME="$2"
    echo "---------------------------------------------------" >> "$OUTPUT_FILE"
    echo "Analyzing $NAME ($MOUNT_POINT)..." >> "$OUTPUT_FILE"
    echo "Top 10 directories by file count (inodes):" >> "$OUTPUT_FILE"
    
    # Run du with --inodes, -S (separate dirs), -x (one filesystem)
    # 2>/dev/null to suppress permission errors
    du --inodes -Sx "$MOUNT_POINT" 2>/dev/null | sort -rh | head -n 10 >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
}

# 1. System Root
analyze_mount "/" "System Root"

# 2. RAID 0
analyze_mount "/mnt/raid0" "RAID 0 Array"

# 3. NVMe Storage
analyze_mount "/mnt/nvme0" "NVMe Secondary"

# 4. External/Loop Mounts (Iterate /media/jeb)
for d in /media/jeb/*; do
    if [ -d "$d" ]; then
        analyze_mount "$d" "External Drive: $(basename "$d")"
    fi
done

echo "Analysis Completed at $(date)" >> "$OUTPUT_FILE"
echo "Report generated in $OUTPUT_FILE"
