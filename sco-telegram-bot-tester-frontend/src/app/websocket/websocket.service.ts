import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { fromEvent, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root',
})
export class WebSocketService extends Socket {
  
  constructor() {
    super({
      url: environment.socketUrl,
      options: {
        withCredentials: true,
      }
    });
  }

  sendMessage(event: string, data?: any): void {
    if (data) {
      this.emit(event, data);
      return;
    }

    this.emit(event);
    return;
  }

  getMessage(event: string): Observable<any> {
    return fromEvent(this.ioSocket,event).pipe(map((data: any) => data));
  }

  removeListenerMessage(event: string): any {
    this.removeListener(event);
  }

  connect() {
    this.on('connect', () => {
      if (!environment.production) {
        console.log('Conexión con Backend');
      }
    });

    this.on('connect_error', (error) => {
      console.log('No se pudo conectar al Backend');
      console.log(error);
    });
  }
}
