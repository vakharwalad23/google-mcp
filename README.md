# Google MCP Tools

[![smithery badge](https://smithery.ai/badge/@vakharwalad23/google-mcp)](https://smithery.ai/server/@vakharwalad23/google-mcp)

This is a collection of Google-native tools (e.g., Gmail, Calendar) for the [MCP protocol](https://modelcontextprotocol.com/docs/mcp-protocol), designed to integrate seamlessly with AI clients like Claude or Cursor.

<details>
<summary>JSON configs</summary>

```json
{
  "mcpServers": {
    "google-mcp": {
      "command": "bunx",
      "args": ["--no-cache", "google-mcp@latest"],
      "env": {
        // Either can be used, but not both
        // Use OAuth
        "GOOGLE_OAUTH_CLIENT_ID": "<YOUR_CLIENT_ID>",
        "GOOGLE_OAUTH_CLIENT_SECRET": "<YOUR_CLIENT_SECRET>",
        "GOOGLE_OAUTH_TOKEN_PATH": "<PATH_TO_STORE_TOKENS> CAN_BE_ANYWHERE_ON_YOUR_SYSTEM",
        // Use Service Account
        "GOOGLE_CLIENT_EMAIL": "<YOUR_SERVICE_ACCOUNT_EMAIL>",
        "GOOGLE_PRIVATE_KEY": "<YOUR_SERVICE_ACCOUNT_PRIVATE_KEY>",
        "GMAIL_USER_TO_IMPERSONATE": "<USER_TO_IMPERSONATE>"
      }
    }
  }
}
```

</details>

## Features

- Gmail:
  - Send emails with multiple recipients (to, cc, bcc) and attachments.
  - List emails with custom queries, labels, and result limits.
  - Read specific emails by ID.
  - Manage labels (add, remove, list).
  - Draft and delete emails.
- Calendar:
  - List calendars and set a default calendar.
  - Create events with details (summary, start/end time, attendees, etc.).
  - List upcoming events with customizable filters.
  - Update or delete existing events.
  - Find free time slots for scheduling.
- TODO Plans:
  - Google Drive: Upload, list, and search files.
  - Google Contacts: Search and manage contacts.
  - And Many More...

You can chain commands for workflows, e.g.:

"List my unread emails, draft a reply to the latest one, and schedule a follow-up meeting tomorrow at 2 PM."

### Manual Installation

1. Prerequisites:

   - Install Bun:

   ```bash
   brew install oven-sh/bun/bun  # macOS/Linux with Homebrew
   ```

2. Set Up OAuth:

   - Create a Google Cloud project
   - Set up OAuth 2.0 credentials (Client ID, Client Secret).

3. Configure Your Client: Edit your claude_desktop_config.json (or equivalent config file for your client):

```json
{
  "mcpServers": {
    "google-mcp": {
      "command": "bunx",
      "args": ["--no-cache", "google-mcp@latest"],
      "env": {
        // Either can be used, but not both
        // Use OAuth
        "GOOGLE_OAUTH_CLIENT_ID": "<YOUR_CLIENT_ID>",
        "GOOGLE_OAUTH_CLIENT_SECRET": "<YOUR_CLIENT_SECRET>",
        "GOOGLE_OAUTH_TOKEN_PATH": "<PATH_TO_STORE_TOKENS>",
        // Use Service Account
        "GOOGLE_CLIENT_EMAIL": "<YOUR_SERVICE_ACCOUNT_EMAIL>",
        "GOOGLE_PRIVATE_KEY": "<YOUR_SERVICE_ACCOUNT_PRIVATE_KEY>",
        "GMAIL_USER_TO_IMPERSONATE": "<USER_TO_IMPERSONATE>"
      }
    }
  }
}
```

4. Authenticate:
   - The first time you run the server, it will open a browser for OAuth authentication. Follow the prompts to grant access, and tokens will be saved to GOOGLE_OAUTH_TOKEN_PATH.

## Usage

Now, ask Claude to use the `google-mcp` tool.

```
Send an email to jane.doe@example.com with the subject "Meeting Notes" and body "Here are the notes from today."
```

```
List my upcoming calendar events for the next 3 days.
```

```
Create a calendar event titled "Team Sync" tomorrow at 10 AM for 1 hour.
```

## Local Development

```bash
git clone https://github.com/vakharwalad23/google-mcp.git
cd google-mcp
bun install
bun run index.ts
```

Thank you for using Google MCP Tools! If you have any questions or suggestions, feel free to open an issue or contribute to the project.

Play around with the tools and enjoy!!
