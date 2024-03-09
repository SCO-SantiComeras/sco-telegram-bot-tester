
import { Injectable, NestMiddleware } from '@nestjs/common';
import * as path from 'path';

const allowedExt = [
  '.js',
  '.ico',
  '.css',
  '.png',
  '.jpg',
  '.jpeg',
  '.woff2',
  '.woff',
  '.ttf',
  '.svg',
  '.mp4',
  '.mp3',
  '.gif',
  '.txt',
  '.html',
  '.csv',
  '.xml',
  '.pdf',
];

const resolvePath = (file: string) => path.resolve(`./public/${file}`);

@Injectable()
export class PublicMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const { baseUrl } = req;
    if (baseUrl.indexOf(`api/v1`) === 1) {
      // it starts with /api --> continue with execution
      next();
    } else if (baseUrl.indexOf(`public/`) === 1) {
      // it is a file previously uploaded
      res.sendFile(resolvePath(decodeURI(baseUrl)));
    } else if (allowedExt.filter(ext => baseUrl.indexOf(ext) > 0).length > 0) {
      // it has a file extension --> resolve the file
      res.sendFile(resolvePath(baseUrl));
    } else {
      // in all other cases, redirect to the index.html!
      res.sendFile(resolvePath('index.html'));
    }
  }
}
