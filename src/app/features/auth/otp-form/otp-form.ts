import { Component, inject, signal, computed, output } from '@angular/core';
import { AccountFacade } from '../account.facade';
import { FormValidationService } from '../../../core/services/form-validation.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MailFields, MailModel } from '../../../core/models/mail.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-otp-form',
  imports: [ReactiveFormsModule],
  templateUrl: './otp-form.html',
  styleUrl: './otp-form.scss',
})
export class OtpForm {
  private facade = inject(AccountFacade);
  private validationService = inject(FormValidationService);

  //#region //@ INPUT

  email = output<string>();

  //#endregion

  //#region //@ STATE

  mailForm = new FormGroup({
    to: new FormControl(),
  });

  wasValidated = signal<boolean>(false);
  isActiveForm = computed(() => this.facade.activeForm() === 'otp');

  //#endregion

  //#region //@ METHOD

  constructor() {
    //* subscribe() vào sự kiện thay đổi giá trị của form
    //* takeUntilDestroyed() để hủy subscription khi component bị hủy
    this.mailForm.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.wasValidated.set(false);
    });
  }

  handleBackToLogin(event: Event) {
    event.preventDefault();
    this.facade.showLogin();
  }

  async handleSendCode() {
    //* getRawValue() lấy toàn bộ giá trị của form, kể cả ô bị disabled
    //* as ép kiểu sang model tương ứng
    const rawValues = this.mailForm.getRawValue();

    //* gán || null để API có thể xử lý validate theo required.
    const item: MailModel = {
      to: rawValues.to?.trim() || null,
    };

    try {
      await this.facade.sendOtp(item);
      this.email.emit(rawValues.to?.trim() || '');
      this.facade.showReset();
    } catch (error: any) {
      this.wasValidated.set(true);
      this.validationService.mapServerValidationErrors(error, this.mailForm);
    }
  }

  getErrors(controlName: keyof typeof MailFields): string[] {
    return this.validationService.getServerErrors(this.mailForm, controlName);
  }

  //#endregion
}
