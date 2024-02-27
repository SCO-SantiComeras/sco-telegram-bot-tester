import { JoinPipe } from './../../shared/join/join.pipe';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { websocketEvents } from 'src/app/websocket/websocket.events';
import { WebSocketService } from 'src/app/websocket/websocket.service';
import { TelegramBotResult } from './model/telegram-bot-result';
import { environment } from 'src/environments/environment';
import { SendMessage } from '../telegram-bot-tester/model/send-message';

@Injectable({
  providedIn: 'root'
})
export class TelegramBotResultsService {

  constructor(
    private readonly joinPipe: JoinPipe,
    private readonly http: HttpClient,
    private readonly websocketsService: WebSocketService,
  ) {}

  sendMessageGroup(sendMessage: SendMessage): Observable<boolean> {
    return this.http.post<boolean>(`${environment.apiUrl}/telegram-bot/send-message-group`, sendMessage);
  }

  fetchTelegramBotResults(filter?: any): Observable<TelegramBotResult[]> {
    const params: string[] = [];

    if (filter) {
      if (filter.user) {
        params.push(`user=${filter.user}`);
      }
    }

    return this.http.get<TelegramBotResult[]>(`${environment.apiUrl}/telegram-bot-results${params.length == 0 
      ? '' 
      : `${this.joinPipe.transform(params, '&')}`}
    `);
  }

  addTelegramBotResult(telegramBotResult: TelegramBotResult):Observable<TelegramBotResult> {
    return this.http.post<TelegramBotResult>(`${environment.apiUrl}/telegram-bot-results`, TelegramBotResult)
  }

  deleteTelegramBotResult(_id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${environment.apiUrl}/telegram-bot-results/${_id}`)
  }

  getTelegramBotResultsBySocket(): any {
    return this.websocketsService.getMessage(websocketEvents.WS_TELEGRAM_BOT_RESULT);
  }
  
  removeSocket(): any {
    this.websocketsService.removeListenerMessage(websocketEvents.WS_TELEGRAM_BOT_RESULT);
  }
}
