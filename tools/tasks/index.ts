import { type Tool } from "@modelcontextprotocol/sdk/types.js";

export const SET_DEFAULT_TASKLIST_TOOL: Tool = {
  name: "google_tasks_set_default_list",
  description: "Set the default task list ID for operations",
  inputSchema: {
    type: "object",
    properties: {
      taskListId: {
        type: "string",
        description: "The ID of the task list to set as default",
      },
    },
    required: ["taskListId"],
  },
};

export const LIST_TASKLISTS_TOOL: Tool = {
  name: "google_tasks_list_tasklists",
  description: "List all available task lists",
  inputSchema: {
    type: "object",
    properties: {},
  },
};

export const LIST_TASKS_TOOL: Tool = {
  name: "google_tasks_list_tasks",
  description: "List tasks from a task list",
  inputSchema: {
    type: "object",
    properties: {
      taskListId: {
        type: "string",
        description:
          "ID of the task list to retrieve tasks from (uses default if not specified)",
      },
      showCompleted: {
        type: "boolean",
        description: "Whether to include completed tasks",
      },
    },
  },
};

export const GET_TASK_TOOL: Tool = {
  name: "google_tasks_get_task",
  description: "Get details about a specific task",
  inputSchema: {
    type: "object",
    properties: {
      taskId: {
        type: "string",
        description: "ID of the task to retrieve",
      },
      taskListId: {
        type: "string",
        description:
          "ID of the task list the task belongs to (uses default if not specified)",
      },
    },
    required: ["taskId"],
  },
};

export const CREATE_TASK_TOOL: Tool = {
  name: "google_tasks_create_task",
  description: "Create a new task",
  inputSchema: {
    type: "object",
    properties: {
      title: {
        type: "string",
        description: "Title of the task",
      },
      notes: {
        type: "string",
        description: "Notes or description for the task",
      },
      due: {
        type: "string",
        description:
          "Due date in RFC 3339 format (e.g., '2025-04-02T10:00:00.000Z')",
      },
      taskListId: {
        type: "string",
        description:
          "ID of the task list to create the task in (uses default if not specified)",
      },
    },
    required: ["title"],
  },
};

export const UPDATE_TASK_TOOL: Tool = {
  name: "google_tasks_update_task",
  description: "Update an existing task",
  inputSchema: {
    type: "object",
    properties: {
      taskId: {
        type: "string",
        description: "ID of the task to update",
      },
      title: {
        type: "string",
        description: "New title for the task",
      },
      notes: {
        type: "string",
        description: "New notes or description for the task",
      },
      due: {
        type: "string",
        description: "New due date in RFC 3339 format",
      },
      status: {
        type: "string",
        description: "New status for the task (needsAction or completed)",
      },
      taskListId: {
        type: "string",
        description:
          "ID of the task list the task belongs to (uses default if not specified)",
      },
    },
    required: ["taskId"],
  },
};

export const COMPLETE_TASK_TOOL: Tool = {
  name: "google_tasks_complete_task",
  description: "Mark a task as completed",
  inputSchema: {
    type: "object",
    properties: {
      taskId: {
        type: "string",
        description: "ID of the task to complete",
      },
      taskListId: {
        type: "string",
        description:
          "ID of the task list the task belongs to (uses default if not specified)",
      },
    },
    required: ["taskId"],
  },
};

export const DELETE_TASK_TOOL: Tool = {
  name: "google_tasks_delete_task",
  description: "Delete a task",
  inputSchema: {
    type: "object",
    properties: {
      taskId: {
        type: "string",
        description: "ID of the task to delete",
      },
      taskListId: {
        type: "string",
        description:
          "ID of the task list the task belongs to (uses default if not specified)",
      },
    },
    required: ["taskId"],
  },
};

export const CREATE_TASKLIST_TOOL: Tool = {
  name: "google_tasks_create_tasklist",
  description: "Create a new task list",
  inputSchema: {
    type: "object",
    properties: {
      title: {
        type: "string",
        description: "Title of the new task list",
      },
    },
    required: ["title"],
  },
};

export const DELETE_TASKLIST_TOOL: Tool = {
  name: "google_tasks_delete_tasklist",
  description: "Delete a task list",
  inputSchema: {
    type: "object",
    properties: {
      taskListId: {
        type: "string",
        description: "ID of the task list to delete",
      },
    },
    required: ["taskListId"],
  },
};

export const tasksTools = [
  SET_DEFAULT_TASKLIST_TOOL,
  LIST_TASKLISTS_TOOL,
  LIST_TASKS_TOOL,
  GET_TASK_TOOL,
  CREATE_TASK_TOOL,
  UPDATE_TASK_TOOL,
  COMPLETE_TASK_TOOL,
  DELETE_TASK_TOOL,
  CREATE_TASKLIST_TOOL,
  DELETE_TASKLIST_TOOL,
];
