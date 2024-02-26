import { Injectable } from "@nestjs/common";
import * as fs from 'fs';
import { translateConstants } from "./translate.constants";

@Injectable()
export class TranslateService {

  private _data: any;

  constructor() { }

  public getTranslate(message: string, language: string = translateConstants.DEFAULT_LANGUAGE): string {
    this.setData(language);
    return this._data[message] ? this._data[message] : '';
  }

  private setData(language: string = translateConstants.DEFAULT_LANGUAGE): void {
    new Promise((resolve) => {
      if (language != translateConstants.DEFAULT_LANGUAGE) {
        const languageValues: string[] = Object.values(translateConstants.LANGUAGES);
        const existLanguage: string = languageValues.find(l => l == language);
        if (!existLanguage) {
          language = translateConstants.DEFAULT_LANGUAGE;
        }
      }
  
      this._data = JSON.parse(fs.readFileSync(`./i18n/${language}.json`, 'utf8'));
      resolve(true);
    });
  }
}
