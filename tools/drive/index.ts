import { type Tool } from "@modelcontextprotocol/sdk/types.js";

export const LIST_FILES_TOOL: Tool = {
  name: "google_drive_list_files",
  description: "List files from Google Drive",
  inputSchema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description:
          "Google Drive search query (e.g., 'name contains \"report\"')",
      },
      pageSize: {
        type: "number",
        description: "Maximum number of files to return (default: 10)",
      },
      orderBy: {
        type: "string",
        description:
          "Comma-separated field names to sort by (e.g., 'modifiedTime desc')",
      },
      fields: {
        type: "string",
        description:
          "Fields to include in the response (use Google Drive API syntax)",
      },
    },
  },
};

export const GET_FILE_CONTENT_TOOL: Tool = {
  name: "google_drive_get_file_content",
  description: "Get the content of a file from Google Drive",
  inputSchema: {
    type: "object",
    properties: {
      fileId: {
        type: "string",
        description: "ID of the file to retrieve",
      },
    },
    required: ["fileId"],
  },
};

export const CREATE_FILE_TOOL: Tool = {
  name: "google_drive_create_file",
  description: "Create a new file in Google Drive",
  inputSchema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Name of the file to create",
      },
      content: {
        type: "string",
        description: "Content of the file",
      },
      mimeType: {
        type: "string",
        description:
          "MIME type of the file (e.g., 'text/plain', 'application/vnd.google-apps.document')",
      },
      folderId: {
        type: "string",
        description: "ID of the folder to create the file in",
      },
    },
    required: ["name", "content"],
  },
};

export const UPDATE_FILE_TOOL: Tool = {
  name: "google_drive_update_file",
  description: "Update the content of an existing file in Google Drive",
  inputSchema: {
    type: "object",
    properties: {
      fileId: {
        type: "string",
        description: "ID of the file to update",
      },
      content: {
        type: "string",
        description: "New content of the file",
      },
      mimeType: {
        type: "string",
        description: "MIME type of the file (if different from original)",
      },
    },
    required: ["fileId", "content"],
  },
};

export const DELETE_FILE_TOOL: Tool = {
  name: "google_drive_delete_file",
  description: "Delete a file from Google Drive",
  inputSchema: {
    type: "object",
    properties: {
      fileId: {
        type: "string",
        description: "ID of the file to delete",
      },
      permanently: {
        type: "boolean",
        description:
          "Whether to permanently delete the file or move it to trash",
      },
    },
    required: ["fileId"],
  },
};

export const SHARE_FILE_TOOL: Tool = {
  name: "google_drive_share_file",
  description: "Share a file with another user",
  inputSchema: {
    type: "object",
    properties: {
      fileId: {
        type: "string",
        description: "ID of the file to share",
      },
      emailAddress: {
        type: "string",
        description: "Email address of the user to share with",
      },
      role: {
        type: "string",
        description: "Access role to grant (reader, writer, commenter, owner)",
      },
      sendNotification: {
        type: "boolean",
        description: "Whether to send a notification email",
      },
      message: {
        type: "string",
        description: "Custom message to include in the notification email",
      },
    },
    required: ["fileId", "emailAddress"],
  },
};

export const driveTools = [
  LIST_FILES_TOOL,
  GET_FILE_CONTENT_TOOL,
  CREATE_FILE_TOOL,
  UPDATE_FILE_TOOL,
  DELETE_FILE_TOOL,
  SHARE_FILE_TOOL,
];
