import { type Tool } from "@modelcontextprotocol/sdk/types.js";

export const REFRESH_TOKENS_TOOL: Tool = {
  name: "google_oauth_refresh_tokens",
  description: "Refresh OAuth access tokens and update them in the token file",
  inputSchema: {
    type: "object",
    properties: {},
  },
};

export const REAUTHENTICATE_TOOL: Tool = {
  name: "google_oauth_reauthenticate",
  description:
    "Delete existing tokens and start fresh OAuth authentication flow",
  inputSchema: {
    type: "object",
    properties: {},
  },
};

export const oauthTools = [REFRESH_TOKENS_TOOL, REAUTHENTICATE_TOOL];
