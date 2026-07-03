import { inject, Injectable } from '@angular/core';
import { LoginAccountUseCase } from '../../use-cases/auth/login-account.usecase';
import { AuthModel } from '../../domain/auth/models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AccountFacade {
  private readonly loginUC = inject(LoginAccountUseCase);

  //#region //@ METHODS

  login(data: AuthModel) {
    return this.loginUC.execute(data);
  }

  //#endregion
}
