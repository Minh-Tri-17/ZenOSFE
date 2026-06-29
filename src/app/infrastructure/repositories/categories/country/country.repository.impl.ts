import { inject, Injectable } from '@angular/core';
import { CountryApiService } from '../../../api/categories/country/country.api.service';
import { PagingRequest, PagingResult } from '../../../../core/models/paging.model';
import { AppResult } from '../../../../core/models/app.model';
import { ApiResponse } from '../../../../core/models/api.model';
import { CountryRepository } from '../../../../domain/categories/country/repositories/country.repository';
import { CountryModel } from '../../../../domain/categories/country/models/country.model';

@Injectable({
  providedIn: 'root',
})
export class CountryRepositoryImpl implements CountryRepository {
  private readonly api = inject(CountryApiService);

  //#region //@ HELPERS

  private mapApiToApp(res: ApiResponse<any>): AppResult<any> {
    return {
      isSuccess: res.isSuccess,
      result: res.result,
      message: res.message,
    };
  }

  //#endregion

  //#region //@ API METHODS

  async create(data: CountryModel): Promise<AppResult<boolean>> {
    const res = await this.api.create(data);
    return this.mapApiToApp(res);
  }

  async update(data: CountryModel): Promise<AppResult<boolean>> {
    const res = await this.api.update(data);
    return this.mapApiToApp(res);
  }

  async softDelete(ids: string): Promise<AppResult<boolean>> {
    const res = await this.api.softDelete(ids);
    return this.mapApiToApp(res);
  }

  async hardDelete(ids: string): Promise<AppResult<boolean>> {
    const res = await this.api.hardDelete(ids);
    return this.mapApiToApp(res);
  }

  async getById(id: string): Promise<AppResult<CountryModel>> {
    const res = await this.api.getById(id);
    return this.mapApiToApp(res);
  }

  async getPaging(filter: PagingRequest): Promise<AppResult<PagingResult<CountryModel>>> {
    const res = await this.api.getPaging(filter);
    return this.mapApiToApp(res);
  }

  async import(file: File): Promise<AppResult<boolean>> {
    const res = await this.api.import(file);
    return this.mapApiToApp(res);
  }

  async export(filter: PagingRequest): Promise<Blob> {
    return await this.api.export(filter);
  }

  //#endregion
}
