import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import http from "http";

export function createHttpTransport(server: Server, port: number = 3000) {
  const httpServer = http.createServer();

  // Create a single StreamableHTTPServerTransport instance with session management
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => Math.random().toString(36).substring(2, 15),
    enableJsonResponse: false, // Use SSE streams by default
    allowedHosts: ["localhost", "127.0.0.1"],
    allowedOrigins: ["*"],
    enableDnsRebindingProtection: false, // Disable for development
  });

  httpServer.on("request", async (req, res) => {
    const url = new URL(req.url!, `http://${req.headers.host}`);

    // Health check endpoint
    if (req.method === "GET" && url.pathname === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          status: "ok",
          message: "Google MCP Server is running",
          transport: "streamable-http",
        })
      );
      return;
    }

    // Main MCP endpoint
    if (url.pathname === "/mcp") {
      try {
        // Use the StreamableHTTPServerTransport to handle the request
        await transport.handleRequest(req, res);
      } catch (error) {
        if (!res.headersSent) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              error: `Transport error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            })
          );
        }
      }
      return;
    }

    // 404 for other paths
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  });

  return {
    start: async () => {
      // Connect the server to the transport
      await server.connect(transport);

      return new Promise<void>((resolve) => {
        httpServer.listen(port, () => {
          resolve();
        });
      });
    },
    close: async () => {
      // Close the transport
      await transport.close();

      return new Promise<void>((resolve) => {
        httpServer.close(() => resolve());
      });
    },
    server: httpServer,
  };
}
