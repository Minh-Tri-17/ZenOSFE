import { Component, inject, signal, computed } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { AccountFacade } from '../account.facade';
import { FormValidationService } from '../../../core/services/form-validation.service';

@Component({
  selector: 'app-reset-form',
  imports: [],
  templateUrl: './reset-form.html',
  styleUrl: './reset-form.scss',
})
export class ResetForm {
  private authService = inject(AuthService);
  private facade = inject(AccountFacade);
  private validationService = inject(FormValidationService);

  //#region //@ STATE

  wasValidated = signal<boolean>(false);
  isActiveForm = computed(() => this.facade.activeForm() === 'reset');

  //#endregion

  //#region //@ METHODS

  handleBackToLogin(event: Event) {
    event.preventDefault();
    this.facade.showLogin();
  }

  //#endregion
}
