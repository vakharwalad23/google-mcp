import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

export function createStdioTransport(server: Server) {
  const transport = new StdioServerTransport();

  return {
    start: async () => {
      await server.connect(transport);
    },
    close: async () => {
      await transport.close();
    },
    transport,
  };
}
