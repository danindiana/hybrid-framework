#!/bin/bash
# Script to select and open Google Chrome profiles

CHROME_CONFIG="$HOME/.config/google-chrome"
PROFILES=()

# Find all profile directories
for dir in "$CHROME_CONFIG"/{Default,Profile*}; do
  if [ -d "$dir" ] && [ -f "$dir/Preferences" ]; then
    dirname=$(basename "$dir")
    name=$(jq -r '.profile.name' "$dir/Preferences" 2>/dev/null)
    email=$(jq -r '.account_info[0].email' "$dir/Preferences" 2>/dev/null)
    # Fallback if email is null or not found
    if [ "$email" = "null" ] || [ -z "$email" ]; then
        email=$(grep -oP '"email":"\K[^"]+' "$dir/Preferences" | head -1)
    fi
    PROFILES+=("$dirname" "$name ($email)")
  fi
done

if [ ${#PROFILES[@]} -eq 0 ]; then
  echo "No Chrome profiles found in $CHROME_CONFIG"
  exit 1
fi

echo "Available Chrome Profiles:"
for ((i=0; i<${#PROFILES[@]}; i+=2)); do
  echo "$((i/2 + 1))) ${PROFILES[i+1]} [Folder: ${PROFILES[i]}]"
done

read -p "Select a profile (1-$(( ${#PROFILES[@]} / 2 ))): " choice

if [[ "$choice" =~ ^[0-9]+$ ]] && [ "$choice" -ge 1 ] && [ "$choice" -le $(( ${#PROFILES[@]} / 2 )) ]; then
  idx=$(( (choice - 1) * 2 ))
  selected_dir="${PROFILES[idx]}"
  echo "Opening Chrome with profile: $selected_dir"
  google-chrome --profile-directory="$selected_dir" &
else
  echo "Invalid selection."
  exit 1
fi
