# Chrome Profile Selection Session Summary - March 12, 2026

## Objective
The user wanted to open Google Chrome with the profile selection screen (Profile Picker) to select their **akomp.support** account.

## Key Actions Taken
1.  **Initial Attempt:** Tried opening Chrome with the `--profile-directory="Guest Profile"` flag, which is a common way to trigger the Profile Picker UI on Linux.
2.  **Investigation:** The user reported that the picker didn't show the `akomp.support` account. We investigated the Chrome configuration directory (`~/.config/google-chrome/`) to identify which folder corresponds to the `akomp.support` email.
3.  **Profile Identification:** 
    -   Found that **Profile 2** corresponds to `akomp.support@gmail.com`.
    -   Listed all available profiles and their associated emails:
        -   `Default`: granittwosilo@gmail.com
        -   `Profile 2`: akomp.support@gmail.com
        -   `Profile 4`: vqmaslow@gmail.com
        -   `Profile 5`: docs-hosted-app-own@google.com
        -   `Profile 6`: benjamin@alphasort.com
        -   `Profile 7`: ramichel81@gmail.com
4.  **Successful Launch:** Opened Google Chrome directly with `Profile 2` using:
    `google-chrome --profile-directory="Profile 2"`
5.  **Tool Creation:** Created a bash script (`choose_chrome_profile.sh`) to list and select Chrome profiles interactively.

## Recommendations
-   Use the `choose_chrome_profile.sh` script for easy profile switching.
-   Consider adding an alias to your `.bashrc` for the script:
    `alias chrome-pick='/home/jeb/programs/gemini_cli_workspace/chrome_management/choose_chrome_profile.sh'`

## How to Access from Anywhere (Cold-Start)
To use the Chrome profile selector from any directory (including `/home/jeb/`), you can set up a command or an alias:

### Option 1: Create a System Command (Recommended)
Since `/home/jeb/bin` is in your system `PATH`, you can create a symbolic link:
```bash
ln -s /home/jeb/programs/gemini_cli_workspace/chrome_management/choose_chrome_profile.sh /home/jeb/bin/chrome-pick
```
Then, simply type `chrome-pick` in any terminal.

### Option 2: Add a Shell Alias
Add this line to your `~/.bashrc` or `~/.zshrc`:
```bash
alias chrome-pick='/home/jeb/programs/gemini_cli_workspace/chrome_management/choose_chrome_profile.sh'
```
After adding, run `source ~/.bashrc` to activate it.

### Option 3: Use the Absolute Path
You can always run it directly without any setup:
```bash
~/programs/gemini_cli_workspace/chrome_management/choose_chrome_profile.sh
```
