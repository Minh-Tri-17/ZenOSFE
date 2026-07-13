import { Injectable, inject } from '@angular/core';
import { CountryModel } from '../../../domain/categories/country/models/country.model';
import { CountryRepository } from '../../../domain/categories/country/repositories/country.repository';

@Injectable({
  providedIn: 'root',
})
export class UpdateCountryUseCase {
  private readonly repo = inject(CountryRepository);

  execute(data: CountryModel) {
    return this.repo.update(data);
  }
}
