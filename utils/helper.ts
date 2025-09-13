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

export function isGetEmailByIndexArgs(args: any): args is {
  index: number;
  format?: string;
} {
  return (
    args &&
    typeof args.index === "number" &&
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
  attachments?: Array<{
    filePath?: string;
    driveFileId?: string;
    filename?: string;
    mimeType?: string;
  }>;
} {
  return (
    typeof args === "object" &&
    Array.isArray(args.to) &&
    typeof args.subject === "string" &&
    typeof args.body === "string" &&
    (args.cc === undefined || Array.isArray(args.cc)) &&
    (args.bcc === undefined || Array.isArray(args.bcc)) &&
    (args.isHtml === undefined || typeof args.isHtml === "boolean") &&
    (args.attachments === undefined || Array.isArray(args.attachments))
  );
}

export function isDraftEmailArgs(args: any): args is {
  to: string[];
  subject: string;
  body: string;
  cc?: string[];
  bcc?: string[];
  isHtml?: boolean;
  attachments?: Array<{
    filePath?: string;
    driveFileId?: string;
    filename?: string;
    mimeType?: string;
  }>;
} {
  return (
    typeof args === "object" &&
    Array.isArray(args.to) &&
    typeof args.subject === "string" &&
    typeof args.body === "string" &&
    (args.cc === undefined || Array.isArray(args.cc)) &&
    (args.bcc === undefined || Array.isArray(args.bcc)) &&
    (args.isHtml === undefined || typeof args.isHtml === "boolean") &&
    (args.attachments === undefined || Array.isArray(args.attachments))
  );
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

// Google Drive validation functions
export function isListFilesArgs(args: any): args is {
  query?: string;
  pageSize?: number;
  orderBy?: string;
  fields?: string;
} {
  return (
    args &&
    (args.query === undefined || typeof args.query === "string") &&
    (args.pageSize === undefined || typeof args.pageSize === "number") &&
    (args.orderBy === undefined || typeof args.orderBy === "string") &&
    (args.fields === undefined || typeof args.fields === "string")
  );
}

export function isGetFileContentArgs(args: any): args is {
  fileId: string;
} {
  return args && typeof args.fileId === "string";
}

export function isCreateFileArgs(args: any): args is {
  name: string;
  content: string;
  mimeType?: string;
  folderId?: string;
} {
  return (
    args &&
    typeof args.name === "string" &&
    typeof args.content === "string" &&
    (args.mimeType === undefined || typeof args.mimeType === "string") &&
    (args.folderId === undefined || typeof args.folderId === "string")
  );
}

export function isUpdateFileArgs(args: any): args is {
  fileId: string;
  content: string;
  mimeType?: string;
} {
  return (
    args &&
    typeof args.fileId === "string" &&
    typeof args.content === "string" &&
    (args.mimeType === undefined || typeof args.mimeType === "string")
  );
}

export function isDeleteFileArgs(args: any): args is {
  fileId: string;
  permanently?: boolean;
} {
  return (
    args &&
    typeof args.fileId === "string" &&
    (args.permanently === undefined || typeof args.permanently === "boolean")
  );
}

export function isShareFileArgs(args: any): args is {
  fileId: string;
  emailAddress: string;
  role?: string;
  sendNotification?: boolean;
  message?: string;
} {
  return (
    args &&
    typeof args.fileId === "string" &&
    typeof args.emailAddress === "string" &&
    (args.role === undefined || typeof args.role === "string") &&
    (args.sendNotification === undefined ||
      typeof args.sendNotification === "boolean") &&
    (args.message === undefined || typeof args.message === "string")
  );
}

// Google Tasks validation functions
export function isSetDefaultTaskListArgs(args: any): args is {
  taskListId: string;
} {
  return args && typeof args.taskListId === "string";
}

export function isListTaskListsArgs(args: any): args is Record<string, never> {
  return args && Object.keys(args).length === 0;
}

export function isListTasksArgs(args: any): args is {
  taskListId?: string;
  showCompleted?: boolean;
} {
  return (
    args &&
    (args.taskListId === undefined || typeof args.taskListId === "string") &&
    (args.showCompleted === undefined ||
      typeof args.showCompleted === "boolean")
  );
}

export function isGetTaskArgs(args: any): args is {
  taskId: string;
  taskListId?: string;
} {
  return (
    args &&
    typeof args.taskId === "string" &&
    (args.taskListId === undefined || typeof args.taskListId === "string")
  );
}

export function isCreateTaskArgs(args: any): args is {
  title: string;
  notes?: string;
  due?: string;
  taskListId?: string;
} {
  return (
    args &&
    typeof args.title === "string" &&
    (args.notes === undefined || typeof args.notes === "string") &&
    (args.due === undefined || typeof args.due === "string") &&
    (args.taskListId === undefined || typeof args.taskListId === "string")
  );
}

export function isUpdateTaskArgs(args: any): args is {
  taskId: string;
  title?: string;
  notes?: string;
  due?: string;
  status?: string;
  taskListId?: string;
} {
  return (
    args &&
    typeof args.taskId === "string" &&
    (args.title === undefined || typeof args.title === "string") &&
    (args.notes === undefined || typeof args.notes === "string") &&
    (args.due === undefined || typeof args.due === "string") &&
    (args.status === undefined || typeof args.status === "string") &&
    (args.taskListId === undefined || typeof args.taskListId === "string")
  );
}

export function isCompleteTaskArgs(args: any): args is {
  taskId: string;
  taskListId?: string;
} {
  return (
    args &&
    typeof args.taskId === "string" &&
    (args.taskListId === undefined || typeof args.taskListId === "string")
  );
}

export function isDeleteTaskArgs(args: any): args is {
  taskId: string;
  taskListId?: string;
} {
  return (
    args &&
    typeof args.taskId === "string" &&
    (args.taskListId === undefined || typeof args.taskListId === "string")
  );
}

export function isCreateTaskListArgs(args: any): args is {
  title: string;
} {
  return args && typeof args.title === "string";
}

export function isDeleteTaskListArgs(args: any): args is {
  taskListId: string;
} {
  return args && typeof args.taskListId === "string";
}

// OAuth validation functions
export function isRefreshTokensArgs(args: any): args is Record<string, never> {
  return args && Object.keys(args).length === 0;
}

export function isReauthenticateArgs(args: any): args is Record<string, never> {
  return args && Object.keys(args).length === 0;
}

export function isDownloadAttachmentsArgs(args: any): args is {
  messageId: string;
  downloadPath?: string;
  attachmentIds?: string[];
} {
  return (
    typeof args === "object" &&
    typeof args.messageId === "string" &&
    (args.downloadPath === undefined ||
      typeof args.downloadPath === "string") &&
    (args.attachmentIds === undefined || Array.isArray(args.attachmentIds))
  );
}
