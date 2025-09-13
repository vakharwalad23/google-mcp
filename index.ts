#!/usr/bin/env bun
import { createGoogleMcpServer } from "./server-setup";
import { createHttpTransport } from "./transports/http";
import { createStdioTransport } from "./transports/stdio";

async function main() {
  // Create the MCP server instance
  const server = createGoogleMcpServer();

  // Check transport type from environment variable
  const transportType = process.env.MCP_TRANSPORT || "stdio";
  const port = parseInt(process.env.PORT || "3000");

  if (transportType.toLowerCase() === "http") {
    const httpTransport = createHttpTransport(server, port);
    await httpTransport.start();

    // Handle graceful shutdown
    process.on("SIGINT", async () => {
      await httpTransport.close();
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      await httpTransport.close();
      process.exit(0);
    });
  } else {
    // Default to stdio transport
    const stdioTransport = createStdioTransport(server);
    await stdioTransport.start();

    // Handle graceful shutdown
    process.on("SIGINT", async () => {
      await stdioTransport.close();
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      await stdioTransport.close();
      process.exit(0);
    });
  }
}

// Start the server
main().catch((error) => {
  process.exit(1);
});
