export interface responseAPIUsuario<T> {
  isSuccess: boolean;
  data: T;
  message?: string;
}
