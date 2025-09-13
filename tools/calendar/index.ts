import { type Tool } from "@modelcontextprotocol/sdk/types.js";

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

export const calendarTools = [
  SET_DEFAULT_CALENDAR_TOOL,
  LIST_CALENDARS_TOOL,
  CREATE_EVENT_TOOL,
  GET_EVENTS_TOOL,
  GET_EVENT_TOOL,
  UPDATE_EVENT_TOOL,
  DELETE_EVENT_TOOL,
  FIND_FREE_TIME_TOOL,
];
