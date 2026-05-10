import sys
import json
import subprocess

def query_ollama(model, prompt):
    """Simple wrapper for Ollama generate API."""
    try:
        cmd = [
            "curl", "-s", "http://localhost:11434/api/generate",
            "-d", json.dumps({"model": model, "prompt": prompt, "stream": False})
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)
        return json.loads(result.stdout).get("response", "")
    except Exception as e:
        return f"Error: {str(e)}"

def check_alignment(model, objective_path, implementation_path):
    print(f"--- Running Semantic Alignment Check using {model} ---")
    
    try:
        with open(objective_path, 'r') as f:
            objective = f.read()
        with open(implementation_path, 'r') as f:
            implementation = f.read()
    except FileNotFoundError as e:
        print(f"Error: {str(e)}")
        return

    prompt = f"""
    OBJECTIVE (The 'Why'):
    {objective}

    IMPLEMENTATION (The 'How'):
    {implementation}

    TASK:
    Analyze if the Implementation correctly aligns with the Objective. 
    1. Identify any 'Semantic Drift' (where the code does something technically correct but straying from the original intent).
    2. Rate the alignment from 0-100%.
    3. Provide one recommendation to improve synergy.

    Format as a brief report.
    """
    
    report = query_ollama(model, prompt)
    print(report)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 semantic_check.py <objective_file> <implementation_file> [model]")
    else:
        obj = sys.argv[1]
        imp = sys.argv[2]
        mod = sys.argv[3] if len(sys.argv) > 3 else "qwen2.5:3b"
        check_alignment(mod, obj, imp)
