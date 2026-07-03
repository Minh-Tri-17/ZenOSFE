import { Injectable } from '@angular/core';
import { BaseApiService } from '../../base/base-api.service';
import { PagingRequest, PagingResult } from '../../../../core/models/paging.model';
import { ApiResponse } from '../../../../core/models/api.model';
import { CountryModel } from '../../../../domain/categories/country/models/country.model';
import { API_CONSTANTS } from '../../../../core/constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class CountryApiService extends BaseApiService {
  //#region //@ METHODS

  create(data: CountryModel) {
    return this.postHttp<ApiResponse<boolean>>(API_CONSTANTS.country.create, data);
  }

  update(data: CountryModel) {
    return this.patchHttp<ApiResponse<boolean>>(API_CONSTANTS.country.update, data);
  }

  softDelete(ids: string) {
    return this.deleteHttp<ApiResponse<boolean>>(`${API_CONSTANTS.country.softDelete}?ids=${ids}`);
  }

  hardDelete(ids: string) {
    return this.deleteHttp<ApiResponse<boolean>>(`${API_CONSTANTS.country.hardDelete}?ids=${ids}`);
  }

  getById(id: string) {
    return this.getHttp<ApiResponse<CountryModel>>(API_CONSTANTS.country.getById, id);
  }

  getPaging(data: PagingRequest) {
    return this.postHttp<ApiResponse<PagingResult<CountryModel>>>(
      API_CONSTANTS.country.getPaging,
      data,
    );
  }

  import(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.postHttp<ApiResponse<boolean>>(API_CONSTANTS.country.import, formData);
  }

  export(data: PagingRequest) {
    return this.postBlobHttp(API_CONSTANTS.country.export, data);
  }

  //#endregion
}
