import { inject, Injectable } from '@angular/core';
import { AuthRepository } from '../../domain/auth/repositories/auth.repository';
import { AuthModel } from '../../domain/auth/models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class LoginAccountUseCase {
  private readonly repo = inject(AuthRepository);

  execute(data: AuthModel) {
    return this.repo.login({ ...data });
  }
}
