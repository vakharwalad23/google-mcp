# Google MCP Tools

[![smithery badge](https://smithery.ai/badge/@vakharwalad23/google-mcp)](https://smithery.ai/server/@vakharwalad23/google-mcp)

This is a collection of Google-native tools (e.g., Gmail, Calendar) for the [MCP protocol](https://modelcontextprotocol.com/docs/mcp-protocol), designed to integrate seamlessly with AI clients like Claude or Cursor.

<a href="https://glama.ai/mcp/servers/@vakharwalad23/google-mcp">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@vakharwalad23/google-mcp/badge" alt="Google MCP server" />
</a>

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

- **OAuth Management**:

  - Refresh expired access tokens automatically
  - Update tokens in the token file without re-authentication
  - Maintain session continuity across long-running operations

- **Gmail**:

  - Send emails with multiple recipients (to, cc, bcc) and attachments.
  - List emails with custom queries, labels, and result limits.
  - Read specific emails by ID.
  - Manage labels (add, remove, list).
  - Draft and delete emails.

- **Calendar**:

  - List calendars and set a default calendar.
  - Create events with details (summary, start/end time, attendees, etc.).
  - List upcoming events with customizable filters.
  - Update or delete existing events.
  - Find free time slots for scheduling.

- **Drive**:

  - Filter with search queries
  - Sort by modification date or other criteria
  - Customize display count
  - View detailed file metadata
  - Read file content (text, docs, spreadsheets)
  - Create new files with specified content
  - Update existing files
  - Delete files (trash or permanent)
  - Share files with specific permissions

- **Tasks**:

  - View all task lists
  - Create new task lists
  - Delete existing task lists
  - Set default task list
  - List tasks with filters
  - View task details
  - Create tasks with title, notes, and due dates
  - Update task properties
  - Mark tasks as complete
  - Delete tasks

- **TODO Plans**:
  - Google Contacts: Search and manage contacts.
  - And Many More...

You can chain commands for workflows, e.g.:

"List my unread emails, draft a reply to the latest one, and schedule a follow-up meeting tomorrow at 2 PM."

## OAuth Token Management

The server includes built-in OAuth token management to handle expired access tokens gracefully:

- **Automatic Token Refresh**: When access tokens expire, you can refresh them without going through the full OAuth flow again
- **Persistent Storage**: Refreshed tokens are automatically saved to your configured token file path
- **Session Continuity**: All Google services are re-initialized with fresh tokens after refresh

### Refreshing Tokens

If you encounter authentication errors or want to proactively refresh your tokens, simply ask:

```
Refresh my Google OAuth tokens
```

This will:

1. Use your stored refresh token to get new access tokens
2. Update the token file with the new credentials
3. Re-initialize all Google services with fresh authentication
4. Show you the new token expiration time

**Note**: If you don't have a valid refresh token, you'll need to go through the initial OAuth authentication flow again.

### Manual Installation

1. Prerequisites:

   - Install Bun:

   ```bash
   brew install oven-sh/bun/bun  # macOS/Linux with Homebrew
   ```

2. Set Up OAuth:

   - Create a Google Cloud project in the [Google Cloud Console](https://console.cloud.google.com/).
   - Set up OAuth 2.0 credentials (Client ID, Client Secret).
   - Choose the type Desktop app.
   - If using test mode, add your email to the test users list.
   - Make sure to enable API access for desired services (Gmail, Calendar, Drive etc.).

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

```
Refresh my Google OAuth tokens
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
