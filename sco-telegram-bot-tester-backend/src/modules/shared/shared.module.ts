import { Module } from '@nestjs/common';
import { ControllerService } from './services/controller.service';
import { BcryptService } from './services/bcrypt.service';
import { TranslateService } from './translate/translate.service';

@Module({
  providers: [
    ControllerService,
    BcryptService,
    TranslateService,
  ],
  exports: [
    ControllerService,
    BcryptService,
    TranslateService,
  ],
})
export class SharedModule {}
