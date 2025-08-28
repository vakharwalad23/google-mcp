import { createAuthClient, refreshTokens, reauthenticate } from "../utils/auth";
import { isRefreshTokensArgs, isReauthenticateArgs } from "../utils/helper";
import GoogleCalendar from "../utils/calendar";
import GoogleGmail from "../utils/gmail";
import GoogleDrive from "../utils/drive";
import GoogleTasks from "../utils/tasks";

export async function handleOauthRefreshTokens(
  args: any,
  {
    setGoogleCalendarInstance,
    setGoogleGmailInstance,
    setGoogleDriveInstance,
    setGoogleTasksInstance,
  }: {
    setGoogleCalendarInstance: (instance: GoogleCalendar) => void;
    setGoogleGmailInstance: (instance: GoogleGmail) => void;
    setGoogleDriveInstance: (instance: GoogleDrive) => void;
    setGoogleTasksInstance: (instance: GoogleTasks) => void;
  }
) {
  if (!isRefreshTokensArgs(args)) {
    throw new Error("Invalid arguments for google_oauth_refresh_tokens");
  }
  try {
    const result = await refreshTokens();

    // Re-initialize services with new tokens
    const authClient = await createAuthClient();
    setGoogleCalendarInstance(new GoogleCalendar(authClient));
    setGoogleGmailInstance(new GoogleGmail(authClient));
    setGoogleDriveInstance(new GoogleDrive(authClient));
    setGoogleTasksInstance(new GoogleTasks(authClient));

    return {
      content: [
        {
          type: "text",
          text: result + "\nServices re-initialized with refreshed tokens.",
        },
      ],
      isError: false,
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Failed to refresh tokens: ${
            error instanceof Error ? error.message : String(error)
          }`,
        },
      ],
      isError: true,
    };
  }
}

export async function handleOauthReauthenticate(
  args: any,
  {
    setGoogleCalendarInstance,
    setGoogleGmailInstance,
    setGoogleDriveInstance,
    setGoogleTasksInstance,
  }: {
    setGoogleCalendarInstance: (instance: GoogleCalendar) => void;
    setGoogleGmailInstance: (instance: GoogleGmail) => void;
    setGoogleDriveInstance: (instance: GoogleDrive) => void;
    setGoogleTasksInstance: (instance: GoogleTasks) => void;
  }
) {
  if (!isReauthenticateArgs(args)) {
    throw new Error("Invalid arguments for google_oauth_reauthenticate");
  }
  try {
    const result = await reauthenticate();

    // Re-initialize services with new tokens
    const authClient = await createAuthClient();
    setGoogleCalendarInstance(new GoogleCalendar(authClient));
    setGoogleGmailInstance(new GoogleGmail(authClient));
    setGoogleDriveInstance(new GoogleDrive(authClient));
    setGoogleTasksInstance(new GoogleTasks(authClient));

    return {
      content: [
        {
          type: "text",
          text: result + "\nServices re-initialized with fresh authentication.",
        },
      ],
      isError: false,
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Failed to re-authenticate: ${
            error instanceof Error ? error.message : String(error)
          }`,
        },
      ],
      isError: true,
    };
  }
}
