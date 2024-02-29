import { httpErrorMessages } from './../../constants/http-error-messages.constants';
import { Controller, Res, Get, Req, HttpException, HttpStatus } from "@nestjs/common";
import { TranslateService } from "../shared/translate/translate.service";
import { Response, Request } from 'express';
import { ConfigService } from "@nestjs/config";
import { ApiTags } from '@nestjs/swagger';

@Controller('api/v1/dummy')
@ApiTags('Controlador de pruebas')
export class DummyController {

  constructor(
    private readonly configService: ConfigService,
    private readonly translateService: TranslateService,
  ) {}

  @Get()
  async dummy(@Req() req: Request, @Res() res: Response): Promise<Response<boolean, Record<string, boolean>>> {
    const isProduction: boolean = this.configService.get('app.production');
    if (isProduction) {
      console.log(`[dummy] isProduction: ${isProduction}`);
      throw new HttpException(httpErrorMessages.APP.METHOD_NOT_ALLOWED, HttpStatus.METHOD_NOT_ALLOWED);
    }

    const lang: string = req && req.headers && req.headers.clientlanguage ? req.headers.clientlanguage.toString() : undefined;
    const translate: string = this.translateService.getTranslate('label.hello', lang);
    console.log(`[dummy] translate: ${translate}`);

    return res.status(200).json(true);
  }
}
  