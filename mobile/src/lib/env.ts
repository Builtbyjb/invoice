export type AppEnv = 'development' | 'staging' | 'production';

const BASE_URLS: Record<AppEnv, string> = {
  development: 'http://localhost:8585',
  staging: 'https://invoice-server-staging.acorp.app',
  production: 'https://invoice-server.acorp.app',
};

function readAppEnv(): AppEnv {
  const value = process.env.EXPO_PUBLIC_APP_ENV;
  if (value === 'development' || value === 'staging' || value === 'production') return value;
  return __DEV__ ? 'development' : 'production';
}

export const APP_ENV: AppEnv = readAppEnv();

export const API_BASE_URL: string = process.env.EXPO_PUBLIC_API_URL || BASE_URLS[APP_ENV];

if (__DEV__) {
  console.log(`[env] APP_ENV=${APP_ENV} API_BASE_URL=${API_BASE_URL}`);
}
