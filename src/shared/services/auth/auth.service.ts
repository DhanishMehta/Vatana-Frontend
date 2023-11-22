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

  /**
   * @function authenticate: function to authenticate a user
   * @param authDetails : Authentication request details(uesremail, password)
   * @returns Observable<AuthenticationResponse>
   */
  authenticate(
    authDetails: AuthenticationRequest
  ): Observable<CommonReponse<AuthenticationResponse<User>>> {
    return this.http.post<CommonReponse<AuthenticationResponse<User>>>(
      SERVER_API_BASE_URL + '/auth/authenticate',
      authDetails
    );
  }

  /**
   * @function register: function to register a new user
   * @param newUser: newUser's details
   * @returns User Authentication Response
   */
  register(
    newUser: User
  ): Observable<CommonReponse<AuthenticationResponse<User>>> {
    return this.http.post<CommonReponse<AuthenticationResponse<User>>>(
      SERVER_API_BASE_URL + '/auth/register',
      newUser
    );
  }

  /**
   * @function getAllUsernames: function to get all usernames
   * @returns array of all registered usernames
   */
  getAllUsernames(): Observable<CommonReponse<string[]>> {
    return this.http.get<CommonReponse<string[]>>(
      SERVER_API_BASE_URL + '/auth/usernames'
    );
  }

  /**
   * @function getToken: function to get JWT token of the current user
   * @returns current user token saved in session storage
   */
  getToken() {
    return window.sessionStorage.getItem('token');
  }

  /**
   * @function setToken: function to set JWT token of current user in session storage
   * @param token: JWT token as string
   */
  setToken(token: string) {
    window.sessionStorage.setItem('token', token);
  }

    /**
   * @function getRole: function to get role of the current user
   * @returns current user role saved in session storage
   */
  getRole() {
    return window.sessionStorage.getItem('role');
  }

    /**
   * @function setRole: function to set role of current user in session storage
   * @param role: current user's role
   */
  setRole(role: UserRole) {
    window.sessionStorage.setItem('role', role);
  }

  /**
   * @function isLoggedIn: to check if user is logged in
   * @returns boolean for whether user is logged in or not
   */
  isLoggedIn(): boolean {
    if (this.getToken() === null || this.getRole() === null) return false;
    else return true;
  }

  /**
   * @function clearSessionStorage: function to clear the session storage
   */
  clearSessionStorage() {
    window.sessionStorage.clear();
  }

  /**
   * @function getUserId: function to get the userId of current user
   * @returns userId of the current user from session storage
   */
  getUserId(){
    return window.sessionStorage.getItem('userId');
  }

  /**
   * @function setUserId: function to set userId of the current user in the session storage
   * @param userId: userId of the current user
   */
  setUserId(userId: string){
    window.sessionStorage.setItem('userId', userId);
  }
}
