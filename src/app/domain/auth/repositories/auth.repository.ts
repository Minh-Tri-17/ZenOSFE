import { AppResult } from '../../../core/models/app.model';
import { AuthModel } from '../models/auth.model';

export abstract class AuthRepository {
  abstract login(data: AuthModel): Promise<AppResult<string>>;
}
