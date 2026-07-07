import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AccountFacade } from '../../account.facade';
import { AuthService } from '../../../../core/services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthModel } from '../../../../domain/auth/models/auth.model';
import { FormValidationService } from '../../../../core/services/form-validation.service';

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
  private validationService = inject(FormValidationService);

  //#region //@ STATE

  loginForm = new FormGroup({
    username: new FormControl(),
    password: new FormControl(),
  });

  wasValidated = signal<boolean>(false);

  //#endregion

  //#region //@ METHODS

  constructor() {
    this.loginForm.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.wasValidated.set(false);
      this.validationService.clearServerErrors(this.loginForm);
    });
  }

  async handleLogin() {
    this.wasValidated.set(true);

    if (this.loginForm.invalid) return;

    const rawValues = this.loginForm.getRawValue() as AuthModel;
    const item: AuthModel = {
      username: rawValues.username?.trim() || null,
      password: rawValues.password?.trim() || null,
    };

    try {
      const res = await this.facade.login(item);

      this.authService.setToken(res?.result || '');

      if (this.authService.isLoggedIn()) this.router.navigate(['/country']);
    } catch (error: any) {
      this.validationService.mapServerValidationErrors(error, this.loginForm);
    }
  }

  getErrors(controlName: keyof typeof this.loginForm.controls): string[] {
    return this.validationService.getServerErrors(this.loginForm, controlName);
  }

  //#endregion
}
