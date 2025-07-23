import { type Tool } from "@modelcontextprotocol/sdk/types.js";

// Google Calendar Tools
export const SET_DEFAULT_CALENDAR_TOOL: Tool = {
  name: "google_calendar_set_default",
  description: "Set the default calendar ID for operations",
  inputSchema: {
    type: "object",
    properties: {
      calendarId: {
        type: "string",
        description: "The ID of the calendar to set as default",
      },
    },
    required: ["calendarId"],
  },
};

export const LIST_CALENDARS_TOOL: Tool = {
  name: "google_calendar_list_calendars",
  description: "List all available calendars",
  inputSchema: {
    type: "object",
    properties: {},
  },
};

export const CREATE_EVENT_TOOL: Tool = {
  name: "google_calendar_create_event",
  description: "Create a new event in Google Calendar",
  inputSchema: {
    type: "object",
    properties: {
      summary: {
        type: "string",
        description: "The title/summary of the event",
      },
      description: {
        type: "string",
        description: "Detailed description of the event",
      },
      location: {
        type: "string",
        description: "Physical location or address",
      },
      start: {
        type: "string",
        description:
          "Start time of the event in ISO 8601 format (e.g. 2025-04-02T10:00:00-07:00)",
      },
      end: {
        type: "string",
        description:
          "End time of the event in ISO 8601 format (e.g. 2025-04-02T11:00:00-07:00)",
      },
      colorId: {
        type: "string",
        description: "Color identifier (1-11) for the event",
      },
      attendees: {
        type: "array",
        items: { type: "string" },
        description: "List of email addresses to invite",
      },
      recurrence: {
        type: "string",
        description:
          "RFC5545 recurrence rule (e.g., 'RRULE:FREQ=WEEKLY;COUNT=10')",
      },
      calendarId: {
        type: "string",
        description:
          "Optional: ID of calendar to use (defaults to primary if not specified)",
      },
    },
    required: ["summary", "start", "end"],
  },
};

export const GET_EVENTS_TOOL: Tool = {
  name: "google_calendar_get_events",
  description: "Retrieve upcoming events from Google Calendar",
  inputSchema: {
    type: "object",
    properties: {
      limit: {
        type: "number",
        description: "Maximum number of events to return",
      },
      calendarId: {
        type: "string",
        description:
          "Optional: ID of calendar to use (defaults to primary if not specified)",
      },
      timeMin: {
        type: "string",
        description: "Start date/time in ISO format (defaults to now)",
      },
      timeMax: {
        type: "string",
        description: "End date/time in ISO format",
      },
      q: {
        type: "string",
        description: "Free text search term for events",
      },
      showDeleted: {
        type: "boolean",
        description: "Whether to include deleted events",
      },
    },
  },
};

export const GET_EVENT_TOOL: Tool = {
  name: "google_calendar_get_event",
  description: "Get detailed information about a specific event",
  inputSchema: {
    type: "object",
    properties: {
      eventId: {
        type: "string",
        description: "ID of the event to retrieve",
      },
      calendarId: {
        type: "string",
        description:
          "Optional: ID of calendar to use (defaults to primary if not specified)",
      },
    },
    required: ["eventId"],
  },
};

export const UPDATE_EVENT_TOOL: Tool = {
  name: "google_calendar_update_event",
  description: "Update an existing event in Google Calendar",
  inputSchema: {
    type: "object",
    properties: {
      eventId: {
        type: "string",
        description: "ID of the event to update",
      },
      summary: {
        type: "string",
        description: "The title/summary of the event",
      },
      description: {
        type: "string",
        description: "Detailed description of the event",
      },
      start: {
        type: "string",
        description: "Start time in ISO 8601 format",
      },
      end: {
        type: "string",
        description: "End time in ISO 8601 format",
      },
      location: {
        type: "string",
        description: "Physical location or address",
      },
      colorId: {
        type: "string",
        description: "Color identifier (1-11) for the event",
      },
      attendees: {
        type: "array",
        items: { type: "string" },
        description: "List of email addresses to invite",
      },
      recurrence: {
        type: "string",
        description:
          "RFC5545 recurrence rule (e.g., 'RRULE:FREQ=WEEKLY;COUNT=10')",
      },
      calendarId: {
        type: "string",
        description:
          "Optional: ID of calendar to use (defaults to primary if not specified)",
      },
    },
    required: ["eventId"],
  },
};

