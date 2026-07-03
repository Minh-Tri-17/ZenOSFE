import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AccountFacade } from '../../account.facade';
import { AuthService } from '../../../../core/services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthModel } from '../../../../domain/auth/models/auth.model';
import { validate } from '@angular/forms/signals';

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
    password: new FormControl<string>('', [Validators.required]),
  });

  wasValidated = signal<boolean>(false);

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
