const fs = require('fs');
const path = require('path');

// Читаем .env файл напрямую
const envPath = path.resolve(__dirname, '.env');
let apiUrl = 'https://trmstst.air-astana.net';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/^NG_APP_API_URL=(.+)$/m);
  if (match) {
    apiUrl = match[1].trim().replace(/\/api\/?$/, '');
  }
}

console.log(`[Proxy] API target: ${apiUrl}`);

module.exports = {
  '/api': {
    target: apiUrl,
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
  },
};
