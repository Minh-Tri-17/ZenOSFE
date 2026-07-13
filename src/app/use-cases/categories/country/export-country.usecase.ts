import { Injectable, inject } from '@angular/core';
import { PagingRequest } from '../../../core/models/paging.model';
import { CountryRepository } from '../../../domain/categories/country/repositories/country.repository';

@Injectable({
  providedIn: 'root',
})
export class ExportCountryUseCase {
  private readonly repo = inject(CountryRepository);

  execute(filter: PagingRequest) {
    return this.repo.export(filter);
  }
}
