import { Injectable } from "@nestjs/common";
import * as fs from 'fs';
import { translateConstants } from "./translate.constants";

@Injectable()
export class TranslateService {

  private _loaded: boolean;
  private _currentLang: string;
  private _data: any;

  constructor() {
    this.initialize();
  }

  public getTranslate(message: string, language: string = translateConstants.DEFAULT_LANGUAGE): string {
    if (!this._loaded || this._loaded && language != this._currentLang) {
      this.setData(language);
    }
    return this._data[message] ? this._data[message] : '';
  }

  private setData(language: string = translateConstants.DEFAULT_LANGUAGE): void {
    this.initialize();

    new Promise((resolve) => {
      if (language != translateConstants.DEFAULT_LANGUAGE) {
        const languageValues: string[] = Object.values(translateConstants.LANGUAGES);
        const existLanguage: string = languageValues.find(l => l == language);
        if (!existLanguage) {
          language = translateConstants.DEFAULT_LANGUAGE;
        }
      }
  
      try {
        this._data = JSON.parse(fs.readFileSync(`./i18n/${language}.json`, 'utf8'));
        if (this._data != undefined) {
          this._loaded = true;
          this._currentLang = language;
          resolve(true);
        }

        resolve(false);
      } catch(error) {
        console.log(`[TranslateService] Error: ${JSON.stringify(error)}`);
        resolve(false);
      }
    });
  }

  private initialize() {
    this._loaded = false;
    this._currentLang = '';
    this._data = undefined;
  }
}
