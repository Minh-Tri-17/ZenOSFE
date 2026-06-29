# Unit Test Generation Skill (.spec.ts)

This file serves as a system instruction/skill for the AI agent to analyze Angular components or services and automatically generate corresponding unit test files (`.spec.ts`) using Vitest and TestBed.

---

## 1. Objective
To maintain high code quality and test coverage, the AI agent **must** be able to analyze any component, pipe, directive, or service in the presentation, infrastructure, application, or domain layers and output a comprehensive `.spec.ts` unit test file.

---

## 2. Test Setup & Architecture Guidelines

### General Guidelines
* **Location**: Place the test file in the exact same directory as the component or service being tested.
* **Naming**: Name the file `<target-name>.spec.ts` (e.g., `process-list.ts` -> `process-list.spec.ts`).
* **Test Runner**: The project uses **Vitest**. Test blocks utilize standard global functions (`describe`, `beforeEach`, `it`, `expect`).

### Testing Components (Presentation Layer)
Use Angular `TestBed` to compile components and verify template rendering.

1. **Standalone Imports**: Declare components under test inside the `imports` array of `TestBed.configureTestingModule`, not `declarations`.
2. **Mocking Dependencies**: For use cases or services injected via `inject()`, mock them in the testing module configuration:
   ```typescript
   const mockProcessUseCase = {
     getProcesses: vi.fn().mockReturnValue(signal([])) // Mocking using Vitest mock (vi)
   };

   await TestBed.configureTestingModule({
     imports: [ProcessComponent],
     providers: [
       { provide: GetProcessesUseCase, useValue: mockProcessUseCase }
     ]
   }).compileComponents();
   ```
3. **Testing Signal Inputs**:
   Set values on modern signal inputs (`input()`, `model()`) via `fixture.componentRef.setInput()`:
   ```typescript
   it('should react to input changes', () => {
     const fixture = TestBed.createComponent(ProcessComponent);
     fixture.componentRef.setInput('processId', '123-abc');
     fixture.detectChanges();
     
     expect(fixture.componentInstance.processId()).toBe('123-abc');
   });
   ```
4. **Testing Signal Outputs**:
   Subscribe to outputs (`output()`) to assert event emissions:
   ```typescript
   it('should emit select event', () => {
     const fixture = TestBed.createComponent(ProcessComponent);
     let emittedData: any;
     
     // Modern output subscribe pattern
     fixture.componentInstance.select.subscribe(data => emittedData = data);
     
     fixture.componentInstance.triggerSelect();
     expect(emittedData).toEqual({ id: '123' });
   });
   ```

### Testing Services & Use Cases (Infrastructure / Application)
Services can often be tested as pure TypeScript classes without importing `TestBed`, unless they inject core Angular utilities like `HttpClient`.

* **Pure Class Test (No TestBed)**:
  ```typescript
  describe('GetProcessesUseCase', () => {
    it('should return process list', () => {
      const mockRepo: ProcessRepository = {
        fetch: () => of([{ id: '1', name: 'System' }])
      };
      const useCase = new GetProcessesUseCase(mockRepo);
      // Assert useCase behavior...
    });
  });
  ```
* **TestBed for HttpClient**:
  ```typescript
  import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
  import { provideHttpClient } from '@angular/common/http';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpProcessRepository,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
  });
  ```

---

## 3. Step-by-Step Generator Process
1. **Analyze Component/Service code**: Identify imports, outputs, inputs, internal signals, lifecycle hooks (`ngOnInit`, `ngOnDestroy`), and public methods.
2. **Determine Injected Providers**: Identify dependencies and prepare mocks. Use `vi.fn()` for method spy assertions if testing event triggers.
3. **Write basic suite**: 
   - Add a creation test: `expect(component).toBeTruthy()`.
   - Check default states of components and services.
4. **Write functional tests**:
   - Write tests for key public methods.
   - Verify state updates (signals, computation, template text changes).
   - Use `await fixture.whenStable()` or `fixture.detectChanges()` to verify asynchronous state changes and template updates.
