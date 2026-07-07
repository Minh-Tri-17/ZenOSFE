import { Component, computed, inject, NgModule, output, signal } from '@angular/core';
import {
  CountryFields,
  CountryModel,
} from '../../../../../domain/categories/country/models/country.model';
import { CountryFacade } from '../../country.facade';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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

  private formValueSignal = toSignal(this.countryForm.valueChanges, {
    initialValue: this.countryForm.value,
  });

  title = computed(() => (this.formValueSignal()?.id ? 'Update' : 'Create'));

  wasValidated = signal<boolean>(false);

  //#endregion

  //#region //@ OUTPUTS

  saveSuccess = output<void>();

  //#endregion

  //#region //@ METHODS

  constructor() {
    this.countryForm.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.wasValidated.set(false);
      this.validationService.clearServerErrors(this.countryForm);
    });
  }

  initCreateForm() {
    this.countryForm.reset();
  }

  initUpdateForm(item: CountryModel) {
    this.countryForm.patchValue(item);
  }

  async handleSave() {
    this.wasValidated.set(true);

    if (this.countryForm.invalid) return;

    const rawValues = this.countryForm.getRawValue() as CountryModel;
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
    } catch (error: any) {
      this.validationService.mapServerValidationErrors(error, this.countryForm);
    }
  }

  getErrors(controlName: keyof typeof this.countryForm.controls): string[] {
    return this.validationService.getServerErrors(this.countryForm, controlName);
  }

  //#endregion
}
