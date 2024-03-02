import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Login } from './model/login';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Token } from './model/token';
import { User } from '../users/model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private readonly http: HttpClient) {}

  logIn(login: Login): Observable<Token> {
    return this.http.post<Token>(`${environment.apiUrl}/auth/login`, login);
  }

  registerUser(user: User): Observable<User> {
    return this.http.post<User>(environment.apiUrl + '/auth/register', user);
  }

  requestPassword(email: string): Observable<boolean> {
    return this.http.get<boolean>(environment.apiUrl + `/auth/request-password/${email}`);
  }

  resetPassword(pwdRecoveryToken: string, user: User): Observable<boolean> {
    return this.http.put<boolean>(environment.apiUrl + `/auth/reset-password/${pwdRecoveryToken}`, user);
  }

  fetchUserRecoveryPwd(pwdRecoveryToken: string): Observable<User> {
    return this.http.get<User>(environment.apiUrl + `/auth/getUserRecoveryPassword/${pwdRecoveryToken}`);
  }

  fetchUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(environment.apiUrl + `/auth/getUserEmail/${email}`);
  }

  confirmEmail(email: string): Observable<boolean> {
    return this.http.get<boolean>(environment.apiUrl + `/auth/confirmEmail/${email}`);
  }

  validateToken(user: User): Observable<Token> {
    return this.http.post<Token>(environment.apiUrl + '/auth/validate-token', user);
  }
}
