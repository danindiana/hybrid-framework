#!/usr/bin/env python3
import os

def load_manifest(filepath):
    """Loads a manifest into a set of (size, basename) for fast lookup."""
    manifest_set = set()
    with open(filepath, 'r') as f:
        for line in f:
            parts = line.strip().split(' ', 1)
            if len(parts) == 2:
                size, path = parts
                basename = os.path.basename(path)
                manifest_set.add((size, basename))
    return manifest_set

def find_unique(source_manifest, dest_manifest_set, output_list):
    """Identifies files in source not present in destination manifest set."""
    unique_count = 0
    with open(source_manifest, 'r') as f, open(output_list, 'w') as out:
        for line in f:
            parts = line.strip().split(' ', 1)
            if len(parts) == 2:
                size, path = parts
                basename = os.path.basename(path)
                if (size, basename) not in dest_manifest_set:
                    out.write(path + '\n')
                    unique_count += 1
    return unique_count

if __name__ == "__main__":
    print("Loading Master manifest...")
    master_set = load_manifest('master_manifest.txt')
    print(f"Loaded {len(master_set)} unique size+name pairs from Master.")
    
    print("Finding unique files in Suspect manifest...")
    unique_total = find_unique('suspect_manifest.txt', master_set, 'truly_unique_files_drive_1.txt')
    
    print(f"Completed! Found {unique_total} unique files on Drive 1.")
    print("List saved to truly_unique_files_drive_1.txt")
