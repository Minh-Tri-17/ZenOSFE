import { inject, Injectable } from '@angular/core';
import { CountryRepository } from '../../../domain/categories/country/repositories/country.repository';

@Injectable({
  providedIn: 'root',
})
export class HardDeleteCountryUseCase {
  private readonly repo = inject(CountryRepository);

  execute(ids: string) {
    return this.repo.hardDelete(ids);
  }
}
