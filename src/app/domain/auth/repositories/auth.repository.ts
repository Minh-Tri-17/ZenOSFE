import { AuthModel } from '../models/auth.model';
import { AppResult } from '../../../core/models/app.model';
import { MailModel } from '../../../core/models/mail.model';

export abstract class AuthRepository {
  abstract login(data: AuthModel): Promise<AppResult<string>>;
  abstract sendOTP(data: MailModel): Promise<AppResult<boolean>>;
  abstract resetPass(data: AuthModel): Promise<AppResult<boolean>>;
}
