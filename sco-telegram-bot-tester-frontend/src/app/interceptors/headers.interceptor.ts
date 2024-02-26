import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateService } from '../shared/translate/translate.service';
import { translateConstants } from '../shared/translate/translate.consntats';

@Injectable({ providedIn: 'root' })
export class HeadersInterceptor implements HttpInterceptor {

  constructor(private readonly translateService: TranslateService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    try {
      request = request.clone({
        setHeaders: {
          ClientLanguage: this.translateService.getLanguage() || translateConstants.DEFAULT_LANGUAGE,
        }
      });
    } catch (err) {
      console.error(err);
    } finally {
      return next.handle(request);
    }
  }
}
