import { expect, test, describe, beforeEach, afterEach } from "bun:test";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import GoogleGmail from "../utils/gmail";
import tools from "../tools";
import { createAuthClient } from "../utils/auth";
import {
  isListLabelsArgs,
  isListEmailsArgs,
  isGetEmailArgs,
  isSendEmailArgs,
  isDraftEmailArgs,
  isDeleteEmailArgs,
  isModifyLabelsArgs,
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

describe("Google Gmail MCP Tests", () => {
  let serverInstance: Server | null;
  let googleGmailInstance: GoogleGmail | null;
  let listToolsHandler: any;
  let callToolHandler: any;

  // Shared state to store created email and draft IDs
  const testState = {
    emailId: "",
    draftId: "",
    labels: [] as any[],
  };

  const credentials = {
    client_email: process.env.GOOGLE_CLIENT_EMAIL || "test@example.com",
    private_key: process.env.GOOGLE_PRIVATE_KEY || "fake-key",
  };

  beforeEach(() => {
    const authClient = createAuthClient(credentials);
    googleGmailInstance = new GoogleGmail(authClient);
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
          case "google_gmail_list_labels": {
            if (!isListLabelsArgs(args)) {
              throw new Error("Invalid arguments for google_gmail_list_labels");
            }
            const labels = await googleGmailInstance?.listLabels();
            const formattedResult = labels
              .map(
                (label: any) =>
                  `${label.name} - ID: ${label.id} (${label.type})`
              )
              .join("\n");
            return {
              content: [{ type: "text", text: formattedResult }],
              isError: false,
            };
          }

          case "google_gmail_list_emails": {
            if (!isListEmailsArgs(args)) {
              throw new Error("Invalid arguments for google_gmail_list_emails");
            }
            const { labelIds, maxResults, query } = args;
            const result = await googleGmailInstance?.listEmails(
              labelIds,
              maxResults,
              query
            );
            return {
              content: [{ type: "text", text: result }],
              isError: false,
            };
          }

          case "google_gmail_get_email": {
            if (!isGetEmailArgs(args)) {
              throw new Error("Invalid arguments for google_gmail_get_email");
            }
            const { messageId, format } = args;
            const result = await googleGmailInstance?.getEmail(
              messageId,
              format
            );
            return {
              content: [{ type: "text", text: result }],
              isError: false,
            };
          }

          case "google_gmail_send_email": {
            if (!isSendEmailArgs(args)) {
              throw new Error("Invalid arguments for google_gmail_send_email");
            }
            const { to, subject, body, cc, bcc, isHtml } = args;
            const result = await googleGmailInstance?.sendEmail(
              to,
              subject,
              body,
              cc,
              bcc,
              isHtml
            );
            return {
              content: [{ type: "text", text: result }],
              isError: false,
            };
          }

          case "google_gmail_draft_email": {
            if (!isDraftEmailArgs(args)) {
              throw new Error("Invalid arguments for google_gmail_draft_email");
            }
            const { to, subject, body, cc, bcc, isHtml } = args;
            const result = await googleGmailInstance?.draftEmail(
              to,
              subject,
              body,
              cc,
              bcc,
              isHtml
            );
            return {
              content: [{ type: "text", text: result }],
              isError: false,
            };
          }

          case "google_gmail_delete_email": {
            if (!isDeleteEmailArgs(args)) {
              throw new Error(
                "Invalid arguments for google_gmail_delete_email"
              );
            }
            const { messageId, permanently } = args;
            const result = await googleGmailInstance?.deleteEmail(
              messageId,
              permanently
            );
            return {
              content: [{ type: "text", text: result }],
              isError: false,
            };
          }

          case "google_gmail_modify_labels": {
            if (!isModifyLabelsArgs(args)) {
              throw new Error(
                "Invalid arguments for google_gmail_modify_labels"
              );
            }
            const { messageId, addLabelIds, removeLabelIds } = args;
            const result = await googleGmailInstance?.modifyLabels(
              messageId,
              addLabelIds,
              removeLabelIds
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
    googleGmailInstance = null;
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

    // Check for Gmail tools specifically
    const gmailTools = result.tools.filter((tool: any) =>
      tool.name.startsWith("google_gmail_")
    );
    expect(gmailTools.length).toBeGreaterThan(0);
  });

  testWithLogging("should list Gmail labels", async () => {
    console.log("📋 Listing Gmail labels...");
    const result = await callToolHandler({
      params: {
        name: "google_gmail_list_labels",
        arguments: {},
      },
    });
    console.log("📊 Result:", JSON.stringify(result, null, 2));

    expect(result.isError).toBe(false);
    expect(result.content[0].text).toBeDefined();

    // Store labels for later use
    if (!result.isError && result.content[0].text) {
      const labelLines = result.content[0].text.split("\n");
      for (const line of labelLines) {
        const match = line.match(/^(.+) - ID: (.+) \((.+)\)$/);
        if (match) {
          testState.labels.push({
            name: match[1],
            id: match[2],
            type: match[3],
          });
        }
      }
      console.log(`📌 Found ${testState.labels.length} labels`);
    }
  });

  // PHASE 2: List emails
  testWithLogging("should list emails from inbox", async () => {
    const inboxLabel = testState.labels.find(
      (label) => label.id === "INBOX"
    ) || { id: "INBOX" };
    console.log(`📋 Listing emails from ${inboxLabel.id} (max: 3)...`);
    const result = await callToolHandler({
      params: {
        name: "google_gmail_list_emails",
        arguments: {
          labelIds: [inboxLabel.id],
          maxResults: 3,
        },
      },
    });
    console.log("📊 Result:", JSON.stringify(result, null, 2));

    expect(result.isError).toBe(false);

    // If we found emails, store first email ID for later tests
    if (
      !result.isError &&
      result.content[0].text &&
      !result.content[0].text.includes("No messages found")
    ) {
      const match = result.content[0].text.match(/ID: ([^\n]+)/);
      if (match && match[1]) {
        testState.emailId = match[1];
        console.log(`📌 Captured email ID: ${testState.emailId}`);
      }
    }
  });

  // PHASE 3: Get specific email if we have an ID
  testWithLogging("should get specific email by ID", async () => {
    if (!testState.emailId) {
      console.log("⚠️ No email ID available to test with - skipping test");
      expect(true).toBe(true); // Skip test
      return;
    }

    console.log(`📋 Getting email details for ID: ${testState.emailId}`);
    const result = await callToolHandler({
      params: {
        name: "google_gmail_get_email",
        arguments: {
          messageId: testState.emailId,
          format: "full",
        },
      },
    });
    console.log("📊 Result:", JSON.stringify(result, null, 2));

    expect(result.isError).toBe(false);
    expect(result.content[0].text).toContain("Subject:");
    expect(result.content[0].text).toContain("From:");
    expect(result.content[0].text).toContain("Body:");
  });

  // PHASE 4: Create email draft
  testWithLogging("should create email draft", async () => {
    const testEmail = process.env.TEST_EMAIL || "test@example.com";
    const draftDetails = {
      to: [testEmail],
      subject: "Test Draft Email from MCP Tests",
      body: "This is a test draft email created by automated tests.",
      isHtml: false,
    };

    console.log(`📋 Creating email draft...`);
    const result = await callToolHandler({
      params: {
        name: "google_gmail_draft_email",
        arguments: draftDetails,
      },
    });
    console.log("📊 Result:", JSON.stringify(result, null, 2));

    expect(result.isError).toBe(false);
    expect(result.content[0].text).toContain("Draft created successfully");

    // Extract draft ID if available
    const match = result.content[0].text.match(/Draft ID: ([^\s]+)/);
    if (match && match[1]) {
      testState.draftId = match[1];
      console.log(`📌 Captured draft ID: ${testState.draftId}`);
    }

    expect(testState.draftId).toBeTruthy();
  });

  // PHASE 5: Send test email
  testWithLogging("should send email", async () => {
    const testEmail = process.env.TEST_EMAIL || "test@example.com";
    const emailDetails = {
      to: [testEmail],
      subject: "Test Email from MCP Tests",
      body: "This is a test email sent by automated tests.",
      isHtml: false,
    };

    console.log(`📋 Sending test email...`);
    const result = await callToolHandler({
      params: {
        name: "google_gmail_send_email",
        arguments: emailDetails,
      },
    });
    console.log("📊 Result:", JSON.stringify(result, null, 2));

    expect(result.isError).toBe(false);
    expect(result.content[0].text).toContain("Email sent successfully");

    // Extract message ID if available
    const match = result.content[0].text.match(/Message ID: ([^\s]+)/);
    if (match && match[1]) {
      testState.emailId = match[1];
      console.log(`📌 Captured sent email ID: ${testState.emailId}`);
    }
  });

  // PHASE 6: Modify email labels (if we have an email ID)
  testWithLogging("should modify email labels", async () => {
    if (!testState.emailId) {
      console.log("⚠️ No email ID available to test with - skipping test");
      expect(true).toBe(true); // Skip test
      return;
    }

    // Find a non-system label if available, otherwise use "IMPORTANT"
    const testLabel = testState.labels.find((l) => l.type === "user") ||
      testState.labels.find((l) => l.id === "IMPORTANT") || { id: "IMPORTANT" };

    console.log(`📋 Modifying labels for email ID: ${testState.emailId}`);
    const result = await callToolHandler({
      params: {
        name: "google_gmail_modify_labels",
        arguments: {
          messageId: testState.emailId,
          addLabelIds: [testLabel.id],
        },
      },
    });
    console.log("📊 Result:", JSON.stringify(result, null, 2));

    expect(result.isError).toBe(false);
    expect(result.content[0].text).toContain("Successfully modified labels");
  });

  // PHASE 7: Delete email (if we have an email ID)
  testWithLogging(
    "should trash (not permanently delete) an email",
    async () => {
      if (!testState.emailId) {
        console.log("⚠️ No email ID available to test with - skipping test");
        expect(true).toBe(true); // Skip test
        return;
      }

      console.log(`📋 Moving email to trash: ${testState.emailId}`);
      const result = await callToolHandler({
        params: {
          name: "google_gmail_delete_email",
          arguments: {
            messageId: testState.emailId,
            permanently: false,
          },
        },
      });
      console.log("📊 Result:", JSON.stringify(result, null, 2));

      expect(result.isError).toBe(false);
      expect(result.content[0].text).toContain("moved to trash");
    }
  );

  // PHASE 8: Error Handling Tests
  testWithLogging("should handle invalid tool name", async () => {
    console.log("📋 Testing invalid tool name...");
    const result = await callToolHandler({
      params: {
        name: "google_gmail_nonexistent_tool",
        arguments: {},
      },
    });
    console.log("📊 Result:", JSON.stringify(result, null, 2));

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Unknown tool:");
  });

  testWithLogging(
    "should handle invalid arguments for sending email",
    async () => {
      console.log("📋 Testing invalid arguments for email sending...");
      const result = await callToolHandler({
        params: {
          name: "google_gmail_send_email",
          arguments: { subject: "Missing recipients and body" },
        },
      });
      console.log("📊 Result:", JSON.stringify(result, null, 2));

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain("Error:");
    }
  );

  testWithLogging("should handle invalid message ID", async () => {
    console.log("📋 Testing invalid message ID for getting email...");
    const result = await callToolHandler({
      params: {
        name: "google_gmail_get_email",
        arguments: { messageId: "nonexistent-id-123456789" },
      },
    });
    console.log("📊 Result:", JSON.stringify(result, null, 2));

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Error:");
  });
});
