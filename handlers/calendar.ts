import GoogleCalendar from "../utils/calendar";
import {
  isSetDefaultCalendarArgs,
  isListCalendarsArgs,
  isCreateEventArgs,
  isGetEventsArgs,
  isGetEventArgs,
  isUpdateEventArgs,
  isDeleteEventArgs,
  isFindFreeTimeArgs,
} from "../utils/helper";

export async function handleCalendarSetDefault(
  args: any,
  googleCalendarInstance: GoogleCalendar
) {
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

export async function handleCalendarListCalendars(
  args: any,
  googleCalendarInstance: GoogleCalendar
) {
  if (!isListCalendarsArgs(args)) {
    throw new Error("Invalid arguments for google_calendar_list_calendars");
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

export async function handleCalendarCreateEvent(
  args: any,
  googleCalendarInstance: GoogleCalendar
) {
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

  if (!summary || !start || !end) throw new Error("Missing required arguments");

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

export async function handleCalendarGetEvents(
  args: any,
  googleCalendarInstance: GoogleCalendar
) {
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

export async function handleCalendarGetEvent(
  args: any,
  googleCalendarInstance: GoogleCalendar
) {
  if (!isGetEventArgs(args)) {
    throw new Error("Invalid arguments for google_calendar_get_event");
  }
  const { eventId, calendarId } = args;
  const result = await googleCalendarInstance.getEvent(eventId, calendarId);
  return {
    content: [{ type: "text", text: result }],
    isError: false,
  };
}

export async function handleCalendarUpdateEvent(
  args: any,
  googleCalendarInstance: GoogleCalendar
) {
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

export async function handleCalendarDeleteEvent(
  args: any,
  googleCalendarInstance: GoogleCalendar
) {
  if (!isDeleteEventArgs(args)) {
    throw new Error("Invalid arguments for google_calendar_delete_event");
  }

  const { eventId, calendarId } = args;
  const result = await googleCalendarInstance.deleteEvent(eventId, calendarId);
  return {
    content: [{ type: "text", text: result }],
    isError: false,
  };
}

export async function handleCalendarFindFreeTime(
  args: any,
  googleCalendarInstance: GoogleCalendar
) {
  if (!isFindFreeTimeArgs(args)) {
    throw new Error("Invalid arguments for google_calendar_find_free_time");
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
