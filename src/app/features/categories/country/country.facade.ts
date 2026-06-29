import { inject, Injectable } from '@angular/core';
import { GetCountryUseCase } from '../../../use-cases/categories/country/get-country.usecase';
import { GetPagingCountryUseCase } from '../../../use-cases/categories/country/get-paging-country.usecase';
import { CreateCountryUseCase } from '../../../use-cases/categories/country/create-country.usecase';
import { UpdateCountryUseCase } from '../../../use-cases/categories/country/update-country.usecase';
import { SoftDeleteCountryUseCase } from '../../../use-cases/categories/country/soft-delete-country.usecase';
import { HardDeleteCountryUseCase } from '../../../use-cases/categories/country/hard-delete-country.usecase';
import { ImportCountryUseCase } from '../../../use-cases/categories/country/import-country.usecase';
import { ExportCountryUseCase } from '../../../use-cases/categories/country/export-country.usecase';
import { PagingRequest } from '../../../core/models/paging.model';
import { CountryModel } from '../../../domain/categories/country/models/country.model';

@Injectable({
  providedIn: 'root',
})
export class CountryFacade {
  private readonly getUC = inject(GetCountryUseCase);
  private readonly getPagingUC = inject(GetPagingCountryUseCase);
  private readonly createUC = inject(CreateCountryUseCase);
  private readonly updateUC = inject(UpdateCountryUseCase);
  private readonly softDeleteUC = inject(SoftDeleteCountryUseCase);
  private readonly hardDeleteUC = inject(HardDeleteCountryUseCase);
  private readonly importUC = inject(ImportCountryUseCase);
  private readonly exportUC = inject(ExportCountryUseCase);

  //#region //@ METHODS

  getById(id: string) {
    return this.getUC.execute(id);
  }

  getPaging(filter: PagingRequest) {
    return this.getPagingUC.execute(filter);
  }

  create(dto: CountryModel) {
    return this.createUC.execute(dto);
  }

  update(dto: CountryModel) {
    return this.updateUC.execute(dto);
  }

  softDelete(ids: string) {
    return this.softDeleteUC.execute(ids);
  }

  hardDelete(ids: string) {
    return this.hardDeleteUC.execute(ids);
  }

  import(file: File) {
    return this.importUC.execute(file);
  }

  export(filter: PagingRequest) {
    return this.exportUC.execute(filter);
  }

  //#endregion
}
