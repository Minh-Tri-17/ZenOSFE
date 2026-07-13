import { Injectable, inject } from '@angular/core';
import { CountryRepository } from '../../../domain/categories/country/repositories/country.repository';

@Injectable({
  providedIn: 'root',
})
export class SoftDeleteCountryUseCase {
  private readonly repo = inject(CountryRepository);

  execute(ids: string) {
    return this.repo.softDelete(ids);
  }
}
