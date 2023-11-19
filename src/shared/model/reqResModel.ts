import { Pagination } from "./utility";

export interface AuthenticationRequest {
    userEmail: string;
    userPassword: string;
  }
  
  export interface AuthenticationResponse<T> {
    token: string;
    data: T;
  }
  export interface CommonReponse<T> {
    statusCode: number;
    success: boolean;
    message: string;
    pagination: Pagination;
    data: T;
  }