export const DELETE_EVENT_TOOL: Tool = {
  name: "google_calendar_delete_event",
  description: "Delete an event from Google Calendar",
  inputSchema: {
    type: "object",
    properties: {
      eventId: {
        type: "string",
        description: "ID of the event to delete",
      },
      calendarId: {
        type: "string",
        description:
          "Optional: ID of calendar to use (defaults to primary if not specified)",
      },
    },
    required: ["eventId"],
  },
};

export const FIND_FREE_TIME_TOOL: Tool = {
  name: "google_calendar_find_free_time",
  description: "Find available time slots between events",
  inputSchema: {
    type: "object",
    properties: {
      startDate: {
        type: "string",
        description: "Start of search period (ISO format)",
      },
      endDate: {
        type: "string",
        description: "End of search period (ISO format)",
      },
      duration: {
        type: "number",
        description: "Minimum slot duration in minutes",
      },
      calendarIds: {
        type: "array",
        items: { type: "string" },
        description:
          "Optional: Calendar IDs to check (defaults to primary if not specified)",
      },
    },
    required: ["startDate", "endDate", "duration"],
  },
};

// Gmail Tools
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

// Google Drive Tools
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

// Google Tasks Tools
export const SET_DEFAULT_TASKLIST_TOOL: Tool = {
  name: "google_tasks_set_default_list",
  description: "Set the default task list ID for operations",
  inputSchema: {
    type: "object",
    properties: {
      taskListId: {
        type: "string",
        description: "The ID of the task list to set as default",
      },
    },
    required: ["taskListId"],
  },
};

export const LIST_TASKLISTS_TOOL: Tool = {
  name: "google_tasks_list_tasklists",
  description: "List all available task lists",
  inputSchema: {
    type: "object",
    properties: {},
  },
};

export const LIST_TASKS_TOOL: Tool = {
  name: "google_tasks_list_tasks",
  description: "List tasks from a task list",
  inputSchema: {
    type: "object",
    properties: {
      taskListId: {
        type: "string",
        description:
          "ID of the task list to retrieve tasks from (uses default if not specified)",
      },
      showCompleted: {
        type: "boolean",
        description: "Whether to include completed tasks",
      },
    },
  },
};

export const GET_TASK_TOOL: Tool = {
  name: "google_tasks_get_task",
  description: "Get details about a specific task",
  inputSchema: {
    type: "object",
    properties: {
      taskId: {
        type: "string",
        description: "ID of the task to retrieve",
      },
      taskListId: {
        type: "string",
        description:
          "ID of the task list the task belongs to (uses default if not specified)",
      },
    },
    required: ["taskId"],
  },
};

export const CREATE_TASK_TOOL: Tool = {
  name: "google_tasks_create_task",
  description: "Create a new task",
  inputSchema: {
    type: "object",
    properties: {
      title: {
        type: "string",
        description: "Title of the task",
      },
      notes: {
        type: "string",
        description: "Notes or description for the task",
      },
      due: {
        type: "string",
        description:
          "Due date in RFC 3339 format (e.g., '2025-04-02T10:00:00.000Z')",
      },
      taskListId: {
        type: "string",
        description:
          "ID of the task list to create the task in (uses default if not specified)",
      },
    },
    required: ["title"],
  },
};

