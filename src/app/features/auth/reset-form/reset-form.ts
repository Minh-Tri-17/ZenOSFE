import {
  Component,
  inject,
  signal,
  computed,
  ElementRef,
  ViewChildren,
  QueryList,
  input,
} from '@angular/core';
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
  private facade = inject(AccountFacade);
  private validationService = inject(FormValidationService);

  //#region //@ INPUT

  email = input<string>();

  //#endregion

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

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  constructor() {
    //* subscribe() vào sự kiện thay đổi giá trị của form
    //* takeUntilDestroyed() để hủy subscription khi component bị hủy
    this.resetForm.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.wasValidated.set(false);
    });
  }

  handleOtpKeydown(event: KeyboardEvent, index: number): void {
    const inputs = this.otpInputs.toArray();
    //* nativeElement lắng nghe sự thay đổi giá trị của form.
    const input = inputs[index].nativeElement;
    const isHandledKey =
      event.key === 'Backspace' ||
      (event.key === 'ArrowLeft' && index > 0) ||
      (event.key === 'ArrowRight' && index < inputs.length - 1);

    if (!isHandledKey) return;

    event.preventDefault();

    if (event.key === 'Backspace') {
      if (input.value) {
        input.value = '';
      } else if (index > 0) {
        //* nativeElement lắng nghe sự thay đổi giá trị của form.
        inputs[index - 1].nativeElement.value = '';
        inputs[index - 1].nativeElement.focus();
      }
      this.syncOtpValue();
      return;
    }

    if (event.key === 'ArrowLeft') {
      //* nativeElement lắng nghe sự thay đổi giá trị của form.
      inputs[index - 1].nativeElement.focus();
      return;
    }

    if (event.key === 'ArrowRight') {
      //* nativeElement lắng nghe sự thay đổi giá trị của form.
      inputs[index + 1].nativeElement.focus();
      return;
    }
  }

  handleOtpInput(event: Event, index: number): void {
    const inputs = this.otpInputs.toArray();
    const input = event.target as HTMLInputElement;
    const digit = input.value.replace(/\D/g, '').slice(-1);
    input.value = digit;

    if (digit && index < inputs.length - 1) {
      //* nativeElement lắng nghe sự thay đổi giá trị của form.
      inputs[index + 1].nativeElement.focus();
      inputs[index + 1].nativeElement.select();
    }

    this.syncOtpValue();
  }

  handleOtpPaste(event: ClipboardEvent, index: number): void {
    event.preventDefault();
    const pasted = event.clipboardData?.getData('text') ?? '';
    const digits = pasted.replace(/\D/g, '').slice(0, 6);
    const inputs = this.otpInputs.toArray();

    digits.split('').forEach((d, i) => {
      const targetIndex = index + i;
      if (targetIndex < inputs.length)
        //* nativeElement lắng nghe sự thay đổi giá trị của form.
        inputs[targetIndex].nativeElement.value = d;
    });

    const nextFocus = Math.min(index + digits.length, inputs.length - 1);
    //* nativeElement lắng nghe sự thay đổi giá trị của form.
    inputs[nextFocus].nativeElement.focus();
    this.syncOtpValue();
  }

  handleOtpFocus(index: number): void {
    const inputs = this.otpInputs.toArray();
    const firstEmpty = inputs.findIndex((inp) => !inp.nativeElement.value);

    if (firstEmpty !== -1 && firstEmpty < index)
      //* nativeElement lắng nghe sự thay đổi giá trị của form.
      inputs[firstEmpty].nativeElement.focus();
  }

  private syncOtpValue(): void {
    const combined = this.otpInputs
      .toArray()
      .map((inp) => inp.nativeElement.value)
      .join('');

    this.resetForm.controls.otp.setValue(combined, { emitEvent: false });
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
      email: this.email() || null,
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
