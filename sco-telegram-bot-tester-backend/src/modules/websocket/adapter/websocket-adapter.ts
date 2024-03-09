import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { ConfigService } from '@nestjs/config';

export class WebsocketAdapter extends IoAdapter {
    constructor(
        private readonly app: INestApplicationContext,
        private readonly configService: ConfigService,
    ) {
        super(app);
    }

    createIOServer(port: number, options?: ServerOptions) {
        const envOrigin: string = this.configService.get('websocket.origin');
        let origin: string[] = [];
        if (envOrigin && envOrigin.length > 0) {
            origin = [envOrigin];

            if (envOrigin.includes(',')) {
                origin = envOrigin.split(',');
            }
        }
        
        port = this.configService.get('websocket.port') || 8080;
        options.cors = { 
            origin : origin,
            credentials: true,
        }; 
       
        return super.createIOServer(port, options);
    }
}