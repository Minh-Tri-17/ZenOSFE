# Dependency & Data Flow Analysis Skill

This file serves as a system instruction/skill for the AI agent to trace file imports, dependencies, and reactive state flows across components and services.

---

## 1. Objective
To maintain code sanity and ensure correct state propagation, the AI agent **must** analyze the import statements, dependency injections, and reactive streams (Signals/RxJS) of any target file before editing it or designing new modules.

---

## 2. Analysis Methodology

### Step 1: Trace Imports & File Dependencies
When analyzing a file (e.g., a component or service):
1. **Examine Header Imports**: Read the `import` statements to find out where the dependencies reside. Follow local file paths (e.g., `import { ProcessUseCase } from '../../application/process.usecase'`).
2. **Read Dependency Source Code**: If the file imports internal classes or services, proactively read those imported files as well. Do not guess their methods, properties, or signal signatures.

### Step 2: Resolve Dependency Injections
Identify what is injected and how it is used:
* Locate all occurrences of the functional `inject()` API or constructor injection (e.g., `private readonly authUseCase = inject(AuthenticateUseCase)`).
* Map the interactions between the host class and the injected dependencies (e.g., identifying that the Component calls `this.authUseCase.login(...)`).

### Step 3: Analyze Reactive State Propagation (Signals & RxJS)
Trace how data travels and triggers UI updates:
1. **Identify Inputs & Models**: Trace Signal inputs (`input()`, `input.required()`) and Two-Way Bindings (`model()`).
2. **Trace State Providers**: Locate the source of state (e.g., is it a local `signal()`, a computed state `computed()`, or a service-level Signal?).
3. **Trace Effects & Subscribers**: Locate where `effect()` or RxJS `.subscribe()` are utilized to identify side effects.
4. **Draw Dependency Chains**: Trace the reactivity chain:
   * *Example*: `User clicks button` ➔ `calls presentation component method` ➔ `triggers application use case` ➔ `updates infrastructure state signal` ➔ `triggers presentation computed signal` ➔ `updates DOM`.

### Step 4: Validate Architectural Boundaries
Confirm that imports do not violate boundary rules:
* Components (`presentation`) can import from `application` and `domain`.
* Services (`infrastructure` / `application`) can import from `domain`.
* Entities/Services (`domain`) **must not** import from `application`, `infrastructure`, or `presentation`.

---

## 3. Workflow Checklist
Before proposing code modifications:
- [ ] Read the target file's imports.
- [ ] View any internal imported files that are directly modified or read by the target file.
- [ ] List all injected services and check which methods/signals they expose.
- [ ] Verify the import direction satisfies the Clean Architecture dependency rule (outer layers point inward).
