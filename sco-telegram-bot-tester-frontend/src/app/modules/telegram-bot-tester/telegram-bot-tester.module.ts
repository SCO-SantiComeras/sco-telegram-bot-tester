import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TelegramBotTesterComponent } from './component/telegram-bot-tester.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { NgxsModule } from '@ngxs/store';
import { TelegramBotTesterState } from './store/telegram-bot-tester.state';
import { TelegramBotTesterService } from './telegram-bot-tester.service';

export function throwIfAlreadyLoaded(parentModule: any, moduleName: string) {
  if (parentModule) {
    throw new Error(`${moduleName} has already been loaded. Import ${moduleName} modules in the AppModule only.`);
  }
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,

    NgxsModule.forFeature(
      [
        TelegramBotTesterState,
      ]
    ),
  ],
  declarations: [
    TelegramBotTesterComponent
  ],
  exports: [
    TelegramBotTesterComponent
  ]
})
export class TelegramBotTesterModule { 
  constructor(@Optional() @SkipSelf() parentModule: TelegramBotTesterModule) {
    throwIfAlreadyLoaded(parentModule, 'TelegramBotTesterModule');
  }

  static forRoot(): ModuleWithProviders<TelegramBotTesterModule> {
    return {
      ngModule: TelegramBotTesterModule,
      providers: [
        TelegramBotTesterService,
      ]
    };
  }
}
