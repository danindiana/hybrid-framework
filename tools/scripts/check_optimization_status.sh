#!/bin/bash

# Configuration
RAID_MOUNT="/mnt/raid0"
BACKUP_DIR="/media/jeb/New Volume/RAID_Backup"
SOURCE_DIR="$RAID_MOUNT/ext_4tb_backup/3DprintTelegram"

echo "Checking status of compression jobs..."

# Check if 7z is running
if pgrep -x "7z" > /dev/null
then
    echo "Compression is still running. PIDs:"
    pgrep -a "7z"
    echo "You can monitor progress with 'top' or 'htop'."
else
    echo "No 7z processes found. Assuming compression finished or stopped."
fi

echo ""
echo "When compression is finished, you can run the backup with:"
echo "rsync -av --progress \"$SOURCE_DIR/\"*.7z \"$BACKUP_DIR/\""

echo ""
echo "Current archives:"
ls -lh "$SOURCE_DIR/"*.7z 2>/dev/null || echo "No .7z archives found yet."
