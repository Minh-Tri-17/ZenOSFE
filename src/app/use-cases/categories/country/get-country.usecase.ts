import { inject, Injectable } from '@angular/core';
import { CountryRepository } from '../../../domain/categories/country/repositories/country.repository';

@Injectable({
  providedIn: 'root',
})
export class GetCountryUseCase {
  private readonly repo = inject(CountryRepository);

  execute(id: string) {
    return this.repo.getById(id);
  }
}
