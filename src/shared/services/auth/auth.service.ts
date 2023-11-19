import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  User,
  UserRole,
} from 'src/shared/model/userModel';
import {
  CommonReponse,
  AuthenticationRequest,
  AuthenticationResponse,
} from 'src/shared/model/reqResModel';
import { SERVER_API_BASE_URL } from 'src/shared/model/utility';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  authenticate(
    authDetails: AuthenticationRequest
  ): Observable<CommonReponse<AuthenticationResponse<User>>> {
    return this.http.post<CommonReponse<AuthenticationResponse<User>>>(
      SERVER_API_BASE_URL + '/auth/authenticate',
      authDetails
    );
  }

  register(
    newUser: User
  ): Observable<CommonReponse<AuthenticationResponse<User>>> {
    return this.http.post<CommonReponse<AuthenticationResponse<User>>>(
      SERVER_API_BASE_URL + '/auth/register',
      newUser
    );
  }

  getAllUsernames(): Observable<CommonReponse<string[]>> {
    return this.http.get<CommonReponse<string[]>>(
      SERVER_API_BASE_URL + '/auth/usernames'
    );
  }

  getToken() {
    return window.sessionStorage.getItem('token');
  }

  setToken(token: string) {
    window.sessionStorage.setItem('token', token);
  }

  getRole() {
    return window.sessionStorage.getItem('role');
  }

  setRole(role: UserRole) {
    window.sessionStorage.setItem('role', role);
  }

  isLoggedIn(): boolean {
    if (this.getToken() === null || this.getRole() === null) return false;
    else return true;
  }

  clearSessionStorage() {
    window.sessionStorage.clear();
  }

  getUserId(){
    return window.sessionStorage.getItem('userId');
  }

  setUserId(userId: string){
    window.sessionStorage.setItem('userId', userId);
  }
}
