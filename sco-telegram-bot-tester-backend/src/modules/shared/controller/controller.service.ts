import { Injectable } from '@nestjs/common';

@Injectable()
export class ControllerService {
  constructor() {}

  public async getParamsFromSwaggerQuery(query: string): Promise<any> {
    const filter: any = {};

    const params: string = query.trim();
    if (!params.includes('&')) {
      filter[params.split('=')[0]] = params.split('=')[1];
      return filter;
    }

    if (params.split('&') && params.split('&').length > 0) {
      params.split('&').map((request) => {
        filter[request.split('=')[0]] = request.split('=')[1];
      });
    }

    return filter;
  }
}
