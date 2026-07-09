export interface AuthModel {
  username?: string | null;
  password?: string | null;
  remember?: boolean | null;
}

export const AuthFields: Record<keyof AuthModel, string> = {
  username: 'Username',
  password: 'Password',
  remember: 'Remember',
};
