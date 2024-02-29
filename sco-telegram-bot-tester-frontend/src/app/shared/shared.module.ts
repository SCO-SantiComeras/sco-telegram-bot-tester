import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsService } from './forms/forms.service';
import { CacheService } from './cache/cache.service';
import { ConfigService } from './config/config.service';
import { ConfigPipe } from './config/config.pipe';
import { ResolutionService } from './resolution/resolution.service';
import { HttpClientModule } from '@angular/common/http';
import { TranslatePipe } from './translate/translate.pipe';
import { TranslateService } from './translate/translate.service';
import { HttpErrorsService } from './http-error/http-errors.service';
import { JoinPipe } from './join/join.pipe';
import { SpinnerService } from './spinner/spinner.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ToastService } from './toast/toast.service';
import { TableService } from './table/table.service';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './dialogs/confirm-dialog/confirm-dialog.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSnackBarModule,
    MatDialogModule,
    MatButtonModule,
  ],
  declarations: [
    ConfigPipe,
    TranslatePipe,
    JoinPipe,
    ConfirmDialogComponent,
  ],
  exports: [
    ConfigPipe,
    TranslatePipe,
    JoinPipe,
    ConfirmDialogComponent,
  ],
  providers:[
    FormsService,
    CacheService,
    ConfigService,
    ResolutionService,
    TranslateService,
    HttpErrorsService,
    SpinnerService,
    ToastService,
    TableService,
  ]
})
export class SharedModule { }
