import { Component, inject, signal, computed } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { AccountFacade } from '../account.facade';
import { FormValidationService } from '../../../core/services/form-validation.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthFields, AuthModel } from '../../../domain/auth/models/auth.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-reset-form',
  imports: [ReactiveFormsModule],
  templateUrl: './reset-form.html',
  styleUrl: './reset-form.scss',
})
export class ResetForm {
  private authService = inject(AuthService);
  private facade = inject(AccountFacade);
  private validationService = inject(FormValidationService);

  //#region //@ STATE

  resetForm = new FormGroup({
    username: new FormControl(),
    password: new FormControl(),
    phone: new FormControl(),
    email: new FormControl(),
    otp: new FormControl(),
  });

  wasValidated = signal<boolean>(false);
  isActiveForm = computed(() => this.facade.activeForm() === 'reset');

  //#endregion

  //#region //@ METHODS

  constructor() {
    //* subscribe() vào sự kiện thay đổi giá trị của form
    //* takeUntilDestroyed() để hủy subscription khi component bị hủy
    this.resetForm.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.wasValidated.set(false);
    });
  }

  async handleReset() {
    //* getRawValue() lấy toàn bộ giá trị của form, kể cả ô bị disabled
    //* as ép kiểu sang model tương ứng
    const rawValues = this.resetForm.getRawValue() as AuthModel;

    //* gán || null để API có thể xử lý validate theo required.
    const item: AuthModel = {
      username: rawValues.username?.trim() || null,
      password: rawValues.password?.trim() || null,
      phone: rawValues.phone?.trim() || null,
      email: rawValues.email?.trim() || null,
      otp: rawValues.otp?.trim() || null,
    };

    try {
      await this.facade.reset(item);

      this.facade.showLogin();
    } catch (error: any) {
      this.wasValidated.set(true);
      this.validationService.mapServerValidationErrors(error, this.resetForm);
    }
  }

  handleBackToLogin(event: Event) {
    event.preventDefault();
    this.facade.showLogin();
  }

  getErrors(controlName: keyof typeof AuthFields): string[] {
    return this.validationService.getServerErrors(this.resetForm, controlName);
  }

  //#endregion
}
