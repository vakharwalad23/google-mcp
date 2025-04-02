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
} from "./utils/helper";

const authClient = createAuthClient();
const googleCalendarInstance = new GoogleCalendar(authClient);

// Initialize the MCP server
const server = new Server(
  { name: "Google MCP Server", version: "1.0.0" },
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
        const { summary, start, end, calendarId } = args;
        if (!summary || !start || !end)
          throw new Error("Missing required arguments");
        const result = await googleCalendarInstance.createEvent(
          summary,
          start,
          end,
          calendarId
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
        const { limit, calendarId } = args;
        const result = await googleCalendarInstance.getEvents(
          limit || 10,
          calendarId
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
