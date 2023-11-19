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

  getHeader(token: string): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getAllUsers(): Observable<CommonReponse<User[]>> {
    const token = this.authService.getToken();
    return this.http.get<CommonReponse<User[]>>(SERVER_API_BASE_URL + '/users', {headers: this.getHeader(token!)});
  }

  getPaginatedUsers(
    page: number,
    limit: number
  ): Observable<CommonReponse<User[]>> {
    const token = this.authService.getToken();
    return this.http.get<CommonReponse<User[]>>(
      SERVER_API_BASE_URL + '/users?page=' + page + '&limit=' + limit
      ,{headers: this.getHeader(token!)}
    );
  }

  getUserById(userId: string): Observable<CommonReponse<User>> {
    const token = this.authService.getToken();
    return this.http.get<CommonReponse<User>>(
      SERVER_API_BASE_URL + '/users/' + userId,
      {headers: this.getHeader(token!)}
    );
  }

  updateUser(user: User, userId: string): Observable<CommonReponse<User>> {
    const token = this.authService.getToken();
    return this.http.put<CommonReponse<User>>(
      SERVER_API_BASE_URL + '/users/' + userId,
      user,
      {headers: this.getHeader(token!)}
    );
  }

  deleteUser(userId: string): Observable<CommonReponse<User>> {
    const token = this.authService.getToken();
    return this.http.delete<CommonReponse<User>>(
      SERVER_API_BASE_URL + '/users/' + userId,
      {headers: this.getHeader(token!)}
    );
  }

  addUser(user: User): Observable<CommonReponse<User>> {
    const token = this.authService.getToken();
    return this.http.post<CommonReponse<User>>(
      SERVER_API_BASE_URL + '/users',
      user,
      {headers: this.getHeader(token!)}
    );
  }
}
