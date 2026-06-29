# Workspace Scanning & Directory Verification Skill

This file serves as a system instruction/skill for the AI agent to prevent file duplication and ensure all new resources are placed in their proper Clean Architecture layer.

---

## 1. Objective
To prevent duplicate files, misaligned folder structures, and violations of the Clean Architecture layers, the AI agent **must** perform a thorough check of the existing workspace structure before creating any new components, modules, files, or folders.

---

## 2. Verification Guidelines

### Step 1: Pre-Creation Workspace Search
Before creating a new file, class, interface, component, service, or use case:
1. **Search for Existing Entities**: Search the project directory (specifically `src/app/`) for any files containing similar names, functionalities, or terms (e.g., if asked to create a `process` component, search for `process` to see if a process list, item, or container already exists).
2. **Directory Listing**: Use the directory listing tools (`list_dir` or file searches) on the target subdirectory to inspect the surrounding context. Do not assume a folder is empty or that a file does not exist.

### Step 2: Clean Architecture Layer Validation
Confirm that the file is being placed in the correct directory as defined in the **AI Development Context & Role Guide** ([ai-context.md](file:///d:/Backup/Source%20code/ZenOSProject/ZenOSFrontend/ZenOSFEv1/ZenOSFE/.agent/context/ai-context.md)):

| Target File Type | Target Layer Directory | Architectural Rule |
| :--- | :--- | :--- |
| Core Interfaces, Entities, Domain Services | `src/app/domain/` | Pure TS/JS, zero framework dependencies (No `@angular/core`, no `inject`). |
| Application Use Cases, Orchestrators | `src/app/application/` | App-specific logic, coordinates domain logic. No framework adapters or UI bindings. |
| HTTP Clients, Adapters, Storage Repositories | `src/app/infrastructure/` | Implements domain repository interfaces, utilizes Angular `HttpClient` or browser APIs. |
| Standalone Components, Directives, Pipes, Routing | `src/app/presentation/` | UI layer. Receives data via signals/inputs, renders views using modern Angular syntax. |

* **CRITICAL**: Never create presentation folders (e.g., `components/`, `views/`, `styles/`) inside `domain/` or `application/`.

### Step 3: Naming & Duplication Check
* Do not create classes with duplicate names (e.g., `ProcessModel` vs `ProcessEntity` unless they have distinct, well-documented architectural roles).
* If a component or service exists that can be modified or extended, prefer refactoring/extending it over creating a new file.

---

## 3. Workflow Example
When asked to *"Create a service to manage processes"*:
1. **Action**: Run a search for `process` across the codebase.
2. **Analysis**:
   - If `src/app/domain/process.repository.ts` exists, do not recreate the process interface.
   - If `src/app/infrastructure/http-process.repository.ts` exists, implement the new service method inside it rather than creating a new `process-api.service.ts`.
3. **Execution**: Place the new logic/file strictly within its designated folder, confirming that dependencies import from the correct layers (outer layers import from inner layers; inner layers like `domain` never import from `presentation` or `infrastructure`).
