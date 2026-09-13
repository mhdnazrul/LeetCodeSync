import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, state, error: githubError, error_description } = req.query;

  // Handle errors returned by GitHub (e.g. user denied authorization)
  if (githubError) {
    return res.status(400).json({
      error: 'GitHub authorization failed',
      details: error_description || githubError,
    });
  }

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Missing code parameter' });
  }

  if (!state || typeof state !== 'string') {
    return res.status(400).json({ error: 'Missing state parameter' });
  }

  // Verify and consume the state
  const stateKey = `state:${state}`;
  const validState = await kv.get(stateKey);
  
  if (!validState) {
    return res.status(403).json({ error: 'Invalid or expired state parameter' });
  }
  
  // Single-use: delete state immediately
  await kv.del(stateKey);

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const redirectUri = process.env.GITHUB_CALLBACK_URL;
  const extensionId = process.env.EXTENSION_ID;

  if (!clientId || !clientSecret || !redirectUri || !extensionId) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // Exchange the code for an access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error || !tokenData.access_token) {
      return res.status(401).json({
        error: 'Token exchange failed',
        details: tokenData.error_description || tokenData.error || 'No access token returned',
      });
    }

    // Generate a single-use authorization ticket
    const ticket = crypto.randomUUID();

    // Store the access token against the ticket with a 2-minute expiration
    await kv.set(`ticket:${ticket}`, tokenData.access_token, { ex: 120 });

    // Redirect the browser back to the Chrome Extension
    // chrome.identity.launchWebAuthFlow handles this redirect automatically
    const extensionRedirectUrl = `https://${extensionId}.chromiumapp.org/?ticket=${ticket}`;
    return res.redirect(302, extensionRedirectUrl);

  } catch (error) {
    console.error('OAuth Callback Error:', error);
    return res.status(500).json({ error: 'Internal server error during token exchange' });
  }
}
