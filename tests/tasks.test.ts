import { expect, test, describe, beforeEach, afterEach } from "bun:test";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import GoogleTasks from "../utils/tasks";
import tools from "../tools";
import { createAuthClient } from "../utils/auth";
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

function testWithLogging(name: string, testFn: () => Promise<void>) {
  test(name, async () => {
    console.log(`\n🧪 Running test: ${name}`);
    try {
      await testFn();
      console.log(`✅ Test passed: ${name}`);
    } catch (error) {
      console.log(`❌ Test failed: ${name}`);
      console.error(error);
      throw error;
    }
  });
}

describe("Google Tasks MCP Tests", () => {
  let serverInstance: Server | null;
  let googleTasksInstance: GoogleTasks | null;
  let listToolsHandler: any;
  let callToolHandler: any;

  // Shared state to store task list and task IDs
  const testState = {
    taskListId: "",
    taskId: "",
    defaultTaskListId: "",
  };

  const credentials = {
    client_email: process.env.GOOGLE_CLIENT_EMAIL || "test@example.com",
    private_key: process.env.GOOGLE_PRIVATE_KEY || "fake-key",
  };

  beforeEach(async () => {
    const authClient = await createAuthClient();
    googleTasksInstance = new GoogleTasks(authClient);
    serverInstance = new Server(
      { name: "Google MCP Server", version: "0.0.1" },
      { capabilities: { tools: {} } }
    );

    listToolsHandler = async () => ({ tools });
    serverInstance.setRequestHandler(ListToolsRequestSchema, listToolsHandler);

    callToolHandler = async (request: any) => {
      try {
        const { name, arguments: args } = request.params;
        if (!args) throw new Error("No arguments provided");

        switch (name) {
          case "google_tasks_set_default_list": {
            if (!isSetDefaultTaskListArgs(args)) {
              throw new Error(
                "Invalid arguments for google_tasks_set_default_list"
              );
            }
            const { taskListId } = args;
            const result = googleTasksInstance?.setDefaultTaskList(taskListId);
            return {
              content: [{ type: "text", text: result }],
              isError: false,
            };
          }

          case "google_tasks_list_tasklists": {
            if (!isListTaskListsArgs(args)) {
              throw new Error(
                "Invalid arguments for google_tasks_list_tasklists"
              );
            }
            const result = await googleTasksInstance?.listTaskLists();
            return {
              content: [{ type: "text", text: result }],
              isError: false,
            };
          }

          case "google_tasks_list_tasks": {
            if (!isListTasksArgs(args)) {
              throw new Error("Invalid arguments for google_tasks_list_tasks");
            }
            const { taskListId, showCompleted } = args;
            const result = await googleTasksInstance?.listTasks(
              taskListId,
              showCompleted
            );
            return {
              content: [{ type: "text", text: result }],
              isError: false,
            };
          }

          case "google_tasks_get_task": {
            if (!isGetTaskArgs(args)) {
              throw new Error("Invalid arguments for google_tasks_get_task");
            }
            const { taskId, taskListId } = args;
            const result = await googleTasksInstance?.getTask(
              taskId,
              taskListId
            );
            return {
              content: [{ type: "text", text: result }],
              isError: false,
            };
          }

          case "google_tasks_create_task": {
            if (!isCreateTaskArgs(args)) {
              throw new Error("Invalid arguments for google_tasks_create_task");
            }
            const { title, notes, due, taskListId } = args;
            const result = await googleTasksInstance?.createTask(
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

          case "google_tasks_update_task": {
            if (!isUpdateTaskArgs(args)) {
              throw new Error("Invalid arguments for google_tasks_update_task");
            }
            const { taskId, title, notes, due, status, taskListId } = args;
            const result = await googleTasksInstance?.updateTask(
              taskId,
              { title, notes, due, status },
              taskListId
            );
            return {
              content: [{ type: "text", text: result }],
              isError: false,
            };
          }

          case "google_tasks_complete_task": {
            if (!isCompleteTaskArgs(args)) {
              throw new Error(
                "Invalid arguments for google_tasks_complete_task"
              );
            }
            const { taskId, taskListId } = args;
            const result = await googleTasksInstance?.completeTask(
              taskId,
              taskListId
            );
            return {
              content: [{ type: "text", text: result }],
              isError: false,
            };
          }

          case "google_tasks_delete_task": {
            if (!isDeleteTaskArgs(args)) {
              throw new Error("Invalid arguments for google_tasks_delete_task");
            }
            const { taskId, taskListId } = args;
            const result = await googleTasksInstance?.deleteTask(
              taskId,
              taskListId
            );
            return {
              content: [{ type: "text", text: result }],
              isError: false,
            };
          }

          case "google_tasks_create_tasklist": {
            if (!isCreateTaskListArgs(args)) {
              throw new Error(
                "Invalid arguments for google_tasks_create_tasklist"
              );
            }
            const { title } = args;
            const result = await googleTasksInstance?.createTaskList(title);
            return {
              content: [{ type: "text", text: result }],
              isError: false,
            };
          }

          case "google_tasks_delete_tasklist": {
            if (!isDeleteTaskListArgs(args)) {
              throw new Error(
                "Invalid arguments for google_tasks_delete_tasklist"
              );
            }
            const { taskListId } = args;
            const result = await googleTasksInstance?.deleteTaskList(
              taskListId
            );
            return {
              content: [{ type: "text", text: result }],
              isError: false,
            };
          }

          default:
            return {
              content: [{ type: "text", text: `Unknown tool: ${name}` }],
              isError: true,
            };
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        };
      }
    };
    serverInstance.setRequestHandler(CallToolRequestSchema, callToolHandler);
  });

  afterEach(() => {
    serverInstance = null;
    googleTasksInstance = null;
    listToolsHandler = null;
    callToolHandler = null;
  });

  // PHASE 1: Basic API and Setup Tests
  testWithLogging("should list available tools", async () => {
    console.log("📋 Calling listToolsHandler...");
    const result = await listToolsHandler({
      params: {},
    });
    console.log("📊 Result:", JSON.stringify(result, null, 2));

    expect(result).toBeDefined();
    expect(result).toHaveProperty("tools");
    expect(result.tools.length).toBeGreaterThan(0);

    // Check for Tasks tools specifically
    const tasksTools = result.tools.filter((tool: any) =>
      tool.name.startsWith("google_tasks_")
    );
    expect(tasksTools.length).toBeGreaterThan(0);
  });

  testWithLogging("should list task lists", async () => {
    console.log("📋 Listing task lists...");
    const result = await callToolHandler({
      params: {
        name: "google_tasks_list_tasklists",
        arguments: {},
      },
    });
    console.log("📊 Result:", JSON.stringify(result, null, 2));

    expect(result.isError).toBe(false);
    expect(result.content[0].text).toBeDefined();

    // Store the default task list ID if available
    if (!result.content[0].text.includes("No task lists found")) {
      const match = result.content[0].text.match(/([^\s]+) - ID: ([^\s\n]+)/);
      if (match && match[2]) {
        testState.defaultTaskListId = match[2];
        console.log(
          `📌 Using default task list ID: ${testState.defaultTaskListId}`
        );
      }
    }
  });

  testWithLogging("should create a new task list", async () => {
    console.log("📋 Creating a new task list...");
    const result = await callToolHandler({
      params: {
        name: "google_tasks_create_tasklist",
        arguments: {
          title: "MCP Test Task List",
        },
      },
    });
    console.log("📊 Result:", JSON.stringify(result, null, 2));

    expect(result.isError).toBe(false);
    expect(result.content[0].text).toBeDefined();
    expect(result.content[0].text).toContain("Task list created");

    // Extract the task list ID for later tests
    const match = result.content[0].text.match(/ID: ([^\s\n]+)/);
    if (match && match[1]) {
      testState.taskListId = match[1];
      console.log(`📌 Created task list ID: ${testState.taskListId}`);
    }
  });

  testWithLogging("should set the default task list", async () => {
    if (!testState.taskListId) {
      console.log("⚠️ Skipping test as no task list ID is available");
      return;
    }

    console.log(`📋 Setting default task list to ${testState.taskListId}...`);
    const result = await callToolHandler({
      params: {
        name: "google_tasks_set_default_list",
        arguments: {
          taskListId: testState.taskListId,
        },
      },
    });
    console.log("📊 Result:", JSON.stringify(result, null, 2));

    expect(result.isError).toBe(false);
    expect(result.content[0].text).toBeDefined();
    expect(result.content[0].text).toContain("Default task list ID set to");
  });

  testWithLogging("should create a task", async () => {
    if (!testState.taskListId) {
      console.log("⚠️ Skipping test as no task list ID is available");
      return;
    }

    console.log(`📋 Creating a task in list ${testState.taskListId}...`);
    const result = await callToolHandler({
      params: {
        name: "google_tasks_create_task",
        arguments: {
          title: "Test Task from MCP",
          notes: "This is a test task created by the MCP server tests.",
          taskListId: testState.taskListId,
        },
      },
    });
    console.log("📊 Result:", JSON.stringify(result, null, 2));

    expect(result.isError).toBe(false);
    expect(result.content[0].text).toBeDefined();
    expect(result.content[0].text).toContain("Task created");

    // Extract the task ID for later tests
    const match = result.content[0].text.match(/ID: ([^\s\n]+)/);
    if (match && match[1]) {
      testState.taskId = match[1];
      console.log(`📌 Created task ID: ${testState.taskId}`);
    }
  });

  testWithLogging("should list tasks in the task list", async () => {
    if (!testState.taskListId) {
      console.log("⚠️ Skipping test as no task list ID is available");
      return;
    }

    console.log(`📋 Listing tasks in list ${testState.taskListId}...`);
    const result = await callToolHandler({
      params: {
        name: "google_tasks_list_tasks",
        arguments: {
          taskListId: testState.taskListId,
          showCompleted: true,
        },
      },
    });
    console.log("📊 Result:", JSON.stringify(result, null, 2));

    expect(result.isError).toBe(false);
    expect(result.content[0].text).toBeDefined();

    // Our created task should be in the list
    if (testState.taskId) {
      expect(result.content[0].text).toContain("Test Task from MCP");
      expect(result.content[0].text).toContain(testState.taskId);
    }
  });

  testWithLogging("should get a specific task", async () => {
    if (!testState.taskListId || !testState.taskId) {
      console.log(
        "⚠️ Skipping test as task ID or task list ID is not available"
      );
      return;
    }

    console.log(`📋 Getting task ${testState.taskId}...`);
    const result = await callToolHandler({
      params: {
        name: "google_tasks_get_task",
        arguments: {
          taskId: testState.taskId,
          taskListId: testState.taskListId,
        },
      },
    });
    console.log("📊 Result:", JSON.stringify(result, null, 2));

    expect(result.isError).toBe(false);
    expect(result.content[0].text).toBeDefined();
    expect(result.content[0].text).toContain("Test Task from MCP");
    expect(result.content[0].text).toContain("This is a test task");
  });

  testWithLogging("should update a task", async () => {
    if (!testState.taskListId || !testState.taskId) {
      console.log(
        "⚠️ Skipping test as task ID or task list ID is not available"
      );
      return;
    }

    console.log(`📋 Updating task ${testState.taskId}...`);
    const result = await callToolHandler({
      params: {
        name: "google_tasks_update_task",
        arguments: {
          taskId: testState.taskId,
          title: "Updated Test Task",
          notes: "This task has been updated by the MCP server tests.",
          taskListId: testState.taskListId,
        },
      },
    });
    console.log("📊 Result:", JSON.stringify(result, null, 2));

    expect(result.isError).toBe(false);
    expect(result.content[0].text).toBeDefined();
    expect(result.content[0].text).toContain("Task updated");

    // Verify the update by getting the task again
    const taskResult = await callToolHandler({
      params: {
        name: "google_tasks_get_task",
        arguments: {
          taskId: testState.taskId,
          taskListId: testState.taskListId,
        },
      },
    });

    expect(taskResult.isError).toBe(false);
    expect(taskResult.content[0].text).toContain("Updated Test Task");
    expect(taskResult.content[0].text).toContain("has been updated");
  });

  testWithLogging("should complete a task", async () => {
    if (!testState.taskListId || !testState.taskId) {
      console.log(
        "⚠️ Skipping test as task ID or task list ID is not available"
      );
      return;
    }

    console.log(`📋 Completing task ${testState.taskId}...`);
    const result = await callToolHandler({
      params: {
        name: "google_tasks_complete_task",
        arguments: {
          taskId: testState.taskId,
          taskListId: testState.taskListId,
        },
      },
    });
    console.log("📊 Result:", JSON.stringify(result, null, 2));

    expect(result.isError).toBe(false);
    expect(result.content[0].text).toBeDefined();
    expect(result.content[0].text).toContain("marked as completed");

    // Verify the task is completed
    const taskResult = await callToolHandler({
      params: {
        name: "google_tasks_get_task",
        arguments: {
          taskId: testState.taskId,
          taskListId: testState.taskListId,
        },
      },
    });

    expect(taskResult.isError).toBe(false);
    expect(taskResult.content[0].text).toContain("Status: completed");
  });

  testWithLogging("should delete a task", async () => {
    if (!testState.taskListId || !testState.taskId) {
      console.log(
        "⚠️ Skipping test as task ID or task list ID is not available"
      );
      return;
    }

    console.log(`📋 Deleting task ${testState.taskId}...`);
    const result = await callToolHandler({
      params: {
        name: "google_tasks_delete_task",
        arguments: {
          taskId: testState.taskId,
          taskListId: testState.taskListId,
        },
      },
    });
    console.log("📊 Result:", JSON.stringify(result, null, 2));

    expect(result.isError).toBe(false);
    expect(result.content[0].text).toBeDefined();
    expect(result.content[0].text).toContain("deleted from task list");
  });

  testWithLogging("should delete the task list", async () => {
    if (!testState.taskListId) {
      console.log("⚠️ Skipping test as no task list ID is available");
      return;
    }

    // If we deleted the task list we were using as default, revert to the original default
    if (testState.defaultTaskListId) {
      await callToolHandler({
        params: {
          name: "google_tasks_set_default_list",
          arguments: {
            taskListId: testState.defaultTaskListId,
          },
        },
      });
    }

    console.log(`📋 Deleting task list ${testState.taskListId}...`);
    const result = await callToolHandler({
      params: {
        name: "google_tasks_delete_tasklist",
        arguments: {
          taskListId: testState.taskListId,
        },
      },
    });
    console.log("📊 Result:", JSON.stringify(result, null, 2));

    expect(result.isError).toBe(false);
    expect(result.content[0].text).toBeDefined();
    expect(result.content[0].text).toContain("Task list");
    expect(result.content[0].text).toContain("deleted");
  });

  testWithLogging("should handle error when task doesn't exist", async () => {
    console.log("📋 Attempting to get a non-existent task...");
    const result = await callToolHandler({
      params: {
        name: "google_tasks_get_task",
        arguments: {
          taskId: "non-existent-task-id",
          taskListId: testState.defaultTaskListId || "@default",
        },
      },
    });
    console.log("📊 Result:", JSON.stringify(result, null, 2));

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Error");
  });
});
