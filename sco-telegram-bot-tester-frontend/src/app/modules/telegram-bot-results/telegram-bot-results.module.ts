import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { TelegramBotResultsService } from './telegram-bot-results.service';
import { TelegramBotResultsComponent } from './component/telegram-bot-results.component';
import { JoinPipe } from 'src/app/shared/join/join.pipe';
import { TelegramBotResultsState } from './store/telegram-bot-results.state';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';

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
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    
    NgxsModule.forFeature(
      [
        TelegramBotResultsState,
      ]
    ),
  ],
  declarations: [
    TelegramBotResultsComponent,
  ],
  exports: [
    TelegramBotResultsComponent,
  ]
})
export class TelegramBotResultsModule { 
  constructor(@Optional() @SkipSelf() parentModule: TelegramBotResultsModule) {
    throwIfAlreadyLoaded(parentModule, 'TelegramBotResultsModule');
  }

  static forRoot(): ModuleWithProviders<TelegramBotResultsModule> {
    return {
      ngModule: TelegramBotResultsModule,
      providers: [
        TelegramBotResultsService,
        JoinPipe,
      ]
    };
  }
}
