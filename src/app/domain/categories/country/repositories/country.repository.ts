import { AppResult } from '../../../../core/models/app.model';
import { PagingRequest, PagingResult } from '../../../../core/models/paging.model';
import { CountryModel } from '../models/country.model';

export abstract class CountryRepository {
  abstract getPaging(filter: PagingRequest): Promise<AppResult<PagingResult<CountryModel>>>;
  abstract getById(id: string): Promise<AppResult<CountryModel>>;

  abstract create(data: CountryModel): Promise<AppResult<boolean>>;
  abstract update(data: CountryModel): Promise<AppResult<boolean>>;
  abstract softDelete(ids: string): Promise<AppResult<boolean>>;
  abstract hardDelete(ids: string): Promise<AppResult<boolean>>;

  abstract import(file: File): Promise<AppResult<boolean>>;
  abstract export(filter: PagingRequest): Promise<Blob>;
}
