# Angular Code Modernization & Refactoring Skill

This file serves as a system instruction/skill for the AI agent to convert legacy Angular structures into modern, reactive Angular 21/22+ syntax.

---

## 1. Objective
To maintain high performance, ease of testing, and consistency with the modern codebase standards, the AI agent **must** refactor legacy code blocks or files (e.g., provided by the user or found in the codebase) to use the latest Angular features.

---

## 2. Refactoring Mapping Guide

### 1. From NgModule-Based to Standalone
* **Legacy**: Components declared in `declarations` of an `@NgModule`.
* **Modern**: Set `standalone: true` on `@Component`, and move required components, directives (like `CommonModule`, `RouterOutlet`, custom widgets) directly into the `imports` array of the `@Component` metadata:
  ```typescript
  // Modern
  @Component({
    selector: 'app-user-profile',
    standalone: true, // Default in newer versions, but keep imports array explicit
    imports: [CommonModule, UserAvatarComponent],
    templateUrl: './user-profile.html'
  })
  export class UserProfile {}
  ```

### 2. From Constructor Injection to `inject()`
* **Legacy**: Declaring dependency injections inside the class `constructor(...)`.
* **Modern**: Injected properties should use the functional `inject()` API at the class level:
  ```typescript
  // Legacy
  constructor(private authService: AuthService) {}

  // Modern (Preferred)
  private readonly authService = inject(AuthService);
  ```

### 3. From Decorator-based Inputs/Outputs to Signal-based API
* **Legacy**: `@Input()`, `@Output()`, `@Input() nameChange = new EventEmitter()`.
* **Modern**: Use signal-based `input()`, `model()`, and `output()` functions:
  ```typescript
  // Legacy
  @Input() userId!: string;
  @Input() theme: string = 'dark';
  @Output() closed = new EventEmitter<void>();

  // Modern
  userId = input.required<string>(); // Read-only signal input
  theme = input<string>('dark');     // Read-only signal input with default
  closed = output<void>();           // Modern output emitter
  ```
* **Two-Way Binding**: Use `model()` to replace manual property/event emitter pairings:
  ```typescript
  // Legacy
  @Input() value: number = 0;
  @Output() valueChange = new EventEmitter<number>();

  // Modern
  value = model<number>(0); // Two-way binding signal
  ```

### 4. From Traditional View Queries to Signal Queries
* **Legacy**: `@ViewChild('chart') chart!: ElementRef;` or `@ViewChildren(Item) items!: QueryList<Item>;`.
* **Modern**: Use signal queries:
  ```typescript
  // Modern
  chart = viewChild<ElementRef>('chart'); // returns Signal<ElementRef | undefined>
  items = viewChildren(Item);            // returns Signal<ReadonlyArray<Item>>
  ```

### 5. From Template Directives (`*ngIf`, `*ngFor`) to Block Control Flow
* **Legacy**: Angular structural directives (`*ngIf`, `*ngFor`, `*ngSwitch`).
* **Modern**: Convert template code to the modern block syntax:
  ```angular-html
  <!-- Legacy -->
  <div *ngIf="user; else guestTemplate">
    <div *ngFor="let role of user.roles; trackBy: trackByFn">
      {{ role }}
    </div>
  </div>
  <ng-template #guestTemplate>Please login.</ng-template>

  <!-- Modern -->
  @if (user()) {
    @for (role of user().roles; track role.id) {
      <div>{{ role.name }}</div>
    }
  } @else {
    Please login.
  }
  ```

### 6. From Local RxJS State to Signals
* **Legacy**: Managing UI state via `BehaviorSubject` and rendering with the `async` pipe in templates.
* **Modern**: Use `signal()` and `computed()` for UI state. Only use RxJS for asynchronous event stream handling (HTTP, WebSockets, Debouncing) and convert it to Signals at the component level:
  ```typescript
  // Legacy
  readonly data$ = new BehaviorSubject<string[]>([]);
  
  // Modern
  readonly data = signal<string[]>([]);
  readonly itemCount = computed(() => this.data().length);
  ```

---

## 3. Execution Process
1. **Analyze input code**: Identify decorators (`@Input`, `@Output`, `@ViewChild`), constructors, structural template directives, and local RxJS state management.
2. **Rewrite typescript block**: Apply modern Angular typescript conventions (`inject`, `signal`, `input()`, `model()`, `output()`).
3. **Rewrite template block**: Replace structural directives with `@if`, `@for`, `@switch` control blocks.
4. **Compile check**: Ensure that typescript properties are accessed as signals (e.g. `mySignal()` instead of `mySignal` value).
