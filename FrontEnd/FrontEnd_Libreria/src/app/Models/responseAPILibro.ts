export interface responseAPILibro<T> {
  isSuccess: boolean;
  data: T;
  message?: string;
}
