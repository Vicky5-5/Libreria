export interface ResponseAcceso<T>{
    isSuccess: boolean;
    token: string;
    message?: string;
    objeto?: any;
}