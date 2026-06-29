# Agent Skill Coordination & Routing Guide

This coordinator file directs the AI agent to select, sequence, and combine the appropriate skills from the `.agent/skills/` directory for any incoming user request. 

---

## 1. Skill Registry

The workspace contains specialized skills grouped by functionality:
*   **Core Skills (`core/`)**
    *   [`logging.md`](file:///d:/Backup/Source%20code/ZenOSProject/ZenOSFrontend/ZenOSFEv1/ZenOSFE/.agent/skills/core/logging.md): Handles token usage logging (`token_usage.json`) and Chain-of-Thought logs (`agent_execution.log`). **(Universal execution)**
    *   [`component-creation.md`](file:///d:/Backup/Source%20code/ZenOSProject/ZenOSFrontend/ZenOSFEv1/ZenOSFE/.agent/skills/core/component-creation.md): Standardized component generation using `ng g c <path> --skip-tests` (skeletal-only constraint).
*   **Analysis Skills (`analysis/`)**
    *   [`workspace-scanning.md`](file:///d:/Backup/Source%20code/ZenOSProject/ZenOSFrontend/ZenOSFEv1/ZenOSFE/.agent/skills/analysis/workspace-scanning.md): Searches for existing entities and validates Clean Architecture folder alignment.
    *   [`dependency-analysis.md`](file:///d:/Backup/Source%20code/ZenOSProject/ZenOSFrontend/ZenOSFEv1/ZenOSFE/.agent/skills/analysis/dependency-analysis.md): Traces reactive states (Signals/RxJS), injections, and import boundaries.
*   **Refactoring Skills (`refactoring/`)**
    *   [`code-modernization.md`](file:///d:/Backup/Source%20code/ZenOSProject/ZenOSFrontend/ZenOSFEv1/ZenOSFE/.agent/skills/refactoring/code-modernization.md): Converts legacy syntax to standalone, signals, functional injections, and block control flow.
*   **Testing Skills (`testing/`)**
    *   [`unit-test-generation.md`](file:///d:/Backup/Source%20code/ZenOSProject/ZenOSFrontend/ZenOSFEv1/ZenOSFE/.agent/skills/testing/unit-test-generation.md): Writes unit tests (`.spec.ts`) using Vitest and Angular TestBed.

---

## 2. Request Routing Matrix

| User Intent / Request Type | Primary Skills | Secondary Skills | Execution Order |
| :--- | :--- | :--- | :--- |
| **Create new components/modules** | `workspace-scanning.md` | `component-creation.md` | 1. Scan ➔ 2. Create ➔ 3. Log |
| **Refactor/modernize legacy code** | `code-modernization.md` | `dependency-analysis.md` | 1. Trace ➔ 2. Modernize ➔ 3. Log |
| **Write unit tests (`.spec.ts`)** | `unit-test-generation.md` | `dependency-analysis.md` | 1. Trace ➔ 2. Generate Spec ➔ 3. Log |
| **Debug reactive flow / state issues**| `dependency-analysis.md` | `workspace-scanning.md` | 1. Scan ➔ 2. Trace ➔ 3. Log |
| **Any request (Universal Log)** | `logging.md` | *None* | Runs throughout and at end of each turn |

---

## 3. Sequence Workflows

### Scenario A: Creating New Code / Components
*Use this workflow when the user requests a new feature, page, dialog, or UI element.*
1. **Pre-Check**: Invoke [`workspace-scanning.md`](file:///d:/Backup/Source%20code/ZenOSProject/ZenOSFrontend/ZenOSFEv1/ZenOSFE/.agent/skills/analysis/workspace-scanning.md) to search the workspace. Ensure a similar file doesn't already exist. Identify the target folder under Clean Architecture rules (e.g., `presentation/` for components).
2. **Boilerplate Creation**: Use [`component-creation.md`](file:///d:/Backup/Source%20code/ZenOSProject/ZenOSFrontend/ZenOSFEv1/ZenOSFE/.agent/skills/core/component-creation.md) to trigger Angular CLI. Generate only the default structure. Do not code logic/UI ahead of user prompts.
3. **Execution Logging**: Keep execution logs updated continuously, and record token costs via [`logging.md`](file:///d:/Backup/Source%20code/ZenOSProject/ZenOSFrontend/ZenOSFEv1/ZenOSFE/.agent/skills/core/logging.md).

### Scenario B: Refactoring to Modern Angular (Signals / Standalone)
*Use this workflow when upgrading existing elements or components.*
1. **Dependency Check**: Apply [`dependency-analysis.md`](file:///d:/Backup/Source%20code/ZenOSProject/ZenOSFrontend/ZenOSFEv1/ZenOSFE/.agent/skills/analysis/dependency-analysis.md) to trace the inputs, outputs, view queries, and reactive data flow (Signals, RxJS) of the component.
2. **Modernization Rewrite**: Follow the detailed mapping in [`code-modernization.md`](file:///d:/Backup/Source%20code/ZenOSProject/ZenOSFrontend/ZenOSFEv1/ZenOSFE/.agent/skills/refactoring/code-modernization.md) to replace legacy decorators (`@Input`, `@Output`, `@ViewChild`), constructor injection (`inject()`), and template blocks (`*ngIf`, `*ngFor`).
3. **Compile Verification**: Verify dependencies compile properly and imports follow the Clean Architecture boundary layer rules.
4. **Log Results**: Log all steps and costs via [`logging.md`](file:///d:/Backup/Source%20code/ZenOSProject/ZenOSFrontend/ZenOSFEv1/ZenOSFE/.agent/skills/core/logging.md).

### Scenario C: Generating Unit Tests (`.spec.ts`)
*Use this workflow when adding test coverage to services, pipes, or components.*
1. **Trace Interface**: Invoke [`dependency-analysis.md`](file:///d:/Backup/Source%20code/ZenOSProject/ZenOSFrontend/ZenOSFEv1/ZenOSFE/.agent/skills/analysis/dependency-analysis.md) to understand dependencies, injected services, and inputs/outputs.
2. **Test Construction**: Follow [`unit-test-generation.md`](file:///d:/Backup/Source%20code/ZenOSProject/ZenOSFrontend/ZenOSFEv1/ZenOSFE/.agent/skills/testing/unit-test-generation.md). Use Vitest for assertions/spies and Angular `TestBed` for standalone compile settings. Set inputs via `fixture.componentRef.setInput` and mock services injected via functional `inject()`.
3. **Log Execution**: Record session metadata using [`logging.md`](file:///d:/Backup/Source%20code/ZenOSProject/ZenOSFrontend/ZenOSFEv1/ZenOSFE/.agent/skills/core/logging.md).

---

## 4. Multi-Skill Coordination Pipeline
For complex features requiring multiple steps (e.g., *“Create a process service, its component, and write unit tests for them”*):
1. Use **[`workspace-scanning.md`](file:///d:/Backup/Source%20code/ZenOSProject/ZenOSFrontend/ZenOSFEv1/ZenOSFE/.agent/skills/analysis/workspace-scanning.md)** to check for existing domain repositories and infrastructure services.
2. Write infrastructure/domain/application files first (dependencies go first).
3. Create the UI presentation skeleton using **[`component-creation.md`](file:///d:/Backup/Source%20code/ZenOSProject/ZenOSFrontend/ZenOSFEv1/ZenOSFE/.agent/skills/core/component-creation.md)**.
4. Tie them together using the import/reactive rules from **[`dependency-analysis.md`](file:///d:/Backup/Source%20code/ZenOSProject/ZenOSFrontend/ZenOSFEv1/ZenOSFE/.agent/skills/analysis/dependency-analysis.md)**.
5. Create Vitest suites following **[`unit-test-generation.md`](file:///d:/Backup/Source%20code/ZenOSProject/ZenOSFrontend/ZenOSFEv1/ZenOSFE/.agent/skills/testing/unit-test-generation.md)**.
6. Always append details to logs continuously using **[`logging.md`](file:///d:/Backup/Source%20code/ZenOSProject/ZenOSFrontend/ZenOSFEv1/ZenOSFE/.agent/skills/core/logging.md)**.
