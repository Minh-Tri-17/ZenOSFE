export interface AuthModel {
  username?: string | null;
  password?: string | null;
}

export const AuthFields: Record<keyof AuthModel, string> = {
  username: 'Username',
  password: 'Password',
};
