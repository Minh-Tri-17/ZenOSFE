import { inject, Injectable, signal } from '@angular/core';
import { LoginUseCase } from '../../use-cases/auth/login.usecase';
import { AuthModel } from '../../domain/auth/models/auth.model';
import { MailModel } from '../../core/models/mail.model';
import { SendOTPUseCase } from '../../use-cases/auth/send-otp.usecase';
import { ResetPassUseCase } from '../../use-cases/auth/reset-pass.usecase';

export type ActiveFormType = 'login' | 'otp' | 'reset';

@Injectable({
  providedIn: 'root',
})
export class AccountFacade {
  private readonly loginUC = inject(LoginUseCase);
  private readonly sendOtpUC = inject(SendOTPUseCase);
  private readonly resetUC = inject(ResetPassUseCase);

  //#region //@ STATE

  readonly activeForm = signal<ActiveFormType>('login');

  //#endregion

  //#region //@ METHODS

  login(data: AuthModel) {
    return this.loginUC.execute(data);
  }

  sendOtp(data: MailModel) {
    return this.sendOtpUC.execute(data);
  }

  reset(data: AuthModel) {
    return this.resetUC.execute(data);
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
