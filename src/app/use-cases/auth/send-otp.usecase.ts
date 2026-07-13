import { Injectable, inject } from '@angular/core';
import { AuthRepository } from '../../domain/auth/repositories/auth.repository';
import { MailModel } from '../../core/models/mail.model';

@Injectable({
  providedIn: 'root',
})
export class SendOTPUseCase {
  private readonly repo = inject(AuthRepository);

  execute(data: MailModel) {
    return this.repo.sendOTP({ ...data });
  }
}
