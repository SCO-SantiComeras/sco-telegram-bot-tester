import { SharedModule } from './shared/shared.module';
import { TranslateService } from './shared/translate/translate.service';
import { ConfigService } from './shared/config/config.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxsModule } from '@ngxs/store';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { WebSocketService } from './websocket/websocket.service';
import { HeadersInterceptor } from './interceptors/headers.interceptor';
import { TelegramBotTesterModule } from './modules/telegram-bot-tester/telegram-bot-tester.module';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export function configFactory(provider: ConfigService) {
  return () => provider.getDataFromJson('assets/config/data.json');
}

export function translateFactory(provider: TranslateService) {
  return () => provider.getData('assets/i18n/');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NgxsModule.forRoot([], { developmentMode: !environment.production }),
    SharedModule,
    TelegramBotTesterModule.forRoot(),
    MatSidenavModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    WebSocketService,
    {
      provide: APP_INITIALIZER,
      useFactory: configFactory,
      deps: [ConfigService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: translateFactory,
      deps: [TranslateService],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeadersInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
