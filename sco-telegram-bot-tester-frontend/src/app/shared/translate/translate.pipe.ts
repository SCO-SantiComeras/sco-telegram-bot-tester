import { TranslateService } from './translate.service';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appTranslate'
})
export class TranslatePipe implements PipeTransform {

  constructor(private translate: TranslateService) {}

  transform(value: any): any {
    return this.translate.getTranslate(value) ? this.translate.getTranslate(value) : value;
  }
}
