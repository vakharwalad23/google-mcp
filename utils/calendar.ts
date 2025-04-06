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
    calendarId?: string,
    description?: string,
    location?: string,
    colorId?: string,
    attendees?: string[],
    recurrence?: string
  ) {
    try {
      const targetCalendarId = calendarId || this.defaultCalendarId;

      // Build the request body with required fields
      const requestBody: any = {
        summary,
        start: { dateTime: start },
        end: { dateTime: end },
      };

      // Add optional fields if provided
      if (description) requestBody.description = description;
      if (location) requestBody.location = location;
      if (colorId) requestBody.colorId = colorId;

      // Format attendees if provided
      if (attendees && attendees.length > 0) {
        requestBody.attendees = attendees.map((email) => ({ email }));
      }

      // Add recurrence rule if provided
      if (recurrence) {
        requestBody.recurrence = [recurrence];
      }

      const event = await this.calendar.events.insert({
        calendarId: targetCalendarId,
        requestBody,
        sendUpdates: attendees && attendees.length > 0 ? "all" : "none",
      });

      return `Event "${summary}" created with ID: ${event.data.id} in calendar: ${targetCalendarId}`;
    } catch (error) {
      throw new Error(
        `Failed to create event: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async getEvents(
    limit: number = 10,
    calendarId?: string,
    timeMin?: string,
    timeMax?: string,
    q?: string,
    showDeleted: boolean = false
  ) {
    try {
      const targetCalendarId = calendarId || this.defaultCalendarId;

      // Build request parameters
      const params: any = {
        calendarId: targetCalendarId,
        maxResults: limit,
        timeMin: timeMin || new Date().toISOString(),
        singleEvents: true,
        orderBy: "startTime",
      };

      // Add optional parameters
      if (timeMax) params.timeMax = timeMax;
      if (q) params.q = q;
      if (showDeleted) params.showDeleted = true;

      const res = await this.calendar.events.list(params);

      return (
        `Calendar: ${targetCalendarId}\n` +
        (res.data.items
          .map(
            (item: any) =>
              `${item.summary} (${item.start.dateTime || item.start.date} - ${
                item.end.dateTime || item.end.date
              })${item.id ? " - ID: " + item.id : ""}`
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

  async getEvent(eventId: string, calendarId?: string) {
    try {
      const targetCalendarId = calendarId || this.defaultCalendarId;
      const event = await this.calendar.events.get({
        calendarId: targetCalendarId,
        eventId: eventId,
      });

      const data = event.data;

      // Format the event details
      let result = `Event ID: ${data.id}\n`;
      result += `Title: ${data.summary}\n`;
      result += `Start: ${data.start.dateTime || data.start.date}\n`;
      result += `End: ${data.end.dateTime || data.end.date}\n`;

      if (data.description) result += `Description: ${data.description}\n`;
      if (data.location) result += `Location: ${data.location}\n`;

      if (data.attendees && data.attendees.length > 0) {
        result += `Attendees: ${data.attendees
          .map(
            (a: any) =>
              `${a.email}${
                a.responseStatus ? " (" + a.responseStatus + ")" : ""
              }`
          )
          .join(", ")}\n`;
      }

      if (data.recurrence)
        result += `Recurrence: ${data.recurrence.join(", ")}\n`;

      return result;
    } catch (error) {
      throw new Error(
        `Failed to get event: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async updateEvent(
    eventId: string,
    changes: {
      summary?: string;
      description?: string;
      start?: string;
      end?: string;
      location?: string;
      colorId?: string;
      attendees?: string[];
      recurrence?: string;
    },
    calendarId?: string
  ) {
    try {
      const targetCalendarId = calendarId || this.defaultCalendarId;

      // First get the current event
      const currentEvent = await this.calendar.events.get({
        calendarId: targetCalendarId,
        eventId: eventId,
      });

      // Prepare updated event object
      const updatedEvent: any = {};

      // Only include fields that are being updated
      if (changes.summary !== undefined) updatedEvent.summary = changes.summary;
      if (changes.description !== undefined)
        updatedEvent.description = changes.description;
      if (changes.location !== undefined)
        updatedEvent.location = changes.location;
      if (changes.colorId !== undefined) updatedEvent.colorId = changes.colorId;

      // Update start/end times if provided
      if (changes.start) {
        updatedEvent.start = { dateTime: changes.start };
      }

      if (changes.end) {
        updatedEvent.end = { dateTime: changes.end };
      }

      // Format attendees if provided
      if (changes.attendees) {
        updatedEvent.attendees = changes.attendees.map((email) => ({ email }));
      }

      // Add recurrence rule if provided
      if (changes.recurrence) {
        updatedEvent.recurrence = [changes.recurrence];
      }

      // Send the update request
      const result = await this.calendar.events.patch({
        calendarId: targetCalendarId,
        eventId: eventId,
        requestBody: updatedEvent,
        sendUpdates: changes.attendees ? "all" : "none",
      });

      return `Event updated successfully: "${result.data.summary}"`;
    } catch (error) {
      throw new Error(
        `Failed to update event: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async deleteEvent(eventId: string, calendarId?: string) {
    try {
      const targetCalendarId = calendarId || this.defaultCalendarId;

      await this.calendar.events.delete({
        calendarId: targetCalendarId,
        eventId: eventId,
        sendUpdates: "all", // Notify attendees about cancellation
      });

      return `Event ${eventId} deleted successfully from calendar ${targetCalendarId}`;
    } catch (error) {
      throw new Error(
        `Failed to delete event: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async findFreeTime(
    startDate: string,
    endDate: string,
    durationMinutes: number,
    calendarIds?: string[]
  ) {
    try {
      // If no calendar IDs specified, use the default one
      const targetCalendarIds = calendarIds || [this.defaultCalendarId];

      // Get all events in the date range for each calendar
      const allEvents: any[] = [];

      for (const calId of targetCalendarIds) {
        const params: any = {
          calendarId: calId,
          timeMin: startDate,
          timeMax: endDate,
          singleEvents: true,
          orderBy: "startTime",
        };

        const res = await this.calendar.events.list(params);
        allEvents.push(...(res.data.items || []));
      }

      // Sort events by start time
      allEvents.sort((a, b) => {
        const aStart = new Date(a.start.dateTime || a.start.date).getTime();
        const bStart = new Date(b.start.dateTime || b.start.date).getTime();
        return aStart - bStart;
      });

      // Convert duration from minutes to milliseconds
      const durationMs = durationMinutes * 60 * 1000;

      // Start from the search period start date
      let currentTime = new Date(startDate).getTime();
      const endTime = new Date(endDate).getTime();

      // Store free time slots
      const freeSlots = [];

      // Process all events to find gaps between them
      for (const event of allEvents) {
        const eventStart = new Date(
          event.start.dateTime || event.start.date
        ).getTime();

        // Check if there's enough free time before this event starts
        if (eventStart - currentTime >= durationMs) {
          // We found a free slot
          const slotStart = new Date(currentTime).toISOString();
          const slotEnd = new Date(eventStart).toISOString();
          freeSlots.push({ start: slotStart, end: slotEnd });
        }

        // Move current time to the end of this event
        const eventEnd = new Date(
          event.end.dateTime || event.end.date
        ).getTime();
        currentTime = Math.max(currentTime, eventEnd);
      }

      // Check if there's free time after the last event
      if (endTime - currentTime >= durationMs) {
        const slotStart = new Date(currentTime).toISOString();
        const slotEnd = new Date(endTime).toISOString();
        freeSlots.push({ start: slotStart, end: slotEnd });
      }

      // Format results
      if (freeSlots.length === 0) {
        return "No free time slots found that meet the criteria.";
      }

      return (
        "Available time slots:\n" +
        freeSlots
          .map(
            (slot) =>
              `${new Date(slot.start).toLocaleString()} - ${new Date(
                slot.end
              ).toLocaleString()} ` +
              `(${Math.round(
                (new Date(slot.end).getTime() -
                  new Date(slot.start).getTime()) /
                  (60 * 1000)
              )} minutes)`
          )
          .join("\n")
      );
    } catch (error) {
      throw new Error(
        `Failed to find free time: ${
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
