import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions, Server } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as https from 'https';

export class WebsocketAdapter extends IoAdapter {
    
    constructor(
        private readonly app: INestApplicationContext,
        private readonly configService: ConfigService,
    ) {
        super(app);
    }

    createIOServer(port: number, options?: ServerOptions) {
        const envOrigin: string = this.configService.get('websocket.origin');
        const origin = this.formatOrigin(envOrigin);
        const env_ws_port = this.configService.get('websocket.port') || 8080;

        const ssl_path: string = this.configService.get('app.sslPath');
        if (!ssl_path) {
            port = env_ws_port;
            options.cors = { 
                origin : origin && origin.length > 0 ? origin : '*',
                credentials: true,
            }; 
           
            return super.createIOServer(port, options);
        }
        
        const domain: string = this.configService.get('app.host');
        const sv_options: https.ServerOptions = {
            cert: fs.readFileSync(`${ssl_path}/${domain}/fullchain.pem`),
            key: fs.readFileSync(`${ssl_path}/${domain}/privkey.pem`),
        };

        const socketOptions: any = { 
            path: "/socket.io/",
            cors: {
              origin: origin && origin.length > 0 ? origin : '*', 
              methods: ["GET", "POST"],
              credentials: true
            },
            allowEIO3: true,
        };

        const server = https.createServer(sv_options);
        const io = new Server(server, socketOptions);

        server.listen(env_ws_port);
        return io;
    }

    formatOrigin(envOrigin: string): string[] {

        let origin: string[] = [];
        if (envOrigin && envOrigin.length > 0) {
            origin = [envOrigin];

            if (envOrigin.includes(',')) {
                origin = envOrigin.split(',');
            }
        }

        return origin;
    }
}