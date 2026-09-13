# LeetCodeSync OAuth Backend

This directory contains the secure, stateless Vercel serverless backend that handles GitHub OAuth for the Chrome Extension. It safely exchanges authorization codes for tokens without exposing the `GITHUB_CLIENT_SECRET` to the frontend.

## Architecture
- `GET /api/auth/github/start`: Generates a random OAuth state, stores it in Vercel KV, and redirects the user to the GitHub authorization page.
- `GET /api/auth/github/callback`: GitHub's callback endpoint. It validates the state, exchanges the code for a GitHub access token, stores the token securely in Vercel KV under a single-use ticket, and redirects the browser back to the Chrome extension.
- `POST /api/auth/github/exchange`: Called directly by the Chrome Extension to exchange the short-lived, single-use ticket for the GitHub access token.

## Requirements
- Node.js & Vercel CLI (`npm i -g vercel`)
- A GitHub OAuth App
- Vercel KV (Redis) linked to your project

## Setup & Deployment

1. **Deploy to Vercel**: 
   Inside the `oauth-server` directory, run:
   ```bash
   npm i
   vercel
   ```
2. **Add Vercel KV**: 
   Go to your project dashboard on Vercel > Storage > Create a KV database and link it to this project. This will automatically populate the `KV_REST_API_*` environment variables.
3. **Set Environment Variables**:
   Go to your project settings in Vercel and add:
   - `GITHUB_CLIENT_ID`: Your GitHub OAuth App Client ID
   - `GITHUB_CLIENT_SECRET`: Your GitHub OAuth App Client Secret
   - `GITHUB_CALLBACK_URL`: `https://YOUR-VERCEL-DOMAIN/api/auth/github/callback`
   - `EXTENSION_ID`: Your Chrome Extension ID (e.g. `abcdefghijklmnopqrstuvwxyz123456`)
4. **Configure GitHub OAuth App**:
   - Application name: LeetCodeSync
   - Homepage URL: Your repository URL
   - Authorization callback URL: `https://YOUR-VERCEL-DOMAIN/api/auth/github/callback`
