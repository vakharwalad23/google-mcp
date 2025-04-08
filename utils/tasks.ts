import { google } from "googleapis";

export default class GoogleTasks {
  private tasks: any;
  private defaultTaskList: string;

  constructor(authClient: any, defaultTaskList: string = "@default") {
    this.tasks = google.tasks({ version: "v1", auth: authClient });
    this.defaultTaskList = defaultTaskList;
  }

  setDefaultTaskList(taskListId: string) {
    this.defaultTaskList = taskListId;
    return `Default task list ID set to: ${taskListId}`;
  }

  async listTaskLists() {
    try {
      const response = await this.tasks.tasklists.list({
        maxResults: 100,
      });

      if (!response.data.items || response.data.items.length === 0) {
        return "No task lists found.";
      }

      return response.data.items
        .map((list: any) => `${list.title} - ID: ${list.id}`)
        .join("\n");
    } catch (error) {
      throw new Error(
        `Failed to list task lists: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async listTasks(taskListId?: string, showCompleted: boolean = false) {
    try {
      const targetTaskList = taskListId || this.defaultTaskList;
      const response = await this.tasks.tasks.list({
        tasklist: targetTaskList,
        showCompleted: showCompleted,
        maxResults: 100,
      });

      if (!response.data.items || response.data.items.length === 0) {
        return `No tasks found in task list: ${targetTaskList}`;
      }

      // Format the tasks
      return response.data.items
        .map((task: any, index: number) => {
          const due = task.due
            ? `Due: ${new Date(task.due).toLocaleString()}`
            : "";
          const completed = task.completed
            ? `Completed: ${new Date(task.completed).toLocaleString()}`
            : "";
          const status = task.status || "";

          return `[${index + 1}] ${task.title} - ID: ${task.id}
Status: ${status}
${due}
${completed}
${task.notes ? `Notes: ${task.notes}` : ""}`;
        })
        .join("\n\n");
    } catch (error) {
      throw new Error(
        `Failed to list tasks: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async getTask(taskId: string, taskListId?: string) {
    try {
      const targetTaskList = taskListId || this.defaultTaskList;
      const response = await this.tasks.tasks.get({
        tasklist: targetTaskList,
        task: taskId,
      });

      const task = response.data;
      const due = task.due ? `Due: ${new Date(task.due).toLocaleString()}` : "";
      const completed = task.completed
        ? `Completed: ${new Date(task.completed).toLocaleString()}`
        : "";
      const status = task.status || "";

      return `Task: ${task.title}
ID: ${task.id}
Status: ${status}
${due}
${completed}
${task.notes ? `Notes: ${task.notes}` : ""}`;
    } catch (error) {
      throw new Error(
        `Failed to get task: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async createTask(
    title: string,
    notes?: string,
    due?: string,
    taskListId?: string
  ) {
    try {
      const targetTaskList = taskListId || this.defaultTaskList;

      // Prepare task data
      const taskData: any = {
        title: title,
      };

      if (notes) taskData.notes = notes;
      if (due) taskData.due = due;

      const response = await this.tasks.tasks.insert({
        tasklist: targetTaskList,
        requestBody: taskData,
      });

      return `Task created: "${response.data.title}" with ID: ${response.data.id}`;
    } catch (error) {
      throw new Error(
        `Failed to create task: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async updateTask(
    taskId: string,
    data: {
      title?: string;
      notes?: string;
      due?: string;
      status?: string;
    },
    taskListId?: string
  ) {
    try {
      const targetTaskList = taskListId || this.defaultTaskList;

      // Get current task data
      const currentTask = await this.tasks.tasks.get({
        tasklist: targetTaskList,
        task: taskId,
      });

      // Prepare updated task data
      const updatedTask = { ...currentTask.data };

      if (data.title !== undefined) updatedTask.title = data.title;
      if (data.notes !== undefined) updatedTask.notes = data.notes;
      if (data.due !== undefined) updatedTask.due = data.due;
      if (data.status !== undefined) updatedTask.status = data.status;

      const response = await this.tasks.tasks.update({
        tasklist: targetTaskList,
        task: taskId,
        requestBody: updatedTask,
      });

      return `Task updated: "${response.data.title}" with ID: ${response.data.id}`;
    } catch (error) {
      throw new Error(
        `Failed to update task: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async completeTask(taskId: string, taskListId?: string) {
    try {
      const targetTaskList = taskListId || this.defaultTaskList;

      await this.updateTask(taskId, { status: "completed" }, targetTaskList);

      return `Task ${taskId} marked as completed.`;
    } catch (error) {
      throw new Error(
        `Failed to complete task: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async deleteTask(taskId: string, taskListId?: string) {
    try {
      const targetTaskList = taskListId || this.defaultTaskList;

      await this.tasks.tasks.delete({
        tasklist: targetTaskList,
        task: taskId,
      });

      return `Task ${taskId} deleted from task list ${targetTaskList}.`;
    } catch (error) {
      throw new Error(
        `Failed to delete task: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async createTaskList(title: string) {
    try {
      const response = await this.tasks.tasklists.insert({
        requestBody: {
          title: title,
        },
      });

      return `Task list created: "${response.data.title}" with ID: ${response.data.id}`;
    } catch (error) {
      throw new Error(
        `Failed to create task list: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async deleteTaskList(taskListId: string) {
    try {
      await this.tasks.tasklists.delete({
        tasklist: taskListId,
      });

      return `Task list ${taskListId} deleted.`;
    } catch (error) {
      throw new Error(
        `Failed to delete task list: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
