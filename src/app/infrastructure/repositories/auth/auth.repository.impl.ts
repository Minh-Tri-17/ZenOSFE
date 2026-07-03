import { inject, Injectable } from '@angular/core';
import { AuthRepository } from '../../../domain/auth/repositories/auth.repository';
import { AuthApiService } from '../../api/auth/auth-api.service';
import { AppResult } from '../../../core/models/app.model';
import { AuthModel } from '../../../domain/auth/models/auth.model';
import { ApiResponse } from '../../../core/models/api.model';

@Injectable({
  providedIn: 'root',
})
export class AuthRepositoryImpl implements AuthRepository {
  private readonly api = inject(AuthApiService);

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

  async login(data: AuthModel): Promise<AppResult<string>> {
    const res = await this.api.login(data);
    return this.mapApiToApp(res);
  }

  //#endregion
}
