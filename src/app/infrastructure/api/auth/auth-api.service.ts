import { Injectable } from '@angular/core';
import { AuthModel } from '../../../domain/auth/models/auth.model';
import { ApiResponse } from '../../../core/models/api.model';
import { API_CONSTANTS } from '../../../core/constants/api.constants';
import { BaseApiService } from '../base/base-api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService extends BaseApiService {
  //#region //@ METHODS

  login(data: AuthModel) {
    return this.postHttp<ApiResponse<boolean>>(API_CONSTANTS.account.login, data);
  }

  //#endregion
}
