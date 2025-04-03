import { expect, test, describe, beforeEach, afterEach } from "bun:test";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
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
import { google } from "googleapis";

// Test wrapper for detailed logging
function testWithLogging(name: string, testFn: () => Promise<void>) {
  test(name, async () => {
    console.log(`\n🧪 Running test: ${name}`);
    try {
      await testFn();
      console.log(`✅ Test passed: ${name}`);
    } catch (error) {
      console.log(`❌ Test failed: ${name}`);
      console.error(error);
      throw error;
    }
  });
}

describe("Google MCP Server", () => {
  let serverInstance: Server | null;
  let googleCalendarInstance: GoogleCalendar | null;
  let listToolsHandler: any;
  let callToolHandler: any;

  // Set up with real credentials - for local testing, provide your own
  const credentials = {
    client_email: process.env.GOOGLE_CLIENT_EMAIL || "test@example.com",
    private_key: process.env.GOOGLE_PRIVATE_KEY || "fake-key",
  };

  beforeEach(() => {
    // Create a real auth client with real or test credentials
    const authClient = createAuthClient(credentials);

    // Create actual GoogleCalendar instance
    googleCalendarInstance = new GoogleCalendar(authClient);

    // Initialize server
    serverInstance = new Server(
      { name: "Google MCP Server", version: "0.0.1" },
      { capabilities: { tools: {} } }
    );

    // Set up ListTools handler and keep reference
    listToolsHandler = async () => ({ tools });
    serverInstance.setRequestHandler(ListToolsRequestSchema, listToolsHandler);

    // Set up CallTool handler and keep reference
    callToolHandler = async (request: any) => {
      try {
        const { name, arguments: args } = request.params;
        if (!args) throw new Error("No arguments provided");

        switch (name) {
          case "google_calendar_set_default": {
            if (!isSetDefaultCalendarArgs(args)) {
              throw new Error(
                "Invalid arguments for google_calendar_set_default"
              );
            }
            const { calendarId } = args;
            const result =
              googleCalendarInstance?.setDefaultCalendarId(calendarId);
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
            const calendars = await googleCalendarInstance?.listCalendars();
            const formattedResult = calendars
              .map(
                (cal: any) =>
                  `${cal.summary}${cal.primary ? " (Primary)" : ""} - ID: ${
                    cal.id
                  }`
              )
              .join("\n");

            return {
              content: [{ type: "text", text: formattedResult }],
              isError: false,
            };
          }

          case "google_calendar_create_event": {
            if (!isCreateEventArgs(args)) {
              throw new Error(
                "Invalid arguments for google_calendar_create_event"
              );
            }
            const { summary, start, end, calendarId } = args;
            const result = await googleCalendarInstance?.createEvent(
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
              throw new Error(
                "Invalid arguments for google_calendar_get_events"
              );
            }
            const { limit, calendarId } = args;
            const result = await googleCalendarInstance?.getEvents(
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
    };
    serverInstance.setRequestHandler(CallToolRequestSchema, callToolHandler);
  });

  afterEach(() => {
    // Clean up
    serverInstance = null;
    googleCalendarInstance = null;
    listToolsHandler = null;
    callToolHandler = null;
  });

  testWithLogging("should list available tools", async () => {
    console.log("📋 Calling listToolsHandler...");
    const result = await listToolsHandler({
      params: {},
    });
    console.log("📊 Result:", JSON.stringify(result, null, 2));

    expect(result).toBeDefined();
    expect(result).toHaveProperty("tools");
    expect(result.tools.length).toBeGreaterThan(0);
  });

  testWithLogging("should set default calendar ID", async () => {
    const testCalendarId = "test-calendar-id";
    console.log(`📋 Setting default calendar ID to: ${testCalendarId}`);
    const result = await callToolHandler({
      params: {
        name: "google_calendar_set_default",
        arguments: { calendarId: testCalendarId },
      },
    });
    console.log("📊 Result:", JSON.stringify(result, null, 2));

    expect(result.content[0].text).toBe(
      `Default calendar ID set to: ${testCalendarId}`
    );
    expect(result.isError).toBe(false);
  });

  testWithLogging("should list calendars", async () => {
    console.log("📋 Listing calendars...");
    const result = await callToolHandler({
      params: {
        name: "google_calendar_list_calendars",
        arguments: {},
      },
    });
    console.log("📊 Result:", JSON.stringify(result, null, 2));

    expect(result.isError).toBe(false);
    expect(result.content[0].text).toBeDefined();
  });

  testWithLogging("should create an event", async () => {
    const eventDetails = {
      summary: "Test Event",
      start: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      end: new Date(Date.now() + 90000000).toISOString(), // Tomorrow + 1 hour
    };
    console.log("📋 Creating event with details:", eventDetails);
    const result = await callToolHandler({
      params: {
        name: "google_calendar_create_event",
        arguments: eventDetails,
      },
    });
    console.log("📊 Result:", JSON.stringify(result, null, 2));

    expect(result.isError).toBe(false);
    expect(result.content[0].text).toContain("Event created with ID:");
  });

  testWithLogging("should get events", async () => {
    console.log("📋 Getting events (limit: 5)...");
    const result = await callToolHandler({
      params: {
        name: "google_calendar_get_events",
        arguments: { limit: 5 },
      },
    });
    console.log("📊 Result:", JSON.stringify(result, null, 2));

    expect(result.isError).toBe(false);
    expect(result.content[0].text).toContain("Calendar:");
  });

  testWithLogging("should handle invalid tool name", async () => {
    console.log("📋 Testing invalid tool name...");
    const result = await callToolHandler({
      params: {
        name: "nonexistent_tool",
        arguments: {},
      },
    });
    console.log("📊 Result:", JSON.stringify(result, null, 2));

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Unknown tool:");
  });

  testWithLogging("should handle invalid arguments", async () => {
    console.log("📋 Testing invalid arguments for event creation...");
    const result = await callToolHandler({
      params: {
        name: "google_calendar_create_event",
        arguments: { summary: "Missing start and end dates" },
      },
    });
    console.log("📊 Result:", JSON.stringify(result, null, 2));

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Error:");
  });
});
