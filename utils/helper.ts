export function isCreateEventArgs(args: unknown): args is {
  summary: string;
  start: string;
  end: string;
  calendarId?: string;
} {
  return (
    typeof args === "object" &&
    args !== null &&
    (!("summary" in args) ||
      typeof (args as { summary: string }).summary === "string") &&
    (!("start" in args) ||
      typeof (args as { start: string }).start === "string") &&
    (!("end" in args) || typeof (args as { end: string }).end === "string") &&
    (!("calendarId" in args) ||
      typeof (args as { calendarId: string }).calendarId === "string")
  );
}

export function isGetEventsArgs(args: unknown): args is {
  limit?: number;
  calendarId?: string;
} {
  return (
    typeof args === "object" &&
    args !== null &&
    (!("limit" in args) ||
      typeof (args as { limit: number }).limit === "number") &&
    (!("calendarId" in args) ||
      typeof (args as { calendarId: string }).calendarId === "string")
  );
}

export function isSetDefaultCalendarArgs(
  args: unknown
): args is { calendarId: string } {
  return (
    typeof args === "object" &&
    args !== null &&
    "calendarId" in args &&
    typeof (args as { calendarId: string }).calendarId === "string"
  );
}

export function isListCalendarsArgs(args: unknown): args is {} {
  return typeof args === "object" && args !== null;
}
