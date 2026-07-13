import { Injectable, inject } from '@angular/core';
import { CountryRepository } from '../../../domain/categories/country/repositories/country.repository';
import { CountryModel } from '../../../domain/categories/country/models/country.model';
import { BASE_CONSTANTS } from '../../../core/constants/base.constant';

@Injectable({
  providedIn: 'root',
})
export class CreateCountryUseCase {
  private readonly repo = inject(CountryRepository);

  execute(data: CountryModel) {
    return this.repo.create({ ...data, id: BASE_CONSTANTS.guidEmpty });
  }
}
