import { inject, Injectable } from '@angular/core';
import { CountryRepository } from '../../../domain/categories/country/repositories/country.repository';
import { PagingRequest } from '../../../core/models/paging.model';

@Injectable({
  providedIn: 'root',
})
export class ExportCountryUseCase {
  private readonly repo = inject(CountryRepository);

  execute(filter: PagingRequest) {
    return this.repo.export(filter);
  }
}
