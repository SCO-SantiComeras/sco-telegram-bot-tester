import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appJoin'
})

export class JoinPipe implements PipeTransform {

  transform(value: string[], separator: string = ','): any {
    if (!value) {
      return '';
    }

    return value.join(separator);
  }

}
