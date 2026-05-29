# Antigravity CLI

The **Antigravity CLI** is a powerful command-line interface designed for modern development workflows, integrating traditional editor capabilities with advanced AI-driven features.

## Overview

Antigravity serves as the primary gateway to your development environment, allowing you to manage files, extensions, and AI interactions directly from the terminal. It is built on a robust foundation (likely derived from the VS Code/VSCodium ecosystem) but tailored for "liftoff"—rapid, agentic, and highly integrated development.

## Key Features

### 1. Editor & File Management
- **Open Files/Folders:** `antigravity <path>`
- **Diffing:** `antigravity --diff <file1> <file2>`
- **Merging:** Supports three-way merges with `--merge`.
- **New/Reused Windows:** Control how workspace instances are launched.

### 2. AI & Agentic Integration
- **Chat Mode:** `antigravity chat "Your prompt"` - Interact with AI directly in the context of your current directory.
- **Model Context Protocol (MCP):** Use `--add-mcp <json>` to add server definitions, enabling the editor to interact with external tools and data sources.

### 3. Extensions Management
- **Install/Uninstall:** Manage your toolset with `--install-extension` and `--uninstall-extension`.
- **Listing:** View installed extensions and their versions.

### 4. Remote & Web Development
- **Tunneling:** `antigravity tunnel` creates a secure connection to your environment.
- **Web UI:** `antigravity serve-web` launches a browser-based editor interface.

## Performance Optimization

Large workspaces with deep history (like those containing an `archive/` folder) can "clog" the Antigravity language servers and file watchers. To keep the CLI responsive, it is highly recommended to create a `.vscode/settings.json` file in your project root with exclusion rules:

```json
{
  "files.exclude": { "**/archive": true, "**/logs": true, "**/venv": true },
  "search.exclude": { "**/archive": true, "**/logs": true, "**/venv": true },
  "files.watcherExclude": { "**/archive/**": true, "**/logs/**": true, "**/venv/**": true }
}
```

## Shell Integration

Antigravity can enhance your terminal with rich integration features (such as current working directory tracking and command status indicators). To enable this, add the following to your shell profile (e.g., `~/.bashrc`):

```bash
# Antigravity Shell Integration
[[ -f $(antigravity --locate-shell-integration-path bash) ]] && source $(antigravity --locate-shell-integration-path bash)
```
*(Replace `bash` with `zsh`, `fish`, or `pwsh` as appropriate)*

## Common Commands

| Task | Command |
| :--- | :--- |
| Open current directory | `antigravity .` |
| Install an extension | `antigravity --install-extension <id>` |
| Start AI chat | `antigravity chat` |
| Add an MCP server | `antigravity --add-mcp '{"name":"my-server",...}'` |
| Check status | `antigravity --status` |

## Troubleshooting
Use `antigravity --help` for a full list of options or `antigravity --verbose` to diagnose issues.
