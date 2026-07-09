import { Component, inject, signal, computed } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { AccountFacade } from '../account.facade';
import { FormValidationService } from '../../../core/services/form-validation.service';

@Component({
  selector: 'app-otp-form',
  imports: [],
  templateUrl: './otp-form.html',
  styleUrl: './otp-form.scss',
})
export class OtpForm {
  private authService = inject(AuthService);
  private facade = inject(AccountFacade);
  private validationService = inject(FormValidationService);

  //#region //@ STATE

  wasValidated = signal<boolean>(false);
  isActiveForm = computed(() => this.facade.activeForm() === 'otp');

  //#endregion

  //#region //@ METHOD

  handleBackToLogin(event: Event) {
    event.preventDefault();
    this.facade.showLogin();
  }

  handleSendCode() {
    this.wasValidated.set(true);
    this.facade.showReset();
  }

  //#endregion
}
