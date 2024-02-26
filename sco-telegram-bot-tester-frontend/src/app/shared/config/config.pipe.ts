import { ConfigService } from './config.service';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appConfig'
})
export class ConfigPipe implements PipeTransform {

  constructor(private readonly config: ConfigService) {}

  transform(path: string): any {
    return this.config.getData(path);
  }
}
