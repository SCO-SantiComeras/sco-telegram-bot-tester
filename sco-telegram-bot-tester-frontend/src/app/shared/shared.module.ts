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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AddEditUsersDialogComponent } from './dialogs/add-edit-users-dialog/add-edit-users-dialog.component';
import { ToastComponent } from './toast/toast/toast.component';

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
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSelectModule,
  ],
  declarations: [
    ConfigPipe,
    TranslatePipe,
    JoinPipe,
    ConfirmDialogComponent,
    AddEditUsersDialogComponent,
    ToastComponent,
  ],
  exports: [
    ConfigPipe,
    TranslatePipe,
    JoinPipe,
    ConfirmDialogComponent,
    AddEditUsersDialogComponent,
    ToastComponent,
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
