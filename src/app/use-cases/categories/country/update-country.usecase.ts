import { inject, Injectable } from '@angular/core';
import { CountryRepository } from '../../../domain/categories/country/repositories/country.repository';
import { CountryModel } from '../../../domain/categories/country/models/country.model';

@Injectable({
  providedIn: 'root',
})
export class UpdateCountryUseCase {
  private readonly repo = inject(CountryRepository);

  execute(data: CountryModel) {
    return this.repo.update(data);
  }
}
