export interface AppResult<T> {
  isSuccess: boolean;
  message?: string;
  result?: T;
}
