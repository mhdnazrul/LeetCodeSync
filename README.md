# LeetCodeSync

LeetCodeSync is a Chrome extension that enables you to automatically synchronize your LeetCode problem submissions with a selected GitHub repository. This tool helps you easily track your coding progress and build a portfolio of your algorithmic solutions on GitHub without any manual copy-pasting.

> **Note:** This project is a rebranded and modified derivative of the original [LeetSync](https://github.com/LeetSync/LeetSync) project. It preserves the core synchronization logic while introducing enhanced security configurations for GitHub authentication.

## Features

- **Automated Sync**: Automatically pushes your accepted LeetCode solutions to a GitHub repository of your choice.
- **Language Support**: Works seamlessly with multiple programming languages available on LeetCode.
- **Submission Details**: Commit messages and file contents include problem stats (runtime, memory usage).

## Installation

### From Source (Developer Mode)

1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/mhdnazrul/LeetCodeSync.git
   cd LeetCodeSync
   ```
2. Set up your environment variables (see [GitHub Authentication Setup](#github-authentication-setup)).
3. Install the required dependencies:
   ```bash
   npm install
   ```
4. Build the extension:
   ```bash
   npm run build
   ```
5. Open Chrome and navigate to `chrome://extensions/`.
6. Enable **Developer mode** in the top right corner.
7. Click on **Load unpacked** and select the `build` folder generated inside the project directory.

## GitHub Authentication Setup

LeetCodeSync uses a secure, stateless Vercel-backed OAuth flow to authenticate users.

### For End Users
**You do not need to configure anything!**
Simply install the extension, click "Login with GitHub", authorize the app, and you're done. You do not need to create your own GitHub OAuth App or generate any tokens.

### For Developers (Self-Hosting / Modifying)
If you are developing or deploying your own version of LeetCodeSync, you must set up the OAuth backend yourself to keep the `GITHUB_CLIENT_SECRET` out of the Chrome extension bundle.

#### 1. Extension Configuration
Copy the configuration template:
```bash
cp src/config.example.js src/config.production.js
```
Edit `src/config.production.js` with your GitHub Client ID and your deployed Vercel Backend URL (e.g., `https://your-vercel-domain.vercel.app`). Do **not** put your client secret here.

#### 2. Deploying the Vercel Backend
The Vercel backend (`/oauth-server`) securely exchanges the OAuth code for an access token using a single-use ticket stored in Vercel KV.

1. Navigate to the `oauth-server` directory.
2. Run `vercel` to deploy the backend.
3. In your Vercel project dashboard, go to **Storage** and create/link a **Vercel KV (Redis)** database.
4. In your Vercel project settings, add the following Environment Variables:
   - `GITHUB_CLIENT_ID`: Your GitHub App Client ID
   - `GITHUB_CLIENT_SECRET`: Your GitHub App Client Secret
   - `GITHUB_CALLBACK_URL`: `https://your-vercel-domain.vercel.app/api/auth/github/callback`
   - `EXTENSION_ID`: Your Chrome Extension ID (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

#### 3. GitHub OAuth App Setup
In your GitHub Developer Settings, configure your OAuth App:
- **Homepage URL**: Your repository or project website URL
- **Authorization callback URL**: The URL to your Vercel backend callback endpoint (e.g., `https://your-vercel-domain.vercel.app/api/auth/github/callback`). Do NOT use `https://github.com/?referrer=leetsync`.

## Usage

1. Open the LeetCodeSync extension popup in Chrome.
2. Click **Authenticate with GitHub**. You will be redirected to authorize the application.
3. Once authenticated, select the GitHub repository where you want your submissions to be saved.
4. Go to LeetCode, solve a problem, and submit it.
5. LeetCodeSync will automatically detect a successful submission and push the code directly to your linked GitHub repository.

## Permissions

The extension requires the following permissions to function correctly:
- `tabs`: To interact with the LeetCode tab and track submission status.
- `storage` / `unlimitedStorage`: To save your GitHub access token and repository configuration locally.
- `cookies`: Required to authenticate with the LeetCode API.
- `webRequest`: To intercept and analyze LeetCode submission network requests.
- `host_permissions` for `https://leetcode.com/*`: To inject the synchronization script.

## Development and Testing

### Running Tests
To run the automated test suite:
```bash
npm test
```

### Type Checking
Ensure there are no TypeScript errors:
```bash
npm run typecheck
```

### Linting
Check for code formatting and stylistic errors:
```bash
npm run lint
```

## License

This project is licensed under the [MIT License](LICENSE).
