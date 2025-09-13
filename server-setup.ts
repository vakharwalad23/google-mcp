import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import tools from "./tools/index";
import { createAuthClient } from "./utils/auth";
import GoogleCalendar from "./utils/calendar";
import GoogleGmail from "./utils/gmail";
import GoogleDrive from "./utils/drive";
import GoogleTasks from "./utils/tasks";

// Import handlers
import * as calendarHandlers from "./handlers/calendar";
import * as gmailHandlers from "./handlers/gmail";
import * as driveHandlers from "./handlers/drive";
import * as tasksHandlers from "./handlers/tasks";
import * as oauthHandlers from "./handlers/oauth";

export function createGoogleMcpServer() {
  // Service instances
  let googleCalendarInstance: GoogleCalendar;
  let googleGmailInstance: GoogleGmail;
  let googleDriveInstance: GoogleDrive;
  let googleTasksInstance: GoogleTasks;
  let initializationPromise: Promise<void>;

  // Service setters for OAuth handlers
  const setGoogleCalendarInstance = (instance: GoogleCalendar) => {
    googleCalendarInstance = instance;
  };
  const setGoogleGmailInstance = (instance: GoogleGmail) => {
    googleGmailInstance = instance;
  };
  const setGoogleDriveInstance = (instance: GoogleDrive) => {
    googleDriveInstance = instance;
  };
  const setGoogleTasksInstance = (instance: GoogleTasks) => {
    googleTasksInstance = instance;
  };

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

      // Handle OAuth tools first (don't require initialization)
      if (name === "google_oauth_refresh_tokens") {
        return await oauthHandlers.handleOauthRefreshTokens(args, {
          setGoogleCalendarInstance,
          setGoogleGmailInstance,
          setGoogleDriveInstance,
          setGoogleTasksInstance,
        });
      }

      if (name === "google_oauth_reauthenticate") {
        return await oauthHandlers.handleOauthReauthenticate(args, {
          setGoogleCalendarInstance,
          setGoogleGmailInstance,
          setGoogleDriveInstance,
          setGoogleTasksInstance,
        });
      }

      // For all other tools, ensure initialization is complete
      await initializationPromise;
      if (
        !googleCalendarInstance ||
        !googleGmailInstance ||
        !googleDriveInstance ||
        !googleTasksInstance
      ) {
        throw new Error("Authentication failed to initialize services");
      }

      // Route to appropriate handlers
      switch (name) {
        // Calendar tools
        case "google_calendar_set_default":
          return await calendarHandlers.handleCalendarSetDefault(
            args,
            googleCalendarInstance
          );
        case "google_calendar_list_calendars":
          return await calendarHandlers.handleCalendarListCalendars(
            args,
            googleCalendarInstance
          );
        case "google_calendar_create_event":
          return await calendarHandlers.handleCalendarCreateEvent(
            args,
            googleCalendarInstance
          );
        case "google_calendar_get_events":
          return await calendarHandlers.handleCalendarGetEvents(
            args,
            googleCalendarInstance
          );
        case "google_calendar_get_event":
          return await calendarHandlers.handleCalendarGetEvent(
            args,
            googleCalendarInstance
          );
        case "google_calendar_update_event":
          return await calendarHandlers.handleCalendarUpdateEvent(
            args,
            googleCalendarInstance
          );
        case "google_calendar_delete_event":
          return await calendarHandlers.handleCalendarDeleteEvent(
            args,
            googleCalendarInstance
          );
        case "google_calendar_find_free_time":
          return await calendarHandlers.handleCalendarFindFreeTime(
            args,
            googleCalendarInstance
          );

        // Gmail tools
        case "google_gmail_list_labels":
          return await gmailHandlers.handleGmailListLabels(
            args,
            googleGmailInstance
          );
        case "google_gmail_list_emails":
          return await gmailHandlers.handleGmailListEmails(
            args,
            googleGmailInstance
          );
        case "google_gmail_get_email":
          return await gmailHandlers.handleGmailGetEmail(
            args,
            googleGmailInstance
          );
        case "google_gmail_get_email_by_index":
          return await gmailHandlers.handleGmailGetEmailByIndex(
            args,
            googleGmailInstance
          );
        case "google_gmail_send_email":
          return await gmailHandlers.handleGmailSendEmail(
            args,
            googleGmailInstance
          );
        case "google_gmail_draft_email":
          return await gmailHandlers.handleGmailDraftEmail(
            args,
            googleGmailInstance
          );
        case "google_gmail_delete_email":
          return await gmailHandlers.handleGmailDeleteEmail(
            args,
            googleGmailInstance
          );
        case "google_gmail_modify_labels":
          return await gmailHandlers.handleGmailModifyLabels(
            args,
            googleGmailInstance
          );
        case "google_gmail_download_attachments":
          return await gmailHandlers.handleGmailDownloadAttachments(
            args,
            googleGmailInstance
          );

        // Drive tools
        case "google_drive_list_files":
          return await driveHandlers.handleDriveListFiles(
            args,
            googleDriveInstance
          );
        case "google_drive_get_file_content":
          return await driveHandlers.handleDriveGetFileContent(
            args,
            googleDriveInstance
          );
        case "google_drive_create_file":
          return await driveHandlers.handleDriveCreateFile(
            args,
            googleDriveInstance
          );
        case "google_drive_update_file":
          return await driveHandlers.handleDriveUpdateFile(
            args,
            googleDriveInstance
          );
        case "google_drive_delete_file":
          return await driveHandlers.handleDriveDeleteFile(
            args,
            googleDriveInstance
          );
        case "google_drive_share_file":
          return await driveHandlers.handleDriveShareFile(
            args,
            googleDriveInstance
          );

        // Tasks tools
        case "google_tasks_set_default_list":
          return await tasksHandlers.handleTasksSetDefaultList(
            args,
            googleTasksInstance
          );
        case "google_tasks_list_tasklists":
          return await tasksHandlers.handleTasksListTasklists(
            args,
            googleTasksInstance
          );
        case "google_tasks_list_tasks":
          return await tasksHandlers.handleTasksListTasks(
            args,
            googleTasksInstance
          );
        case "google_tasks_get_task":
          return await tasksHandlers.handleTasksGetTask(
            args,
            googleTasksInstance
          );
        case "google_tasks_create_task":
          return await tasksHandlers.handleTasksCreateTask(
            args,
            googleTasksInstance
          );
        case "google_tasks_update_task":
          return await tasksHandlers.handleTasksUpdateTask(
            args,
            googleTasksInstance
          );
        case "google_tasks_complete_task":
          return await tasksHandlers.handleTasksCompleteTask(
            args,
            googleTasksInstance
          );
        case "google_tasks_delete_task":
          return await tasksHandlers.handleTasksDeleteTask(
            args,
            googleTasksInstance
          );
        case "google_tasks_create_tasklist":
          return await tasksHandlers.handleTasksCreateTasklist(
            args,
            googleTasksInstance
          );
        case "google_tasks_delete_tasklist":
          return await tasksHandlers.handleTasksDeleteTasklist(
            args,
            googleTasksInstance
          );

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

  // Initialize authentication and services
  initializationPromise = createAuthClient()
    .then((authClient) => {
      googleCalendarInstance = new GoogleCalendar(authClient);
      googleGmailInstance = new GoogleGmail(authClient);
      googleDriveInstance = new GoogleDrive(authClient);
      googleTasksInstance = new GoogleTasks(authClient);
    })
    .catch((error) => {
      throw error;
    });

  return server;
}
