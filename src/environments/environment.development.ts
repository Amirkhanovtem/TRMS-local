export const environment = {
  production: false,
  name: 'development',
  envVar: {
    apiBaseUrl: import.meta.env.NG_APP_API_URL,
    keycloakUrl: 'https://id-test.airastana.com/',
    appUrl: 'http://localhost:4200/',
    realm: 'air-astana',
    clientId: 'app-trms-api',
    inActiveLogout: '7200000',
  },
};
