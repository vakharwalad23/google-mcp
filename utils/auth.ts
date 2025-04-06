import { google } from "googleapis";
import * as fs from "fs";
import * as path from "path";
import type { Credentials } from "google-auth-library";
import { startOAuthServer } from "./oauth-server";
import open from "open";

function saveTokensToFile(tokens: Credentials, tokenPath: string): void {
  // Ensure the directory exists
  const dirname = path.dirname(tokenPath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }

  fs.writeFileSync(tokenPath, JSON.stringify(tokens));
  console.log("Token stored to", tokenPath);
}

function loadTokensFromFile(tokenPath: string): Credentials {
  try {
    return JSON.parse(fs.readFileSync(tokenPath, "utf8"));
  } catch (err) {
    throw new Error(
      `Error loading token file: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }
}

export function createAuthClient(
  credentials?: string | object,
  userToImpersonate?: string
): any {
  const oauthClientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const oauthClientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const oauthTokenPath = process.env.GOOGLE_OAUTH_TOKEN_PATH;
  const redirectUri =
    process.env.GOOGLE_OAUTH_REDIRECT_URI || "http://localhost:3000";

  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  // Try OAuth authentication first
  if (oauthClientId && oauthClientSecret && oauthTokenPath) {
    try {
      console.log("Using OAuth authentication method...");

      const oAuth2Client = new google.auth.OAuth2(
        oauthClientId,
        oauthClientSecret,
        redirectUri
      );

      try {
        const tokens = loadTokensFromFile(oauthTokenPath);
        oAuth2Client.setCredentials(tokens);

        if (
          tokens.expiry_date &&
          tokens.expiry_date < Date.now() &&
          tokens.refresh_token
        ) {
          console.log("Token expired, attempting to refresh...");
        }

        return oAuth2Client;
      } catch (error) {
        console.log(
          "OAuth token file not found or invalid, starting OAuth flow..."
        );

        // Start the OAuth flow automatically if we can't find valid tokens
        initiateOAuthFlow();

        throw new Error(
          "OAuth authentication is configured but no valid tokens found. " +
            "Authentication flow has been initiated in your browser. " +
            "Please try again after completing the authentication process."
        );
      }
    } catch (error) {
      console.error("OAuth setup failed:", error);
      console.log(
        "Falling back to service account authentication if available"
      );
    }
  }

  // Fallback to service account
  console.log("Using Service Account authentication method...");

  let creds: any;

  if (typeof credentials === "string") {
    try {
      const filePath = path.resolve(credentials);
      const fileContent = fs.readFileSync(filePath, "utf8");
      creds = JSON.parse(fileContent);
    } catch (error) {
      throw new Error(
        `Failed to read or parse credentials file: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  } else if (typeof credentials === "object" && credentials !== null) {
    creds = credentials;
  } else {
    if (!clientEmail || !privateKey) {
      throw new Error(
        "Authentication failed: Neither OAuth nor Service Account credentials are properly configured in environment variables."
      );
    }
    creds = {
      client_email: clientEmail,
      private_key: privateKey.replace(/\\n/g, "\n"),
    };
  }

  const { client_email, private_key } = creds;
  if (!client_email || !private_key) {
    throw new Error(
      "Invalid credentials: client_email and private_key are required."
    );
  }

  const impersonatedUser =
    userToImpersonate || process.env.GMAIL_USER_TO_IMPERSONATE;

  return new google.auth.JWT({
    email: client_email,
    key: private_key,
    scopes: [
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/gmail.modify",
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/calendar",
    ],
    subject: impersonatedUser,
  });
}

export async function initiateOAuthFlow(scopes?: string[]): Promise<void> {
  try {
    // Start the OAuth server to handle the callback
    const serverPromise = startOAuthServer();

    // Generate and open the consent URL
    const authUrl = generateOAuthConsentUrl(scopes);
    console.log("Opening browser for authentication:", authUrl);
    await open(authUrl);

    // Wait for the server to complete the flow
    await serverPromise;
    console.log("OAuth flow completed successfully");
  } catch (error) {
    console.error("OAuth flow failed:", error);
    throw error;
  }
}

export function generateOAuthConsentUrl(scopes?: string[]): string {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const redirectUri =
    process.env.GOOGLE_OAUTH_REDIRECT_URI || "http://localhost:3000";

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
    ],
    prompt: "consent",
  });
}

export async function handleOAuthCallback(code: string): Promise<void> {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const redirectUri =
    process.env.GOOGLE_OAUTH_REDIRECT_URI || "http://localhost:3000";
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
