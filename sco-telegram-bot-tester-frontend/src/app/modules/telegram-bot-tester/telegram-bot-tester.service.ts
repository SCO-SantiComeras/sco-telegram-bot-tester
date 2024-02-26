import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { WebSocketService } from '../../websocket/websocket.service';
import { websocketEvents } from '../../websocket/websocket.events';
import { SendMessage } from './model/send-message';

@Injectable({
  providedIn: 'root'
})
export class TelegramBotTesterService {

  constructor(
    private readonly http: HttpClient,
    private readonly websocketsService: WebSocketService,
  ) {}

  sendMessageGroup(sendMessage: SendMessage): Observable<boolean> {
    return this.http.post<boolean>(`${environment.apiUrl}/telegram-bot/send-message-group`, sendMessage);
  }

  getSendMessageGroupBySocket(): any {
    return this.websocketsService.getMessage(websocketEvents.WS_SEND_MESSAGE_GROUP);
  }
  
  removeSocket(): any {
    this.websocketsService.removeListenerMessage(websocketEvents.WS_SEND_MESSAGE_GROUP);
  }
}
