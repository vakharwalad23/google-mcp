// Validation functions for Google Tools arguments

export function isSetDefaultCalendarArgs(
  args: any
): args is { calendarId: string } {
  return args && typeof args.calendarId === "string";
}

export function isListCalendarsArgs(args: any): args is Record<string, never> {
  return args && Object.keys(args).length === 0;
}

export function isCreateEventArgs(args: any): args is {
  summary: string;
  start: string;
  end: string;
  calendarId?: string;
  description?: string;
  location?: string;
  colorId?: string;
  attendees?: string[];
  recurrence?: string;
} {
  return (
    args &&
    typeof args.summary === "string" &&
    typeof args.start === "string" &&
    typeof args.end === "string" &&
    (args.calendarId === undefined || typeof args.calendarId === "string") &&
    (args.description === undefined || typeof args.description === "string") &&
    (args.location === undefined || typeof args.location === "string") &&
    (args.colorId === undefined || typeof args.colorId === "string") &&
    (args.recurrence === undefined || typeof args.recurrence === "string") &&
    (args.attendees === undefined || Array.isArray(args.attendees))
  );
}

export function isGetEventsArgs(args: any): args is {
  limit?: number;
  calendarId?: string;
  timeMin?: string;
  timeMax?: string;
  q?: string;
  showDeleted?: boolean;
} {
  return (
    args &&
    (args.limit === undefined || typeof args.limit === "number") &&
    (args.calendarId === undefined || typeof args.calendarId === "string") &&
    (args.timeMin === undefined || typeof args.timeMin === "string") &&
    (args.timeMax === undefined || typeof args.timeMax === "string") &&
    (args.q === undefined || typeof args.q === "string") &&
    (args.showDeleted === undefined || typeof args.showDeleted === "boolean")
  );
}

export function isGetEventArgs(args: any): args is {
  eventId: string;
  calendarId?: string;
} {
  return (
    args &&
    typeof args.eventId === "string" &&
    (args.calendarId === undefined || typeof args.calendarId === "string")
  );
}

export function isUpdateEventArgs(args: any): args is {
  eventId: string;
  summary?: string;
  description?: string;
  start?: string;
  end?: string;
  location?: string;
  colorId?: string;
  attendees?: string[];
  recurrence?: string;
  calendarId?: string;
} {
  return (
    args &&
    typeof args.eventId === "string" &&
    (args.summary === undefined || typeof args.summary === "string") &&
    (args.description === undefined || typeof args.description === "string") &&
    (args.start === undefined || typeof args.start === "string") &&
    (args.end === undefined || typeof args.end === "string") &&
    (args.location === undefined || typeof args.location === "string") &&
    (args.colorId === undefined || typeof args.colorId === "string") &&
    (args.recurrence === undefined || typeof args.recurrence === "string") &&
    (args.attendees === undefined || Array.isArray(args.attendees)) &&
    (args.calendarId === undefined || typeof args.calendarId === "string")
  );
}

export function isDeleteEventArgs(args: any): args is {
  eventId: string;
  calendarId?: string;
} {
  return (
    args &&
    typeof args.eventId === "string" &&
    (args.calendarId === undefined || typeof args.calendarId === "string")
  );
}

export function isFindFreeTimeArgs(args: any): args is {
  startDate: string;
  endDate: string;
  duration: number;
  calendarIds?: string[];
} {
  return (
    args &&
    typeof args.startDate === "string" &&
    typeof args.endDate === "string" &&
    typeof args.duration === "number" &&
    (args.calendarIds === undefined || Array.isArray(args.calendarIds))
  );
}
