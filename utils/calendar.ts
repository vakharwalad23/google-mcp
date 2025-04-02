import { google } from "googleapis";

export default class GoogleCalendar {
  private calendar: any;
  private defaultCalendarId: string;

  constructor(authClient: any, defaultCalendarId: string = "primary") {
    this.calendar = google.calendar({ version: "v3", auth: authClient });
    this.defaultCalendarId = defaultCalendarId;
  }

  setDefaultCalendarId(calendarId: string) {
    this.defaultCalendarId = calendarId;
    return `Default calendar ID set to: ${calendarId}`;
  }

  async createEvent(
    summary: string,
    start: string,
    end: string,
    calendarId?: string
  ) {
    try {
      const targetCalendarId = calendarId || this.defaultCalendarId;
      const event = await this.calendar.events.insert({
        calendarId: targetCalendarId,
        requestBody: {
          summary,
          start: { dateTime: start },
          end: { dateTime: end },
        },
      });
      return `Event created with ID: ${event.data.id} in calendar: ${targetCalendarId}`;
    } catch (error) {
      throw new Error(
        `Failed to create event: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async getEvents(limit: number = 10, calendarId?: string) {
    try {
      const targetCalendarId = calendarId || this.defaultCalendarId;
      const res = await this.calendar.events.list({
        calendarId: targetCalendarId,
        maxResults: limit,
        timeMin: new Date().toISOString(),
        singleEvents: true,
        orderBy: "startTime",
      });
      return (
        `Calendar: ${targetCalendarId}\n` +
        (res.data.items
          .map(
            (item: any) =>
              `${item.summary} (${item.start.dateTime || item.start.date} - ${
                item.end.dateTime || item.end.date
              })`
          )
          .join("\n") || "No upcoming events")
      );
    } catch (error) {
      throw new Error(
        `Failed to list events: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async listCalendars() {
    try {
      const res = await this.calendar.calendarList.list();
      return res.data.items.map((cal: any) => ({
        id: cal.id,
        summary: cal.summary,
        primary: !!cal.primary,
      }));
    } catch (error) {
      throw new Error(
        `Failed to list calendars: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
