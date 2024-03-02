import { Injectable } from '@angular/core';
import { FormsError } from './forms-errors.model';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormsService {

  constructor() { }

  public existError(formControlName: string, formErrors: FormsError[]): boolean {
    if (!formControlName) {
      return false;
    }

    if (!formErrors || (formErrors && formErrors.length == 0)) {
      return false;
    }

    if (!formErrors.find(e => e.formControlName == formControlName)) {
      return false;
    }

    return true;
  }

  public setErrors(form: FormGroup, formErrors: FormsError[]): FormGroup {
    if (!form) {
      return undefined;
    }

    const keys: string[] = Object.keys(form.controls);
    if (!keys || (keys && keys.length == 0)) {
      return form;
    }

    for (const control of keys) {
      const controlError = formErrors.find(e => e.formControlName == control);
      if (controlError) {
        form.controls[control].setErrors({'incorrect': true});
      } else {
        form.controls[control].setErrors(undefined);
      }
    }

    return form;
  }

  public getError(formControlName: string, formErrors: FormsError[]): string {
    if (!formControlName) {
      return undefined;
    }

    if (!formErrors || (formErrors && formErrors.length == 0)) {
      return undefined;
    }

    const formError: FormsError = formErrors.find(e => e.formControlName == formControlName);
    if (!formError) {
      return undefined;
    }

    return formError.error;
  }

  public cleanErrors(form: FormGroup): FormGroup {
    form.reset();

    const keys: string[] = Object.keys(form.controls);
    if (keys && keys.length > 0) {
      for (const control of keys) {
        form.controls[control].setErrors(undefined);
      }
    }

    return form;
  }

  public touchEmptyControls(form: FormGroup): FormGroup {
    const keys: string[] = Object.keys(form.controls);
    if (keys && keys.length > 0) {
      for (const control of keys) {
        if (
          form.controls[control].value != undefined 
          && form.controls[control].value != null 
          && form.controls[control].value != ''
        ) {
          continue;
        } 

        form.controls[control].markAllAsTouched();
      }
    }

    return form;
  }
}
