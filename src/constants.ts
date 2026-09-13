import * as config from './config.production';

// Handle both ES6 exports and CommonJS module.exports (which Babel/Webpack wraps in .default)
const resolveConfig = (key: string) => {
  // @ts-ignore
  return config[key] ?? (config.default ? config.default[key] : undefined);
};

export const GITHUB_CLIENT_ID = resolveConfig('GITHUB_CLIENT_ID');
export const GITHUB_REDIRECT_URI = resolveConfig('GITHUB_REDIRECT_URI');
export const OAUTH_SERVER_URL = resolveConfig('OAUTH_SERVER_URL') || 'https://leetsync-oauth.vercel.app'; // Placeholder default
