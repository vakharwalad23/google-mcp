import { google } from "googleapis";
import * as fs from "fs";
import * as path from "path";

export function createAuthClient(credentials?: string | object): any {
  let creds: any;

  // Case 1: Credentials provided as a string (file path)
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
  }
  // Case 2: Credentials provided as an object
  else if (typeof credentials === "object" && credentials !== null) {
    creds = credentials;
  }
  // Case 3: No credentials provided, use environment variables
  else {
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    if (!clientEmail || !privateKey) {
      throw new Error(
        "Credentials not provided and environment variables GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY are not set."
      );
    }
    creds = {
      client_email: clientEmail,
      private_key: privateKey.replace(/\\n/g, "\n"), // Handle newline characters in private key
    };
  }

  // Create the authentication client based on authType
  const { client_email, private_key } = creds;
  if (!client_email || !private_key) {
    throw new Error(
      "Invalid credentials: client_email and private_key are required."
    );
  }
  return new google.auth.JWT({
    email: client_email,
    key: private_key,
    scopes: [
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/gmail.modify",
      "https://www.googleapis.com/auth/calendar",
    ],
  });
}
