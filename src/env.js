let baseURL;
switch (process.env.NODE_ENV) {

  case 'test':
    baseURL = 'http://127.0.0.1:81/index.php';
    break;

  case 'prod':
    baseURL = 'http://192.168.3.206:81/index.php';
    break;
  default:
    baseURL = 'http://127.0.0.1:81/index.php';
    break;
}

export default {
  baseURL
}