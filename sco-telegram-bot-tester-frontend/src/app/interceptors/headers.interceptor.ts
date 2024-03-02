import { Token } from './../../../../sco-telegram-bot-tester-backend/src/modules/auth/class/token';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateService } from '../shared/translate/translate.service';
import { Select } from '@ngxs/store';
import { AuthState } from '../modules/auth/store/auth.state';

@Injectable({ providedIn: 'root' })
export class HeadersInterceptor implements HttpInterceptor {

  @Select(AuthState.token) token$: Observable<Token>;
  token: Token;

  constructor(private readonly translateService: TranslateService) {
    this.token$.subscribe((token: Token) => {
      this.token = token;
    });
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    try {
      const setHeaders: any = {
        ClientLanguage: this.translateService.getLanguage() 
          || this.translateService.translateConstants.DEFAULT_LANGUAGE,
      }

      if (this.token) {
        setHeaders.Authorization = `Bearer ${this.token.accessToken}`;
      }

      request = request.clone({
        setHeaders: setHeaders,
      });
    } catch (err) {
      console.error(err);
    } finally {
      return next.handle(request);
    }
  }
}
