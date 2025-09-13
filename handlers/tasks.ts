import GoogleTasks from "../utils/tasks";
import {
  isSetDefaultTaskListArgs,
  isListTaskListsArgs,
  isListTasksArgs,
  isGetTaskArgs,
  isCreateTaskArgs,
  isUpdateTaskArgs,
  isCompleteTaskArgs,
  isDeleteTaskArgs,
  isCreateTaskListArgs,
  isDeleteTaskListArgs,
} from "../utils/helper";

export async function handleTasksSetDefaultList(
  args: any,
  googleTasksInstance: GoogleTasks
) {
  if (!isSetDefaultTaskListArgs(args)) {
    throw new Error("Invalid arguments for google_tasks_set_default_list");
  }
  const { taskListId } = args;
  const result = googleTasksInstance.setDefaultTaskList(taskListId);
  return {
    content: [{ type: "text", text: result }],
    isError: false,
  };
}

export async function handleTasksListTasklists(
  args: any,
  googleTasksInstance: GoogleTasks
) {
  if (!isListTaskListsArgs(args)) {
    throw new Error("Invalid arguments for google_tasks_list_tasklists");
  }
  const result = await googleTasksInstance.listTaskLists();
  return {
    content: [{ type: "text", text: result }],
    isError: false,
  };
}

export async function handleTasksListTasks(
  args: any,
  googleTasksInstance: GoogleTasks
) {
  if (!isListTasksArgs(args)) {
    throw new Error("Invalid arguments for google_tasks_list_tasks");
  }
  const { taskListId, showCompleted } = args;
  const result = await googleTasksInstance.listTasks(taskListId, showCompleted);
  return {
    content: [{ type: "text", text: result }],
    isError: false,
  };
}

export async function handleTasksGetTask(
  args: any,
  googleTasksInstance: GoogleTasks
) {
  if (!isGetTaskArgs(args)) {
    throw new Error("Invalid arguments for google_tasks_get_task");
  }
  const { taskId, taskListId } = args;
  const result = await googleTasksInstance.getTask(taskId, taskListId);
  return {
    content: [{ type: "text", text: result }],
    isError: false,
  };
}

export async function handleTasksCreateTask(
  args: any,
  googleTasksInstance: GoogleTasks
) {
  if (!isCreateTaskArgs(args)) {
    throw new Error("Invalid arguments for google_tasks_create_task");
  }
  const { title, notes, due, taskListId } = args;
  const result = await googleTasksInstance.createTask(
    title,
    notes,
    due,
    taskListId
  );
  return {
    content: [{ type: "text", text: result }],
    isError: false,
  };
}

export async function handleTasksUpdateTask(
  args: any,
  googleTasksInstance: GoogleTasks
) {
  if (!isUpdateTaskArgs(args)) {
    throw new Error("Invalid arguments for google_tasks_update_task");
  }
  const { taskId, title, notes, due, status, taskListId } = args;
  const result = await googleTasksInstance.updateTask(
    taskId,
    { title, notes, due, status },
    taskListId
  );
  return {
    content: [{ type: "text", text: result }],
    isError: false,
  };
}

export async function handleTasksCompleteTask(
  args: any,
  googleTasksInstance: GoogleTasks
) {
  if (!isCompleteTaskArgs(args)) {
    throw new Error("Invalid arguments for google_tasks_complete_task");
  }
  const { taskId, taskListId } = args;
  const result = await googleTasksInstance.completeTask(taskId, taskListId);
  return {
    content: [{ type: "text", text: result }],
    isError: false,
  };
}

export async function handleTasksDeleteTask(
  args: any,
  googleTasksInstance: GoogleTasks
) {
  if (!isDeleteTaskArgs(args)) {
    throw new Error("Invalid arguments for google_tasks_delete_task");
  }
  const { taskId, taskListId } = args;
  const result = await googleTasksInstance.deleteTask(taskId, taskListId);
  return {
    content: [{ type: "text", text: result }],
    isError: false,
  };
}

export async function handleTasksCreateTasklist(
  args: any,
  googleTasksInstance: GoogleTasks
) {
  if (!isCreateTaskListArgs(args)) {
    throw new Error("Invalid arguments for google_tasks_create_tasklist");
  }
  const { title } = args;
  const result = await googleTasksInstance.createTaskList(title);
  return {
    content: [{ type: "text", text: result }],
    isError: false,
  };
}

export async function handleTasksDeleteTasklist(
  args: any,
  googleTasksInstance: GoogleTasks
) {
  if (!isDeleteTaskListArgs(args)) {
    throw new Error("Invalid arguments for google_tasks_delete_tasklist");
  }
  const { taskListId } = args;
  const result = await googleTasksInstance.deleteTaskList(taskListId);
  return {
    content: [{ type: "text", text: result }],
    isError: false,
  };
}
