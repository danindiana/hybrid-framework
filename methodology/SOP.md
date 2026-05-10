# Hybrid Development Standard Operating Procedure (SOP)

## Phase 1: Semantic Grounding (Human-led)
1.  **Objective Definition:** State the high-level goal in natural language.
2.  **Constraint Mapping:** Identify non-negotiable boundaries (hardware, security, cost).
3.  **Axiom Selection:** Choose the base technologies and languages for the session.

## Phase 2: Formal Decomposition (AI-led)
1.  **Draft Implementation:** AI generates the first functional pass.
2.  **Syntax Verification:** AI runs linters, compilers, and internal logic checks.
3.  **Token Forensic Check:** Analyze performance metrics via `tools/forensic_run.sh`.

## Phase 3: The Alignment Check (Hybrid)
1.  **Drift Detection:** Does the current code solve the "Why" or just the "How"?
2.  **Aesthetic Pruning:** Human reviews the code for simplicity and maintenance "elegance".
3.  **The Meta-Leap:** If the system is stuck (Gödelian limit), the Human initiates an "Axiom Shift" (Refactor).

## Phase 4: Finalization & Commit
1.  **Documentation:** Update the session log with any "transfinite leaps" made.
2.  **Visual Update:** If architecture changed, update the `.dot` diagrams.
3.  **Sync:** Push changes to the repository.
