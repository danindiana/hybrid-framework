# Session: Militia Folder Search
Date: Monday, May 18, 2026

## Objective
Find a folder named "militia" (exact match) that contains mostly .pdf files, searching across different disks if necessary.

## Investigation
I searched the following mounted disks:
- `/` (Root)
- `/mnt/raid0`
- `/mnt/sdf1`
- `/mnt/sda1`
- `/mnt/samsung_ssd`

### Found Folders
Several folders named "militia" were found:
1. `/home/jeb/Documents/militia`
2. `/mnt/raid0/monolithic_pdf_folder/incoming_Pdfsv2/militia`
3. `/mnt/sdf1/incoming_Pdfsv2/militia` (Likely a duplicate or backup)
4. Various backup paths in `/mnt/sdf1/worlock-os-backup-...`

### File Count Analysis
I analyzed the file composition of the primary candidates:

#### `/home/jeb/Documents/militia`
- **Total files (recursive):** 154
- **PDF files (recursive):** 60 (~39%)

#### `/mnt/raid0/monolithic_pdf_folder/incoming_Pdfsv2/militia`
- **Total files (recursive):** 2178
- **PDF files (recursive):** 1147 (~52.6%)
- **Subdirectories:** Contains many specialized subdirectories (Artillery, Drones, Intelligence, etc.) which are primarily populated with PDF documents.

## Conclusion
The folder located at **`/mnt/raid0/monolithic_pdf_folder/incoming_Pdfsv2/militia`** is the one that best matches the description of containing "mostly .pdf files" (over 50% of the 2,178 files are PDFs).

## Summary of Findings
- **Target Folder:** `/mnt/raid0/monolithic_pdf_folder/incoming_Pdfsv2/militia`
- **PDF Count:** 1,147
- **Total Count:** 2,178
- **Disk:** /mnt/raid0
