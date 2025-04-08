import { google } from "googleapis";
import * as fs from "fs";
import * as path from "path";
import type { Credentials } from "google-auth-library";
import { startOAuthServer } from "./oauth-server";
import open from "open";

function saveTokensToFile(tokens: Credentials, tokenPath: string): void {
  // Normalize the path to ensure proper handling on all platforms
  const normalizedPath = path.normalize(tokenPath);

  // Ensure the directory exists
  const dirname = path.dirname(normalizedPath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }

  fs.writeFileSync(normalizedPath, JSON.stringify(tokens));
}

function loadTokensFromFile(tokenPath: string): Credentials {
  try {
    // Normalize the path
    const normalizedPath = path.normalize(tokenPath);
    return JSON.parse(fs.readFileSync(normalizedPath, "utf8"));
  } catch (err) {
    throw new Error(
      `Error loading token file: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }
}

export async function createAuthClient(): Promise<any> {
  const oauthClientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const oauthClientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const oauthTokenPath = process.env.GOOGLE_OAUTH_TOKEN_PATH
    ? path.normalize(process.env.GOOGLE_OAUTH_TOKEN_PATH)
    : undefined;
  const redirectUri =
    process.env.GOOGLE_OAUTH_REDIRECT_URI || "http://localhost:3001";

  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (oauthClientId && oauthClientSecret && oauthTokenPath) {
    const oAuth2Client = new google.auth.OAuth2(
      oauthClientId,
      oauthClientSecret,
      redirectUri
    );

    try {
      const tokens = loadTokensFromFile(oauthTokenPath);
      oAuth2Client.setCredentials(tokens);
      return oAuth2Client;
    } catch (error) {
      // Tokens not found or invalid, initiate OAuth flow and wait for completion
      await initiateOAuthFlow();
      // After flow completes, load the newly saved tokens
      const tokens = loadTokensFromFile(oauthTokenPath);
      oAuth2Client.setCredentials(tokens);
      return oAuth2Client;
    }
  } else {
    // Fallback to service account
    if (!clientEmail || !privateKey) {
      throw new Error(
        "Authentication failed: Neither OAuth nor Service Account credentials are properly configured in environment variables."
      );
    }
    return new google.auth.JWT({
      email: clientEmail,
      key: privateKey.replace(/\\n/g, "\n"),
      scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/gmail.modify",
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/tasks",
      ],
      subject: process.env.GMAIL_USER_TO_IMPERSONATE,
    });
  }
}

export async function initiateOAuthFlow(scopes?: string[]): Promise<void> {
  try {
    // Start the OAuth server to handle the callback
    const serverPromise = startOAuthServer();

    // Generate and open the consent URL
    const authUrl = generateOAuthConsentUrl(scopes);
    await open(authUrl);

    // Wait for the server to complete the flow
    await serverPromise;
  } catch (error) {
    throw error;
  }
}

export function generateOAuthConsentUrl(scopes?: string[]): string {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const redirectUri =
    process.env.GOOGLE_OAUTH_REDIRECT_URI || "http://localhost:3001";

  if (!clientId || !clientSecret) {
    throw new Error(
      "OAuth client ID and secret are required in environment variables"
    );
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes || [
      "https://www.googleapis.com/auth/gmail.modify",
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/tasks",
    ],
    prompt: "consent",
  });
}

export async function handleOAuthCallback(code: string): Promise<void> {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const redirectUri =
    process.env.GOOGLE_OAUTH_REDIRECT_URI || "http://localhost:3001";
  const tokenPath = process.env.GOOGLE_OAUTH_TOKEN_PATH;

  if (!clientId || !clientSecret || !tokenPath) {
    throw new Error(
      "OAuth client ID, secret, and token path are required in environment variables"
    );
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );

  const { tokens } = await oauth2Client.getToken(code);
  saveTokensToFile(tokens, tokenPath);
}
