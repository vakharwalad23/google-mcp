# Generated by https://smithery.ai. See: https://smithery.ai/docs/config#dockerfile
FROM oven/bun:alpine

WORKDIR /app

# Copy all files needed for the MCP server
COPY . .

# Install dependencies using bun
RUN bun install

# Expose ports if needed (MCP servers typically use stdio, so not necessary)

# Start the MCP server
CMD ["bun", "run", "index.ts"]