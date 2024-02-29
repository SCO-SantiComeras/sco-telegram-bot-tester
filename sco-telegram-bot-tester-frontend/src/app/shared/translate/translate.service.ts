import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { translateConstants } from './translate.consntats';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {

  private _data: any;
  private _language: string;
  public readonly translateConstants = translateConstants;

  constructor(private readonly http: HttpClient) {
    this.setLanguage();
  }

  public getLanguage(): string {
    return this._language;
  }

  public getData(path: string) {
    return new Promise((resolve, reject) => {
      let language: string = this.setLanguage();

      this.http.get(`${path}${language}.json`).subscribe({
        next: (data) => {
          this._data = data;
          resolve(true);
        },
        error: (error) => {
          reject(true);
        }
      })
    });
  }

  public getTranslate(word: string) {
    return this._data[word];
  }

  private setLanguage(): string {
    let language: string = navigator.language;

    if (navigator.language.includes('-')) {
      language = navigator.language.split('-')[0];
    }

    if (!language) {
      language = translateConstants.DEFAULT_LANGUAGE;
    }

    const languages: string[] = Object.values(translateConstants.LANGUAGES);
    if (!languages || (languages && languages.length == 0)) {
      language = translateConstants.DEFAULT_LANGUAGE;
    } else {
      const existLanguage: string = languages.find(l => l == language);
      if (!existLanguage) {
        language = translateConstants.DEFAULT_LANGUAGE;
      }
    }

    this._language = language;
    return this._language
  }
}
