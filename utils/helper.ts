// Validation functions for Google Tools arguments.. Just necessary thing

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

// Gmail validation functions
export function isListLabelsArgs(args: any): args is Record<string, never> {
  return args && Object.keys(args).length === 0;
}

export function isListEmailsArgs(args: any): args is {
  labelIds?: string[];
  maxResults?: number;
  query?: string;
} {
  return (
    args &&
    (args.labelIds === undefined || Array.isArray(args.labelIds)) &&
    (args.maxResults === undefined || typeof args.maxResults === "number") &&
    (args.query === undefined || typeof args.query === "string")
  );
}

export function isGetEmailArgs(args: any): args is {
  messageId: string;
  format?: string;
} {
  return (
    args &&
    typeof args.messageId === "string" &&
    (args.format === undefined || typeof args.format === "string")
  );
}

export function isSendEmailArgs(args: any): args is {
  to: string[];
  subject: string;
  body: string;
  cc?: string[];
  bcc?: string[];
  isHtml?: boolean;
} {
  return (
    args &&
    Array.isArray(args.to) &&
    typeof args.subject === "string" &&
    typeof args.body === "string" &&
    (args.cc === undefined || Array.isArray(args.cc)) &&
    (args.bcc === undefined || Array.isArray(args.bcc)) &&
    (args.isHtml === undefined || typeof args.isHtml === "boolean")
  );
}

export function isDraftEmailArgs(args: any): args is {
  to: string[];
  subject: string;
  body: string;
  cc?: string[];
  bcc?: string[];
  isHtml?: boolean;
} {
  return isSendEmailArgs(args); // Same validation as sendEmail
}

export function isDeleteEmailArgs(args: any): args is {
  messageId: string;
  permanently?: boolean;
} {
  return (
    args &&
    typeof args.messageId === "string" &&
    (args.permanently === undefined || typeof args.permanently === "boolean")
  );
}

export function isModifyLabelsArgs(args: any): args is {
  messageId: string;
  addLabelIds?: string[];
  removeLabelIds?: string[];
} {
  return (
    args &&
    typeof args.messageId === "string" &&
    (args.addLabelIds === undefined || Array.isArray(args.addLabelIds)) &&
    (args.removeLabelIds === undefined || Array.isArray(args.removeLabelIds))
  );
}
