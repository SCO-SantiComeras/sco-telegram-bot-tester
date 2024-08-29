export const environment = {
  name: 'dev',
  production: false,
  apiUrl: `http://localhost:3000/api/v1`,
  socketUrl: `ws://localhost:3001`,
  httpsEnabled: false,
};

environment.apiUrl = !environment.httpsEnabled
  ? environment.apiUrl
  : environment.apiUrl.replace('http', 'https');

  environment.socketUrl = !environment.httpsEnabled
  ? environment.socketUrl
  : environment.socketUrl.replace('ws', 'wss');