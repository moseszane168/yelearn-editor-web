let baseURL;
console.log('NODE_ENV: ',process.env.NODE_ENV);

switch (process.env.NODE_ENV) {
  case 'dev':
    baseURL = 'http://127.0.0.1:8081/v1';
    break;

  case 'test':
    baseURL = 'http://127.0.0.1:8081/v1';
    break;

  case 'prod':
    baseURL = 'http://120.24.24.107:8081/v1';
    break;

  default:
    baseURL = 'http://127.0.0.1:8081/v1';
    break;
}

export default {
  baseURL
}