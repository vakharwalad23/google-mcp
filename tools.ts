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
    },
  },
};

const tools = [
  SET_DEFAULT_CALENDAR_TOOL,
  LIST_CALENDARS_TOOL,
  CREATE_EVENT_TOOL,
  GET_EVENTS_TOOL,
];

export default tools;
