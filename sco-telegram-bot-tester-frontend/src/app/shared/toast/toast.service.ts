import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastConstants } from './toast.constants';
import { TranslateService } from '../translate/translate.service';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ResolutionService } from '../resolution/resolution.service';
import { ResolutionConstants } from '../resolution/resolution.constants';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private readonly snackBarService: MatSnackBar,
    private readonly translateService: TranslateService,
    private readonly resolutionService: ResolutionService,
  ) { }

  addSuccessMessage(message: string) {
    this.openSnackBar(message, ToastConstants.SUCCESS_PANEL_CLASS);
  }

  addErrorMessage(message: string) {
    this.openSnackBar(message, ToastConstants.ERROR_PANEL_CLASS);
  }

  addWarningMessage(message: string) {
    this.openSnackBar(message, ToastConstants.WARNING_PANEL_CLASS);
  }

  addInfoMessage(message: string) {
    this.openSnackBar(message, ToastConstants.INFO_PANEL_CLASS);
  }

  private openSnackBar(message: string, panelClass: string) {
    const verticalPosition: MatSnackBarVerticalPosition = this.resolutionService.getMode() == ResolutionConstants.WEB
      ? ToastConstants.VERTICAL_POSITION_TOP as MatSnackBarVerticalPosition
      : ToastConstants.VERTICAL_POSITION_BOTTOM as MatSnackBarVerticalPosition;

    const horizontalPosition: MatSnackBarHorizontalPosition = this.resolutionService.getMode() == ResolutionConstants.WEB
      ? ToastConstants.HORIZONTAL_POSITION_RIGHT as MatSnackBarHorizontalPosition
      : ToastConstants.HORIZONTAL_POSITION_CENTER as MatSnackBarHorizontalPosition;

    this.snackBarService.open(message, this.translateService.getTranslate('label.toast.action.close'), {
      duration: 3000,
      panelClass: [panelClass],
      verticalPosition: verticalPosition,
      horizontalPosition: horizontalPosition,
    });
  }
}
