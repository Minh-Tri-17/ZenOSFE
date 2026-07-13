import { Injectable, inject } from '@angular/core';
import { CountryRepository } from '../../../domain/categories/country/repositories/country.repository';

@Injectable({
  providedIn: 'root',
})
export class ImportCountryUseCase {
  private readonly repo = inject(CountryRepository);

  execute(file: File) {
    return this.repo.import(file);
  }
}
