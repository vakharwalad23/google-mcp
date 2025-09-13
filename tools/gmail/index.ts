import { type Tool } from "@modelcontextprotocol/sdk/types.js";

export const LIST_LABELS_TOOL: Tool = {
  name: "google_gmail_list_labels",
  description: "List all available Gmail labels",
  inputSchema: {
    type: "object",
    properties: {},
  },
};

export const LIST_EMAILS_TOOL: Tool = {
  name: "google_gmail_list_emails",
  description: "List emails from a specific label or folder",
  inputSchema: {
    type: "object",
    properties: {
      labelIds: {
        type: "array",
        items: { type: "string" },
        description: "Label IDs to filter messages (e.g., 'INBOX', 'SENT')",
      },
      maxResults: {
        type: "number",
        description: "Maximum number of emails to return",
      },
      query: {
        type: "string",
        description: "Search query to filter emails",
      },
    },
  },
};

export const GET_EMAIL_TOOL: Tool = {
  name: "google_gmail_get_email",
  description: "Get detailed information about a specific email",
  inputSchema: {
    type: "object",
    properties: {
      messageId: {
        type: "string",
        description: "ID of the email to retrieve",
      },
      format: {
        type: "string",
        description:
          "Format to return the email in (full, metadata, minimal, raw)",
      },
    },
    required: ["messageId"],
  },
};

export const GET_EMAIL_BY_INDEX_TOOL: Tool = {
  name: "google_gmail_get_email_by_index",
  description: "Get email by its index from the most recent search results",
  inputSchema: {
    type: "object",
    properties: {
      index: {
        type: "number",
        description: "Index of the email from search results (starting from 1)",
      },
      format: {
        type: "string",
        description:
          "Format to return the email in (full, metadata, minimal, raw)",
      },
    },
    required: ["index"],
  },
};

export const SEND_EMAIL_TOOL: Tool = {
  name: "google_gmail_send_email",
  description: "Send a new email",
  inputSchema: {
    type: "object",
    properties: {
      to: {
        type: "array",
        items: { type: "string" },
        description: "Recipients email addresses",
      },
      subject: {
        type: "string",
        description: "Email subject",
      },
      body: {
        type: "string",
        description: "Email body content (can be plain text or HTML)",
      },
      cc: {
        type: "array",
        items: { type: "string" },
        description: "CC recipients email addresses",
      },
      bcc: {
        type: "array",
        items: { type: "string" },
        description: "BCC recipients email addresses",
      },
      isHtml: {
        type: "boolean",
        description: "Whether the body contains HTML",
      },
      attachments: {
        type: "array",
        items: {
          type: "object",
          properties: {
            filePath: {
              type: "string",
              description:
                "Local file path to attach (e.g., '/Users/username/Documents/file.pdf')",
            },
            driveFileId: {
              type: "string",
              description:
                "Google Drive file ID to attach (alternative to filePath)",
            },
            filename: {
              type: "string",
              description:
                "Custom filename for the attachment (optional, will use original filename if not provided)",
            },
            mimeType: {
              type: "string",
              description:
                "MIME type of the attachment (optional, will be auto-detected)",
            },
          },
          oneOf: [{ required: ["filePath"] }, { required: ["driveFileId"] }],
        },
        description:
          "Array of attachments to include with the email. Provide either filePath for local files or driveFileId for Google Drive files.",
      },
    },
    required: ["to", "subject", "body"],
  },
};

export const DRAFT_EMAIL_TOOL: Tool = {
  name: "google_gmail_draft_email",
  description: "Create a draft email",
  inputSchema: {
    type: "object",
    properties: {
      to: {
        type: "array",
        items: { type: "string" },
        description: "Recipients email addresses",
      },
      subject: {
        type: "string",
        description: "Email subject",
      },
      body: {
        type: "string",
        description: "Email body content (can be plain text or HTML)",
      },
      cc: {
        type: "array",
        items: { type: "string" },
        description: "CC recipients email addresses",
      },
      bcc: {
        type: "array",
        items: { type: "string" },
        description: "BCC recipients email addresses",
      },
      isHtml: {
        type: "boolean",
        description: "Whether the body contains HTML",
      },
      attachments: {
        type: "array",
        items: {
          type: "object",
          properties: {
            filePath: {
              type: "string",
              description:
                "Local file path to attach (e.g., '/Users/username/Documents/file.pdf')",
            },
            driveFileId: {
              type: "string",
              description:
                "Google Drive file ID to attach (alternative to filePath)",
            },
            filename: {
              type: "string",
              description:
                "Custom filename for the attachment (optional, will use original filename if not provided)",
            },
            mimeType: {
              type: "string",
              description:
                "MIME type of the attachment (optional, will be auto-detected)",
            },
          },
          oneOf: [{ required: ["filePath"] }, { required: ["driveFileId"] }],
        },
        description:
          "Array of attachments to include with the email. Provide either filePath for local files or driveFileId for Google Drive files.",
      },
    },
    required: ["to", "subject", "body"],
  },
};

export const DELETE_EMAIL_TOOL: Tool = {
  name: "google_gmail_delete_email",
  description: "Delete or trash an email",
  inputSchema: {
    type: "object",
    properties: {
      messageId: {
        type: "string",
        description: "ID of the email to delete",
      },
      permanently: {
        type: "boolean",
        description: "Whether to permanently delete or move to trash",
      },
    },
    required: ["messageId"],
  },
};

export const MODIFY_LABELS_TOOL: Tool = {
  name: "google_gmail_modify_labels",
  description: "Add or remove labels from an email",
  inputSchema: {
    type: "object",
    properties: {
      messageId: {
        type: "string",
        description: "ID of the email to modify",
      },
      addLabelIds: {
        type: "array",
        items: { type: "string" },
        description: "Labels to add to the message",
      },
      removeLabelIds: {
        type: "array",
        items: { type: "string" },
        description: "Labels to remove from the message",
      },
    },
    required: ["messageId"],
  },
};

export const DOWNLOAD_ATTACHMENTS_TOOL: Tool = {
  name: "google_gmail_download_attachments",
  description: "Download attachments from a specific email",
  inputSchema: {
    type: "object",
    properties: {
      messageId: {
        type: "string",
        description: "ID of the email to download attachments from",
      },
      downloadPath: {
        type: "string",
        description:
          "Path where to save the attachments (optional, defaults to user's Downloads folder)",
      },
      attachmentIds: {
        type: "array",
        items: { type: "string" },
        description:
          "Specific attachment IDs to download (optional, downloads all if not specified)",
      },
    },
    required: ["messageId"],
  },
};

export const gmailTools = [
  LIST_LABELS_TOOL,
  LIST_EMAILS_TOOL,
  GET_EMAIL_TOOL,
  GET_EMAIL_BY_INDEX_TOOL,
  SEND_EMAIL_TOOL,
  DRAFT_EMAIL_TOOL,
  DELETE_EMAIL_TOOL,
  MODIFY_LABELS_TOOL,
  DOWNLOAD_ATTACHMENTS_TOOL,
];
