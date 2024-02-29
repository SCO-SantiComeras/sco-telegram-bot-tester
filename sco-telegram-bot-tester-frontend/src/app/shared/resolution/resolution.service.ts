import { Injectable } from '@angular/core';
import { ResolutionConstants } from './resolution.constants';

@Injectable({
  providedIn: 'root'
})
export class ResolutionService {

  private _mode: string;
  public readonly resolutionConstants = ResolutionConstants;

  constructor() { }

  getMode(width: number = undefined): string {
    this.calculateMode(width);
    return this._mode;
  }

  private setMode(mode: string) {
    this._mode = mode;
  }

  private async calculateMode(width: number = undefined): Promise<void> {
    if (width == undefined) {
      width = window.innerWidth;
    }
    
    let currentMode: string = this.resolutionConstants.WEB;
    if (width >= this.resolutionConstants.MOBILE_MIN && width < this.resolutionConstants.MOBILE_MAX) {
      currentMode = this.resolutionConstants.MOBILE;
    } else if (width >= this.resolutionConstants.TABLET_MIN && width < this.resolutionConstants.TABLET_MAX) {
      currentMode = this.resolutionConstants.TABLET;
    } else if (width >= this.resolutionConstants.WEB_MIN && width < this.resolutionConstants.WEB_MAX) {
      currentMode = this.resolutionConstants.WEB;
    }

    this.setMode(currentMode);
  }
}