export const UPDATE_TASK_TOOL: Tool = {
  name: "google_tasks_update_task",
  description: "Update an existing task",
  inputSchema: {
    type: "object",
    properties: {
      taskId: {
        type: "string",
        description: "ID of the task to update",
      },
      title: {
        type: "string",
        description: "New title for the task",
      },
      notes: {
        type: "string",
        description: "New notes or description for the task",
      },
      due: {
        type: "string",
        description: "New due date in RFC 3339 format",
      },
      status: {
        type: "string",
        description: "New status for the task (needsAction or completed)",
      },
      taskListId: {
        type: "string",
        description:
          "ID of the task list the task belongs to (uses default if not specified)",
      },
    },
    required: ["taskId"],
  },
};

export const COMPLETE_TASK_TOOL: Tool = {
  name: "google_tasks_complete_task",
  description: "Mark a task as completed",
  inputSchema: {
    type: "object",
    properties: {
      taskId: {
        type: "string",
        description: "ID of the task to complete",
      },
      taskListId: {
        type: "string",
        description:
          "ID of the task list the task belongs to (uses default if not specified)",
      },
    },
    required: ["taskId"],
  },
};

export const DELETE_TASK_TOOL: Tool = {
  name: "google_tasks_delete_task",
  description: "Delete a task",
  inputSchema: {
    type: "object",
    properties: {
      taskId: {
        type: "string",
        description: "ID of the task to delete",
      },
      taskListId: {
        type: "string",
        description:
          "ID of the task list the task belongs to (uses default if not specified)",
      },
    },
    required: ["taskId"],
  },
};

export const CREATE_TASKLIST_TOOL: Tool = {
  name: "google_tasks_create_tasklist",
  description: "Create a new task list",
  inputSchema: {
    type: "object",
    properties: {
      title: {
        type: "string",
        description: "Title of the new task list",
      },
    },
    required: ["title"],
  },
};

export const DELETE_TASKLIST_TOOL: Tool = {
  name: "google_tasks_delete_tasklist",
  description: "Delete a task list",
  inputSchema: {
    type: "object",
    properties: {
      taskListId: {
        type: "string",
        description: "ID of the task list to delete",
      },
    },
    required: ["taskListId"],
  },
};

// OAuth Tools
export const REFRESH_TOKENS_TOOL: Tool = {
  name: "google_oauth_refresh_tokens",
  description: "Refresh OAuth access tokens and update them in the token file",
  inputSchema: {
    type: "object",
    properties: {},
  },
};

const tools = [
  // OAuth tools
  REFRESH_TOKENS_TOOL,

  // Calendar tools
  SET_DEFAULT_CALENDAR_TOOL,
  LIST_CALENDARS_TOOL,
  CREATE_EVENT_TOOL,
  GET_EVENTS_TOOL,
  GET_EVENT_TOOL,
  UPDATE_EVENT_TOOL,
  DELETE_EVENT_TOOL,
  FIND_FREE_TIME_TOOL,

  // Gmail tools
  LIST_LABELS_TOOL,
  LIST_EMAILS_TOOL,
  GET_EMAIL_TOOL,
  GET_EMAIL_BY_INDEX_TOOL,
  SEND_EMAIL_TOOL,
  DRAFT_EMAIL_TOOL,
  DELETE_EMAIL_TOOL,
  MODIFY_LABELS_TOOL,

  // Google Drive tools
  LIST_FILES_TOOL,
  GET_FILE_CONTENT_TOOL,
  CREATE_FILE_TOOL,
  UPDATE_FILE_TOOL,
  DELETE_FILE_TOOL,
  SHARE_FILE_TOOL,

  // Google Tasks tools
  SET_DEFAULT_TASKLIST_TOOL,
  LIST_TASKLISTS_TOOL,
  LIST_TASKS_TOOL,
  GET_TASK_TOOL,
  CREATE_TASK_TOOL,
  UPDATE_TASK_TOOL,
  COMPLETE_TASK_TOOL,
  DELETE_TASK_TOOL,
  CREATE_TASKLIST_TOOL,
  DELETE_TASKLIST_TOOL,
];

export default tools;
