import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from './model/user';
import { websocketEvents } from 'src/app/websocket/websocket.events';
import { WebSocketService } from 'src/app/websocket/websocket.service';
import { JoinPipe } from 'src/app/shared/join/join.pipe';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private readonly joinPipe: JoinPipe,
    private readonly http: HttpClient,
    private readonly websocketsService: WebSocketService,
  ) {}

  fetchUsers(filter?: any): Observable<User[]> {
    let params: string[] = [];

    if (filter) {
      if (filter._id) {
        params.push(`_id=${filter._id}`);
      }
      if (filter.name) {
        params.push(`name=${filter.name}`);
      }
      if (filter.email) {
        params.push(`email=${filter.email}`);
      }
      if (filter.active != undefined) {
        params.push(`active=${filter.active}`);
      }
      if (filter.role) {
        params.push(`role=${filter.role}`);
      }
      if (filter.pwdRecoveryToken) {
        params.push(`pwdRecoveryToken=${filter.pwdRecoveryToken}`);
      }
      if (filter.pwdRecoveryDate) {
        params.push(`pwdRecoveryDate=${filter.pwdRecoveryDate}`);
      }
    }

    return this.http.get<User[]>(`${environment.apiUrl}/users${params.length == 0 ? '' : `${this.joinPipe.transform(params, '&')}`}`);
  }

  createUser(user: User):Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/users`, user)
  }

  updateUser(_id: string, user: User):Observable<User> {
    return this.http.put<User>(`${environment.apiUrl}/users/${_id}`, user)
  }

  deleteUser(name: string): Observable<boolean> {
    return this.http.delete<boolean>(`${environment.apiUrl}/users/${name}`)
  }

  /* Web Sockets */
  getUsersBySocket(): any {
    return this.websocketsService.getMessage(websocketEvents.WS_USERS);
  }
  removeSocket(): any {
    this.websocketsService.removeListenerMessage(websocketEvents.WS_USERS);
  }
}