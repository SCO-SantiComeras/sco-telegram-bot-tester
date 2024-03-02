import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SendMessage } from './model/send-message';

@Injectable({
  providedIn: 'root'
})
export class TelegramBotTesterService {

  constructor(private readonly http: HttpClient) {}

  sendMessageGroup(sendMessage: SendMessage): Observable<boolean> {
    return this.http.post<boolean>(`${environment.apiUrl}/telegram-bot/send-message-group`, sendMessage);
  }
}
