import { Injectable } from '@angular/core';
import { AuthModel } from '../../../domain/auth/models/auth.model';
import { ApiResponse } from '../../../core/models/api.model';
import { API_CONSTANTS } from '../../../core/constants/api.constants';
import { BaseApiService } from '../base/base-api.service';
import { MailModel } from '../../../core/models/mail.model';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService extends BaseApiService {
  //#region //@ METHODS

  login(data: AuthModel) {
    return this.postHttp<ApiResponse<boolean>>(API_CONSTANTS.account.login, data);
  }

  sendOTP(data: MailModel) {
    return this.postHttp<ApiResponse<boolean>>(API_CONSTANTS.account.sendOTP, data);
  }

  resetPass(data: AuthModel) {
    return this.patchHttp<ApiResponse<boolean>>(API_CONSTANTS.account.resetPass, data);
  }

  //#endregion
}
