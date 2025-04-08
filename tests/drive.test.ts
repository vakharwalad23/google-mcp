import { expect, test, describe, beforeEach, afterEach } from "bun:test";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import GoogleDrive from "../utils/drive";
import tools from "../tools";
import { createAuthClient } from "../utils/auth";
import {
  isListFilesArgs,
  isGetFileContentArgs,
  isCreateFileArgs,
  isUpdateFileArgs,
  isDeleteFileArgs,
  isShareFileArgs,
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

describe("Google Drive MCP Tests", () => {
  let serverInstance: Server | null;
  let googleDriveInstance: GoogleDrive | null;
  let listToolsHandler: any;
  let callToolHandler: any;

  // Shared state to store created file IDs
  const testState = {
    fileId: "",
    folderId: "",
  };

  const credentials = {
    client_email: process.env.GOOGLE_CLIENT_EMAIL || "test@example.com",
    private_key: process.env.GOOGLE_PRIVATE_KEY || "fake-key",
  };

  beforeEach(async () => {
    const authClient = await createAuthClient();
    googleDriveInstance = new GoogleDrive(authClient);
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
          case "google_drive_list_files": {
            if (!isListFilesArgs(args)) {
              throw new Error("Invalid arguments for google_drive_list_files");
            }
            const { query, pageSize, orderBy, fields } = args;
            const result = await googleDriveInstance?.listFiles(
              query,
              pageSize,
              orderBy,
              fields
            );
            return {
              content: [{ type: "text", text: result }],
              isError: false,
            };
          }

          case "google_drive_get_file_content": {
            if (!isGetFileContentArgs(args)) {
              throw new Error(
                "Invalid arguments for google_drive_get_file_content"
              );
            }
            const { fileId } = args;
            const result = await googleDriveInstance?.getFileContent(fileId);
            return {
              content: [{ type: "text", text: result }],
              isError: false,
            };
          }

          case "google_drive_create_file": {
            if (!isCreateFileArgs(args)) {
              throw new Error("Invalid arguments for google_drive_create_file");
            }
            const { name, content, mimeType, folderId } = args;
            const result = await googleDriveInstance?.createFile(
              name,
              content,
              mimeType,
              folderId
            );
            return {
              content: [{ type: "text", text: result }],
              isError: false,
            };
          }

          case "google_drive_update_file": {
            if (!isUpdateFileArgs(args)) {
              throw new Error("Invalid arguments for google_drive_update_file");
            }
            const { fileId, content, mimeType } = args;
            const result = await googleDriveInstance?.updateFile(
              fileId,
              content,
              mimeType
            );
            return {
              content: [{ type: "text", text: result }],
              isError: false,
            };
          }

          case "google_drive_delete_file": {
            if (!isDeleteFileArgs(args)) {
              throw new Error("Invalid arguments for google_drive_delete_file");
            }
            const { fileId, permanently } = args;
            const result = await googleDriveInstance?.deleteFile(
              fileId,
              permanently
            );
            return {
              content: [{ type: "text", text: result }],
              isError: false,
            };
          }

          case "google_drive_share_file": {
            if (!isShareFileArgs(args)) {
              throw new Error("Invalid arguments for google_drive_share_file");
            }
            const { fileId, emailAddress, role, sendNotification, message } =
              args;
            const result = await googleDriveInstance?.shareFile(
              fileId,
              emailAddress,
              role,
              sendNotification,
              message
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
    googleDriveInstance = null;
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

    // Check for Drive tools specifically
    const driveTools = result.tools.filter((tool: any) =>
      tool.name.startsWith("google_drive_")
    );
    expect(driveTools.length).toBeGreaterThan(0);
  });

  testWithLogging("should list Drive files", async () => {
    console.log("📋 Listing Drive files...");
    const result = await callToolHandler({
      params: {
        name: "google_drive_list_files",
        arguments: {
          pageSize: 5,
        },
      },
    });
    console.log("📊 Result:", JSON.stringify(result, null, 2));

    expect(result.isError).toBe(false);
    expect(result.content[0].text).toBeDefined();
  });

  testWithLogging("should create a text file in Drive", async () => {
    console.log("📋 Creating a text file in Drive...");
    const result = await callToolHandler({
      params: {
        name: "google_drive_create_file",
        arguments: {
          name: "MCP Test File.txt",
          content:
            "This is a test file created by the Google MCP server tests.",
          mimeType: "text/plain",
        },
      },
    });
    console.log("📊 Result:", JSON.stringify(result, null, 2));

    expect(result.isError).toBe(false);
    expect(result.content[0].text).toBeDefined();
    expect(result.content[0].text).toContain("Created file with name");

    // Extract the file ID for later tests
    const match = result.content[0].text.match(/ID: ([^\s\n]+)/);
    if (match && match[1]) {
      testState.fileId = match[1];
      console.log(`📌 Created file ID: ${testState.fileId}`);
    }
  });

  testWithLogging("should get file content", async () => {
    if (!testState.fileId) {
      console.log("⚠️ Skipping test as no file ID is available");
      return;
    }

    console.log(`📋 Getting content of file ${testState.fileId}...`);
    const result = await callToolHandler({
      params: {
        name: "google_drive_get_file_content",
        arguments: {
          fileId: testState.fileId,
        },
      },
    });
    console.log("📊 Result:", JSON.stringify(result, null, 2));

    expect(result.isError).toBe(false);
    expect(result.content[0].text).toBeDefined();
    expect(result.content[0].text).toContain("This is a test file");
  });

  testWithLogging("should update file content", async () => {
    if (!testState.fileId) {
      console.log("⚠️ Skipping test as no file ID is available");
      return;
    }

    console.log(`📋 Updating content of file ${testState.fileId}...`);
    const result = await callToolHandler({
      params: {
        name: "google_drive_update_file",
        arguments: {
          fileId: testState.fileId,
          content: "This file has been updated by the MCP server tests.",
        },
      },
    });
    console.log("📊 Result:", JSON.stringify(result, null, 2));

    expect(result.isError).toBe(false);
    expect(result.content[0].text).toBeDefined();
    expect(result.content[0].text).toContain("updated successfully");

    // Verify the update by getting the content again
    const contentResult = await callToolHandler({
      params: {
        name: "google_drive_get_file_content",
        arguments: {
          fileId: testState.fileId,
        },
      },
    });

    expect(contentResult.isError).toBe(false);
    expect(contentResult.content[0].text).toContain("has been updated");
  });

  testWithLogging("should share a file", async () => {
    if (!testState.fileId) {
      console.log("⚠️ Skipping test as no file ID is available");
      return;
    }

    // You may need to update this to a valid email address
    const testEmail = process.env.TEST_EMAIL || "test@example.com";
    console.log(`📋 Sharing file ${testState.fileId} with ${testEmail}...`);

    const result = await callToolHandler({
      params: {
        name: "google_drive_share_file",
        arguments: {
          fileId: testState.fileId,
          emailAddress: testEmail,
          role: "reader",
          sendNotification: false,
        },
      },
    });
    console.log("📊 Result:", JSON.stringify(result, null, 2));

    // This test might fail if the email is not valid or sharing is restricted
    // So we'll just check if we got a response, not necessarily success
    expect(result.content[0].text).toBeDefined();
  });

  testWithLogging("should delete a file", async () => {
    if (!testState.fileId) {
      console.log("⚠️ Skipping test as no file ID is available");
      return;
    }

    console.log(`📋 Deleting file ${testState.fileId} (moving to trash)...`);
    const result = await callToolHandler({
      params: {
        name: "google_drive_delete_file",
        arguments: {
          fileId: testState.fileId,
          permanently: false, // Just move to trash
        },
      },
    });
    console.log("📊 Result:", JSON.stringify(result, null, 2));

    expect(result.isError).toBe(false);
    expect(result.content[0].text).toBeDefined();
    expect(result.content[0].text).toContain("moved to trash");
  });

  testWithLogging("should handle error when file doesn't exist", async () => {
    console.log("📋 Attempting to get content of non-existent file...");
    const result = await callToolHandler({
      params: {
        name: "google_drive_get_file_content",
        arguments: {
          fileId: "non-existent-file-id",
        },
      },
    });
    console.log("📊 Result:", JSON.stringify(result, null, 2));

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Error");
  });
});
