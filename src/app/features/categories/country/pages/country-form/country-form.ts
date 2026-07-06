import { Component, computed, inject, NgModule, output, signal } from '@angular/core';
import { CountryModel } from '../../../../../domain/categories/country/models/country.model';
import { CountryFacade } from '../../country.facade';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Modal } from '../../../../../shared/components/modal/modal';

@Component({
  selector: 'app-country-form',
  imports: [ReactiveFormsModule, Modal],
  templateUrl: './country-form.html',
  styleUrl: './country-form.scss',
})
export class CountryForm {
  private facade = inject(CountryFacade);

  //#region //@ STATE

  countryForm = new FormGroup({
    id: new FormControl<string>(''),
    countryCode: new FormControl<string>({ value: '', disabled: true }, [Validators.required]),
    countryName: new FormControl<string>('', [Validators.required]),
    note: new FormControl<string>('', [Validators.required]),
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

    const item = this.countryForm.getRawValue() as CountryModel;

    item.id ? await this.facade.update(item) : await this.facade.create(item);

    this.saveSuccess.emit();

    this.initCreateForm();
  }

  //#endregion
}
