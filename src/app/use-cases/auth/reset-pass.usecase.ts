import { Injectable, inject } from '@angular/core';
import { AuthModel } from '../../domain/auth/models/auth.model';
import { AuthRepository } from '../../domain/auth/repositories/auth.repository';

@Injectable({
  providedIn: 'root',
})
export class ResetPassUseCase {
  private readonly repo = inject(AuthRepository);

  execute(data: AuthModel) {
    return this.repo.resetPass({ ...data });
  }
}
