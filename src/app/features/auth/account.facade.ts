import { inject, Injectable, signal } from '@angular/core';
import { LoginAccountUseCase } from '../../use-cases/auth/login-account.usecase';
import { AuthModel } from '../../domain/auth/models/auth.model';

export type ActiveFormType = 'login' | 'otp' | 'reset';

@Injectable({
  providedIn: 'root',
})
export class AccountFacade {
  private readonly loginUC = inject(LoginAccountUseCase);

  //#region //@ STATE

  readonly activeForm = signal<ActiveFormType>('login');

  //#endregion

  //#region //@ METHODS

  login(data: AuthModel) {
    return this.loginUC.execute(data);
  }

  showLogin() {
    this.activeForm.set('login');
  }

  showOtp() {
    this.activeForm.set('otp');
  }

  showReset() {
    this.activeForm.set('reset');
  }

  //#endregion
}
