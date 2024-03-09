import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './modules/logger/logger.service';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus, ValidationError, ValidationPipe } from '@nestjs/common';
import { WebsocketAdapter } from './modules/websocket/adapter/websocket-adapter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, 
    { 
      logger: new LoggerService(),
      httpsOptions: undefined
    }
  );

  const configService = app.get<ConfigService>(ConfigService);

  let swaggeer: boolean = false;
  const swaggerRoute: string = 'api';
  if (!configService.get('app.production')) {
    const swagger = new DocumentBuilder()
    .setTitle('SCO - Telegram Bot Tester')
    .setDescription('Documentación sobre endpoints de la aplicación Telegram bot tester')
    .setVersion('1.0')
    .addTag('SCO')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

    const document = SwaggerModule.createDocument(app, swagger);
    SwaggerModule.setup(swaggerRoute, app, document);

    swaggeer = true;
  }

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const errors = Object.values(validationErrors[0].constraints).join(',');
        const splitErrors: string[] = errors.split(',');
        throw new HttpException(splitErrors[splitErrors.length-1], HttpStatus.BAD_REQUEST);
      },
    }),
  );

  const envOrigin: string = configService.get('websocket.origin');
  let origin: string[] = [];
  if (envOrigin && envOrigin.length > 0) {
    origin = [envOrigin];

    if (envOrigin.includes(',')) {
      origin = envOrigin.split(',');
    }
  }
  
  app.enableCors({
    origin: origin,
    credentials: true,
  });

  app.useWebSocketAdapter(new WebsocketAdapter(app, configService));
  
  const port: number = configService.get('app.port') || 3000;
  const host: string = configService.get('app.host') || 'localhost';

  await app.listen(port);
  if (swaggeer) console.log(`[bootstrap] Swagger started in url 'http://${host}:${port}/${swaggerRoute}'`);
  console.log(`[bootstrap] App started in 'http://${host}:${port}'`);
}
bootstrap();
