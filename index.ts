#!/usr/bin/env bun
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import GoogleCalendar from "./utils/calendar";
import tools from "./tools";
import { createAuthClient } from "./utils/auth";
import {
  isCreateEventArgs,
  isGetEventsArgs,
  isSetDefaultCalendarArgs,
  isListCalendarsArgs,
  isGetEventArgs,
  isUpdateEventArgs,
  isDeleteEventArgs,
  isFindFreeTimeArgs,
} from "./utils/helper";

const authClient = createAuthClient();
const googleCalendarInstance = new GoogleCalendar(authClient);

// Initialize the MCP server
const server = new Server(
  { name: "Google MCP Server", version: "0.0.1" },
  { capabilities: { tools: {} } }
);

// Handle the "list tools" request
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools,
}));

// Handle the "call tool" request
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;
    if (!args) throw new Error("No arguments provided");

    switch (name) {
      case "google_calendar_set_default": {
        if (!isSetDefaultCalendarArgs(args)) {
          throw new Error("Invalid arguments for google_calendar_set_default");
        }
        const { calendarId } = args;
        const result = googleCalendarInstance.setDefaultCalendarId(calendarId);
        return {
          content: [{ type: "text", text: result }],
          isError: false,
        };
      }

      case "google_calendar_list_calendars": {
        if (!isListCalendarsArgs(args)) {
          throw new Error(
            "Invalid arguments for google_calendar_list_calendars"
          );
        }
        const calendars = await googleCalendarInstance.listCalendars();
        const formattedResult = calendars
          .map(
            (cal: any) =>
              `${cal.summary}${cal.primary ? " (Primary)" : ""} - ID: ${cal.id}`
          )
          .join("\n");

        return {
          content: [{ type: "text", text: formattedResult }],
          isError: false,
        };
      }

      case "google_calendar_create_event": {
        if (!isCreateEventArgs(args)) {
          throw new Error("Invalid arguments for google_calendar_create_event");
        }

        const {
          summary,
          start,
          end,
          calendarId,
          description,
          location,
          colorId,
          attendees,
          recurrence,
        } = args;

        if (!summary || !start || !end)
          throw new Error("Missing required arguments");

        const result = await googleCalendarInstance.createEvent(
          summary,
          start,
          end,
          calendarId,
          description,
          location,
          colorId,
          attendees,
          recurrence
        );

        return {
          content: [{ type: "text", text: result }],
          isError: false,
        };
      }

      case "google_calendar_get_events": {
        if (!isGetEventsArgs(args)) {
          throw new Error("Invalid arguments for google_calendar_get_events");
        }
        const { limit, calendarId, timeMin, timeMax, q, showDeleted } = args;
        const result = await googleCalendarInstance.getEvents(
          limit || 10,
          calendarId,
          timeMin,
          timeMax,
          q,
          showDeleted
        );
        return {
          content: [{ type: "text", text: result }],
          isError: false,
        };
      }

      case "google_calendar_get_event": {
        if (!isGetEventArgs(args)) {
          throw new Error("Invalid arguments for google_calendar_get_event");
        }
        const { eventId, calendarId } = args;
        const result = await googleCalendarInstance.getEvent(
          eventId,
          calendarId
        );
        return {
          content: [{ type: "text", text: result }],
          isError: false,
        };
      }

      case "google_calendar_update_event": {
        if (!isUpdateEventArgs(args)) {
          throw new Error("Invalid arguments for google_calendar_update_event");
        }

        const {
          eventId,
          calendarId,
          summary,
          description,
          start,
          end,
          location,
          colorId,
          attendees,
          recurrence,
        } = args;

        const changes = {
          summary,
          description,
          start,
          end,
          location,
          colorId,
          attendees,
          recurrence,
        };

        const result = await googleCalendarInstance.updateEvent(
          eventId,
          changes,
          calendarId
        );
        return {
          content: [{ type: "text", text: result }],
          isError: false,
        };
      }

      case "google_calendar_delete_event": {
        if (!isDeleteEventArgs(args)) {
          throw new Error("Invalid arguments for google_calendar_delete_event");
        }

        const { eventId, calendarId } = args;
        const result = await googleCalendarInstance.deleteEvent(
          eventId,
          calendarId
        );
        return {
          content: [{ type: "text", text: result }],
          isError: false,
        };
      }

      case "google_calendar_find_free_time": {
        if (!isFindFreeTimeArgs(args)) {
          throw new Error(
            "Invalid arguments for google_calendar_find_free_time"
          );
        }

        const { startDate, endDate, duration, calendarIds } = args;
        const result = await googleCalendarInstance.findFreeTime(
          startDate,
          endDate,
          duration,
          calendarIds
        );
        return {
          content: [{ type: "text", text: result }],
          isError: false,
        };
      }

      default:
        return {
          content: [{ type: "text", text: `Unknown tool: ${name}` }],
          isError: true,
        };
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${
            error instanceof Error ? error.message : String(error)
          }`,
        },
      ],
      isError: true,
    };
  }
});

// Connect the server to stdio transport
const transport = new StdioServerTransport();
server.connect(transport);
