import { Injectable } from '@angular/core';
import { SpinnerConstants } from './spinner.constants';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  private _show: boolean;
  public readonly spinnerConstants = SpinnerConstants;

  constructor() { 
    this._show = false;
  }

  public getShow(): boolean {
    return this._show;
  }

  public showSpinner(): void {
    this._show = true;
  }

  public hideSpinner(): void {
    setTimeout(() => {
      this._show = false;
    }, 500);
  }
}
