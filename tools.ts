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

const tools = [
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
];

export default tools;
