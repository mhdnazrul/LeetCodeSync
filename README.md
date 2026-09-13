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

To securely connect your GitHub account, LeetCodeSync utilizes GitHub OAuth. Because a Chrome extension runs directly in the browser, storing a client secret in the extension bundle is a security risk. Therefore, this extension requires a backend proxy to handle the OAuth token exchange securely.

### Environment Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in the required fields:
   - `REACT_APP_GITHUB_CLIENT_ID`: The Client ID of your GitHub OAuth App.

> **Important:** With the modern PKCE flow, no backend proxy is required, and no client_secret is needed.

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
