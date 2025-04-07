# Generated by https://smithery.ai. See: https://smithery.ai/docs/config#dockerfile
FROM node:lts

# Install Bun
RUN apt-get update && apt-get install -y curl \
    && curl -fsSL https://bun.sh/install | bash \
    && rm -rf /var/lib/apt/lists/*

ENV PATH="/root/.bun/bin:$PATH"

WORKDIR /app

# Copy project files
COPY . .

# Install dependencies using Bun
RUN bun install

# Start the MCP server using Bun
CMD ["bun", "run", "index.ts"]