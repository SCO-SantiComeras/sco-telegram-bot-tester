import { Injectable } from '@angular/core';
import { httpErrorMessages } from './http-error-messages.constants';
import { TranslateService } from '../translate/translate.service';
import { httpErrorMessageTranslates } from './http-error-message-translates.constants';

export const DEFAULT_LANGUAGE_KEY: string = 'EN';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorsService {

  constructor(private readonly translateService: TranslateService) { }

  public getErrorMessage(errorMessage: string): string {
    if (!errorMessage) {
      return '';
    }

    const errorKey: string = this.getErrorKey(errorMessage);
    if (!errorKey) {
      return '';
    }

    const translateKey: string = this.getTranslateKey();
    const translates = this.getTranslates(translateKey);
    if (!translates || (translates && translates.length == 0)) {
      return '';
    }

    return this.getErrorTranslate(translates, errorKey);
  }

  private getErrorKey(errorMessage: string): string {
    let values = [];
    for (const error of Object.values(httpErrorMessages)) {
      for (const value of Object.entries(error)) {
        values.push(value)
      }
    }

    let errorKey: string = undefined;
    for (const value of values) {
      const existError = value.find((v: string) => v == errorMessage);
      if (existError) {
        errorKey = value[0];
        break;
      }
    }

    return errorKey;
  }

  private getTranslateKey(): string {
    const currentLanguage: string = this.translateService.getLanguage();
    const findTrasnalteKey = Object.keys(httpErrorMessageTranslates).find(k => k == currentLanguage.toUpperCase());

    let translateKey: string = DEFAULT_LANGUAGE_KEY;
    if (currentLanguage && findTrasnalteKey) {
      translateKey = findTrasnalteKey;
    }

    return translateKey;
  }

  private getTranslates(translateKey: string) {
    let translates = [];
    for (const error of Object.values(httpErrorMessageTranslates[translateKey])) {
      for (const value of Object.entries(error)) {
        translates.push(value);
      }
    }

    return translates;
  }

  private getErrorTranslate(translates, errorKey: string): string {
    let errorTranslate: string = '';

    for (const translate of translates) {
      const existError = translate.find((v: string) => v == errorKey);
      if (existError) {
        errorTranslate = translate[1];
        break;
      }
    }
    return errorTranslate;
  }
}
