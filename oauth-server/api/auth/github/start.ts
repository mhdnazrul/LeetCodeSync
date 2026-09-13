import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';
import crypto from 'crypto';

const kv = Redis.fromEnv();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const extensionRedirectUrl = req.query.extension_redirect_url as string;
  if (!extensionRedirectUrl) {
    return res.status(400).json({ error: 'Missing extension_redirect_url parameter' });
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = process.env.GITHUB_CALLBACK_URL;

  if (!clientId || !redirectUri) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // Generate a cryptographically secure random state
  const state = crypto.randomUUID();

  // Store the state in KV with a 5-minute expiration (300 seconds), along with the dynamic extension redirect URL
  await kv.set(`state:${state}`, { extensionRedirectUrl }, { ex: 300 });

  // Construct the GitHub authorization URL
  const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
  githubAuthUrl.searchParams.set('client_id', clientId);
  githubAuthUrl.searchParams.set('redirect_uri', redirectUri);
  githubAuthUrl.searchParams.set('scope', 'repo');
  githubAuthUrl.searchParams.set('state', state);

  // Redirect the browser to GitHub
  return res.redirect(302, githubAuthUrl.toString());
}
