import { Component, computed, inject, output, signal } from '@angular/core';
import {
  CountryFields,
  CountryModel,
} from '../../../../../domain/categories/country/models/country.model';
import { CountryFacade } from '../../country.facade';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Modal } from '../../../../../shared/components/modal/modal';
import { FormValidationService } from '../../../../../core/services/form-validation.service';

@Component({
  selector: 'app-country-form',
  imports: [ReactiveFormsModule, Modal],
  templateUrl: './country-form.html',
  styleUrl: './country-form.scss',
})
export class CountryForm {
  private facade = inject(CountryFacade);
  private validationService = inject(FormValidationService);

  //#region //@ STATE

  countryForm = new FormGroup({
    id: new FormControl<string>(''),
    countryCode: new FormControl({ value: '', disabled: true }),
    countryName: new FormControl(),
    note: new FormControl(),
  });

  //* toSignal() chuyển đổi luồng thay đổi giá trị của form (Observable) sang Signal
  private formValueSignal = toSignal(this.countryForm.valueChanges, {
    initialValue: this.countryForm.value,
  });

  wasValidated = signal<boolean>(false);

  //#endregion

  //#region //@ OUTPUTS

  saveSuccess = output<void>();

  //#endregion

  //#region //@ METHODS

  //* computed() dùng để tính toán giá trị dựa trên state khác
  title = computed(() => (this.formValueSignal()?.id ? 'Update' : 'Create'));

  constructor() {
    //* subscribe() vào sự kiện thay đổi giá trị của form
    //* takeUntilDestroyed() để hủy subscription khi component bị hủy
    this.countryForm.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.wasValidated.set(false);
    });
  }

  initCreateForm() {
    this.countryForm.reset();
  }

  initUpdateForm(item: CountryModel) {
    this.countryForm.patchValue(item);
  }

  async handleSave() {
    //* getRawValue() lấy toàn bộ giá trị của form, kể cả ô bị disabled
    //* as ép kiểu sang model tương ứng
    const rawValues = this.countryForm.getRawValue() as CountryModel;

    //* gán || null để API có thể xử lý validate theo required.
    const item: CountryModel = {
      id: rawValues.id,
      countryCode: rawValues.countryCode?.trim() || null,
      countryName: rawValues.countryName?.trim() || null,
      note: rawValues.note?.trim() || null,
    };

    try {
      item.id ? await this.facade.update(item) : await this.facade.create(item);

      this.saveSuccess.emit();

      this.initCreateForm();

      this.closeModal();
    } catch (error: any) {
      this.wasValidated.set(true);

      this.validationService.mapServerValidationErrors(error, this.countryForm);
    }
  }

  private closeModal() {
    const modalEl = document.getElementById('countryModal');
    if (modalEl) {
      const bootstrapModal = (window as any).bootstrap?.Modal?.getInstance(modalEl);
      bootstrapModal?.hide();
    }
  }

  getErrors(controlName: keyof typeof CountryFields): string[] {
    return this.validationService.getServerErrors(this.countryForm, controlName);
  }

  //#endregion
}
