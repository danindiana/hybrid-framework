# 📖 How-To Guide: Codebase Indexing & Visualization

This guide explains step-by-step how to index codebases using Graphify and serve the interactive network visualizer.

---

## 1. Quick Start (Using the Onboarding Wizard)
We created a CLI wizard to automate the entire process (checks, ignores, indexing, clustering, and web serving) in a single workflow.

### To Run the Wizard:
1. Open a terminal and run the script:
   ```bash
   ./graphify_wizard.py
   ```
2. **Interactive Prompts**:
   * **Target Directory**: Specify the codebase folder you want to index (default is current directory).
   * **Optimized Ignores**: Press `Enter` to write/overwrite `.graphifyignore` with configurations that skip documentation and massive dependency directories (avoids segfaults and LLM key requirements).
   * **Hosting**: Press `Enter` to host it on the LAN. It will scan for occupied ports and spin up a Python web server automatically.

---

## 2. Manual Indexing Step-by-Step

If you prefer to run the commands manually, use the following steps:

### Step 2.1: Configure Ignores
Create a `.graphifyignore` file in the root of the codebase you want to index. Copy the optimized ignore rules to bypass LLM checks (code-only mode) and large subfolders:
```text
*.[sS][vV][gG]
*.[pP][nN][gG]
*.[jJ][pP][gG]
*.[pP][dD][fF]
*.[mM][dD]
*.[tT][xX][tT]

# Exclude massive folders (avoids memory OOM / python segfaults)
ai-agent-architectures/
openclaw-fresh/
venv/
```

### Step 2.2: Extract AST Code Graph
Run the extraction command using the Graphify virtual environment python package. Cap workers to `4` for memory stability:
```bash
/home/jeb/programs/gemini_cli_workspace/session_20260607_163152/graphify/.venv/bin/graphify extract /path/to/codebase --max-workers 4
```
*Outputs generated: `graphify-out/graph.json` and `graphify-out/.graphify_analysis.json`*

### Step 2.3: Generate HTML Map
Perform community clustering and render the standalone visualizer:
```bash
/home/jeb/programs/gemini_cli_workspace/session_20260607_163152/graphify/.venv/bin/graphify cluster-only /path/to/codebase
```
*Outputs generated: `graphify-out/graph.html` and `graphify-out/GRAPH_REPORT.md`*

---

## 3. Host the Graph Visualizer
To serve the generated `graph.html` across your local network:

1. Start a python web server serving the `graphify-out` directory:
   ```bash
   python3 -m http.server 7686 --directory /path/to/codebase/graphify-out
   ```
2. Open your web browser on any machine and go to:
   ```url
   http://worlock:7686/graph.html
   ```

---

## 4. Troubleshooting Large Graphs
If your codebase has over 5,000 nodes, Graphify will skip building `graph.html` by default to protect browser performance.

### Option A: Force Render (Warning: Can lag the browser)
Override the default limit using the `GRAPHIFY_VIZ_NODE_LIMIT` environment variable:
```bash
export GRAPHIFY_VIZ_NODE_LIMIT=30000
/home/jeb/programs/gemini_cli_workspace/session_20260607_163152/graphify/.venv/bin/graphify cluster-only /path/to/codebase
```

### Option B: Build Aggregated Community View (Recommended for 10k+ nodes)
Use `export html` with a low `--node-limit`. This groups files into interactive community meta-nodes:
```bash
/home/jeb/programs/gemini_cli_workspace/session_20260607_163152/graphify/.venv/bin/graphify export html --graph /path/to/codebase/graphify-out/graph.json --node-limit 2000
```
