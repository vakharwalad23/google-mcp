import * as http from "http";
import { URL } from "url";
import { handleOAuthCallback } from "./auth";

const DEFAULT_PORT = process.env.PORT || 3000;

export async function startOAuthServer(): Promise<void> {
  let serverClosed = false;
  let timeoutId: NodeJS.Timeout | null = null;
  return new Promise((resolve, reject) => {
    const port = DEFAULT_PORT;
    const redirectUri = `http://localhost:${port}`;

    process.env.GOOGLE_OAUTH_REDIRECT_URI = redirectUri;

    // Create server to handle the callback
    const server = http.createServer(async (req, res) => {
      try {
        // Parse the URL and get the code
        const url = new URL(req.url || "", redirectUri);
        const code = url.searchParams.get("code");

        if (code) {
          // Handle the OAuth callback with the received code
          await handleOAuthCallback(code);

          // Send success page to the user
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Authentication Successful</title>
                <style>
                  body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                  .success { color: #4CAF50; font-size: 24px; margin-bottom: 20px; }
                </style>
              </head>
              <body>
                <div class="success">Authentication Successful!</div>
                <p>You can close this window and return to your application.</p>
              </body>
            </html>
          `);

          // Close the server and resolve the promise
          server.close(() => {
            resolve();
          });
        } else {
          // No code found in the request
          res.writeHead(400, { "Content-Type": "text/html" });
          res.end(`
            <html><body>
              <h1>Authentication Failed</h1>
              <p>No authorization code was received.</p>
            </body></html>
          `);
          server.close(() => {
            reject(new Error("No authorization code received"));
          });
        }
      } catch (error) {
        // Handle errors
        res.writeHead(500, { "Content-Type": "text/html" });
        res.end(`
          <html><body>
            <h1>Authentication Error</h1>
            <p>${error instanceof Error ? error.message : String(error)}</p>
          </body></html>
        `);
        server.close(() => {
          reject(error);
        });
      }
    });

    // Start the server
    server.listen(port, () => {
      console.log(`OAuth callback server listening at ${redirectUri}`);
    });

    // Handle server errors
    server.on("error", (err) => {
      reject(err);
    });
    // Setting a timeout to close the server after 5 minutes
    timeoutId = setTimeout(() => {
      if (!serverClosed) {
        serverClosed = true;
        server.close();
        reject(new Error("OAuth authentication timed out after 5 minutes"));
      }
    }, 3 * 60 * 1000);
  });
}
