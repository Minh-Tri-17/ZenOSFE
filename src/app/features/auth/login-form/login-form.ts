import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AccountFacade } from '../account.facade';
import { AuthService } from '../../../core/services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthModel } from '../../../domain/auth/models/auth.model';
import { FormValidationService } from '../../../core/services/form-validation.service';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {
  private router = inject(Router);
  private authService = inject(AuthService);
  private facade = inject(AccountFacade);
  private validationService = inject(FormValidationService);

  //#region //@ STATE

  loginForm = new FormGroup({
    username: new FormControl(),
    password: new FormControl(),
    remember: new FormControl<boolean>(false),
  });

  wasValidated = signal<boolean>(false);
  isActiveForm = computed(() => this.facade.activeForm() === 'login');

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

    //* getRawValue() lấy toàn bộ giá trị của form, kể cả ô bị disabled
    //* as ép kiểu sang model tương ứng
    const rawValues = this.loginForm.getRawValue() as AuthModel;

    //* gán || null để API có thể xử lý validate theo required.
    const item: AuthModel = {
      username: rawValues.username?.trim() || null,
      password: rawValues.password?.trim() || null,
      remember: rawValues.remember,
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

  handleForgot(event: Event) {
    event.preventDefault();
    this.facade.showOtp();
  }

  //#endregion
}
