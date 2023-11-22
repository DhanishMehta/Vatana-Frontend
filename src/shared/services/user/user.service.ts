import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { CommonReponse } from 'src/shared/model/reqResModel';
import { User } from 'src/shared/model/userModel';
import { SERVER_API_BASE_URL } from 'src/shared/model/utility';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * @function getHeader: function to get an HTTPHeader with Authorization
   * @param token 
   * @returns 
   */
  getHeader(token: string): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  /**
   * @function getAllUsers: function to get all users
   * @returns 
   */
  getAllUsers(): Observable<CommonReponse<User[]>> {
    const token = this.authService.getToken();
    return this.http.get<CommonReponse<User[]>>(SERVER_API_BASE_URL + '/users', {headers: this.getHeader(token)});
  }

  /**
   * @function getPaginatedUsers: function to get users in a pageable format
   * @param page 
   * @param limit 
   * @returns 
   */
  getPaginatedUsers(
    page: number,
    limit: number
  ): Observable<CommonReponse<User[]>> {
    const token = this.authService.getToken();
    return this.http.get<CommonReponse<User[]>>(
      SERVER_API_BASE_URL + '/users?page=' + page + '&limit=' + limit
      ,{headers: this.getHeader(token)}
    );
  }

  /**
   * @function getUserById: function to get a particular user by userId
   * @param userId 
   * @returns 
   */
  getUserById(userId: string): Observable<CommonReponse<User>> {
    const token = this.authService.getToken();
    return this.http.get<CommonReponse<User>>(
      SERVER_API_BASE_URL + '/users/' + userId,
      {headers: this.getHeader(token)}
    );
  }

  /**
   * @function updateUser: function to update a user
   * @param user 
   * @param userId 
   * @returns 
   */
  updateUser(user: User, userId: string): Observable<CommonReponse<User>> {
    const token = this.authService.getToken();
    return this.http.put<CommonReponse<User>>(
      SERVER_API_BASE_URL + '/users/' + userId,
      user,
      {headers: this.getHeader(token)}
    );
  }

  /**
   * @function deleteUser: function to delete a user
   * @param userId 
   * @returns 
   */
  deleteUser(userId: string): Observable<CommonReponse<User>> {
    const token = this.authService.getToken();
    return this.http.delete<CommonReponse<User>>(
      SERVER_API_BASE_URL + '/users/' + userId,
      {headers: this.getHeader(token)}
    );
  }

  /**
   * @function addUser: function to add a user
   * @param user 
   * @returns 
   */
  addUser(user: User): Observable<CommonReponse<User>> {
    const token = this.authService.getToken();
    return this.http.post<CommonReponse<User>>(
      SERVER_API_BASE_URL + '/users',
      user,
      {headers: this.getHeader(token)}
    );
  }
}
