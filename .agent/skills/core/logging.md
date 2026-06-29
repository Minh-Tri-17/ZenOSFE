# Agent Logging and Cost Control Instructions

This file serves as a system instruction/skill for the AI agent to track model costs and log execution progress (Chain of Thought).

---

## 1. Objective
To maintain auditability, transparency, and cost control, the AI agent **must** create, update, and maintain two log files in the `.agent/logs/` directory during and at the end of each session.

---

## 2. Log Files Details

### File 1: Token Usage Tracker (`.agent/logs/token_usage.json`)
* **Purpose**: Track the number of input, output, and total tokens used during each turn/session to manage API cost.
* **Format**: JSON array of session logs.
* **Structure Example**:
  ```json
  [
    {
      "session_id": "bb9467a8-f236-4c35-a3e1-745f904efb5a",
      "timestamp": "2026-06-13T22:07:05+07:00",
      "model_name": "Gemini 3.5 Flash (Medium)",
      "input_tokens": 15200,
      "output_tokens": 1200,
      "total_tokens": 16400,
      "estimated_cost_usd": 0.0035
    }
  ]
  ```
* **Execution Rule**: Estimate or read token counts from metadata or execution details, append the usage to this JSON file at the end of each user request turn.

### File 2: Agent Execution Log (`.agent/logs/agent_execution.log`)
* **Purpose**: Keep a chronological Chain-of-Thought (CoT) log tracking the agent's decision-making process, tool invocations, and tool outputs.
* **Format**: Line-based plain text log (`.log`), partitioned/grouped by date.
* **Format Example**:
  ```log
  === 2026-06-13 ===
  [22:07:05Z] [INFO] Agent started processing request: "Create logging skill"
  [22:07:06Z] [DECISION] Agent decides to list directory .agent/skills to check existing skills
  [22:07:10Z] [RESULT] Directory .agent/skills is empty
  [22:07:11Z] [DECISION] Agent decides to create skill file logging.md
  [22:07:15Z] [RESULT] File logging.md created successfully
  [22:07:20Z] [INFO] Agent finished processing request successfully
  ```
* **Execution Rule**: Partition/group log entries by date for ease of tracking. Write a daily header line like `=== YYYY-MM-DD ===` before appending log lines for that date (or when the date shifts). Omit the date prefix from the timestamp (e.g., `[HH:MM:SSZ]`) for individual log lines under the header. Record each step, decision (e.g., "Agent decides to call skill A"), and tool execution result (e.g., "Skill A returned result B") into this file incrementally.

---

## 3. Workflow Implementation
1. **At Startup**: Check if `.agent/logs/` directory exists. If not, create it.
2. **During Task Execution**: For each step, write a log entry in `agent_execution.log` detailing the current decision, tool choice, and result.
3. **Before Turn Completion**: Read existing logs (if any), calculate/estimate the tokens spent in the current request, append a new session record to `token_usage.json`, and write the final execution status in `agent_execution.log`.
