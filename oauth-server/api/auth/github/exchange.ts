import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Setup CORS to allow the Chrome Extension to call this endpoint
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins for the extension
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { ticket } = req.body || {};

    if (!ticket || typeof ticket !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid ticket parameter' });
    }

    const ticketKey = `ticket:${ticket}`;
    const accessToken = await kv.get(ticketKey);

    if (!accessToken) {
      return res.status(403).json({ error: 'Invalid or expired ticket' });
    }

    // Single-use: Immediately invalidate the ticket after successful consumption
    await kv.del(ticketKey);

    // Return the GitHub access token to the extension securely
    return res.status(200).json({ access_token: accessToken });
  } catch (error) {
    console.error('OAuth Exchange Error:', error);
    return res.status(500).json({ error: 'Internal server error during ticket exchange' });
  }
}
