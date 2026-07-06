import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AccountFacade } from '../../account.facade';
import { AuthService } from '../../../../core/services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthFields, AuthModel } from '../../../../domain/auth/models/auth.model';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private router = inject(Router);
  private authService = inject(AuthService);
  private facade = inject(AccountFacade);

  //#region //@ STATE

  loginForm = new FormGroup({
    userName: new FormControl<string>('', [Validators.required]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(6)]),
  });

  wasValidated = signal<boolean>(false);

  getErrors(controlName: keyof typeof this.loginForm.controls): string[] {
    const control = this.loginForm.controls[controlName];
    if (!control) return [];

    const errors: string[] = [];
    const labelMap: Record<string, string> = AuthFields;
    const displayName = labelMap[controlName] || String(controlName);

    if (control.hasError('required')) {
      errors.push(`Please enter your ${displayName}.`);
    }
    if (control.hasError('minlength')) {
      const requiredLength = control.getError('minlength')?.requiredLength;
      errors.push(
        `${displayName.charAt(0).toUpperCase() + displayName.slice(1)} must be at least ${requiredLength} characters.`,
      );
    }
    return errors;
  }

  //#endregion

  constructor() {
    this.loginForm.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.wasValidated.set(false);
    });
  }

  //#region //@ OUTPUTS

  //#endregion

  //#region //@ METHODS

  async handleLogin() {
    this.wasValidated.set(true);

    if (this.loginForm.invalid) return;

    const item = this.loginForm.getRawValue() as AuthModel;
    const res = await this.facade.login(item);

    this.authService.setToken(res?.result || '');

    if (this.authService.isLoggedIn()) this.router.navigate(['/country']);
  }
}
