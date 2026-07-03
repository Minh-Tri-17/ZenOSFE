export interface AuthModel {
  userName?: string;
  password?: string;
}

export const AuthFields: Record<keyof AuthModel, string> = {
  userName: 'Username',
  password: 'Password',
};
