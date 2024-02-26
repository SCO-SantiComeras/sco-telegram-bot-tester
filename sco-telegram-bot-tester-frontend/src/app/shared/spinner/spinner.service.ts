import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  private _show: boolean;

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
    this._show = false;
  }
}
