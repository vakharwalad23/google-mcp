import { google } from "googleapis";

export default class GoogleGmail {
  private gmail: any;
  private recentEmails: { id: string; subject: string }[] = [];

  constructor(authClient: any) {
    this.gmail = google.gmail({ version: "v1", auth: authClient });
  }

  async listLabels() {
    try {
      const response = await this.gmail.users.labels.list({
        userId: "me",
      });

      return response.data.labels.map((label: any) => ({
        id: label.id,
        name: label.name,
        type: label.type,
      }));
    } catch (error) {
      throw new Error(
        `Failed to list labels: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async listEmails(
    labelIds?: string[],
    maxResults: number = 10,
    query?: string
  ) {
    try {
      const response = await this.gmail.users.messages.list({
        userId: "me",
        labelIds: labelIds,
        maxResults: maxResults,
        q: query,
      });

      if (!response.data.messages || response.data.messages.length === 0) {
        this.recentEmails = [];
        return "No messages found.";
      }

      // Get details for each message
      const results = [];
      this.recentEmails = []; // Clear previous results

      for (const message of response.data.messages) {
        const msgDetails = await this.gmail.users.messages.get({
          userId: "me",
          id: message.id,
          format: "metadata",
          metadataHeaders: ["Subject", "From", "Date"],
        });

        const headers = msgDetails.data.payload.headers;
        const subject =
          headers.find((h: any) => h.name === "Subject")?.value ||
          "(No subject)";
        const from = headers.find((h: any) => h.name === "From")?.value || "";
        const date = headers.find((h: any) => h.name === "Date")?.value || "";

        // Store message data for reference
        this.recentEmails.push({
          id: message.id,
          subject: subject,
        });

        results.push({
          id: message.id,
          subject,
          from,
          date,
          snippet: msgDetails.data.snippet,
        });
      }

      // Format results with index numbers
      return results
        .map(
          (msg, index) =>
            `[${index + 1}] ID: ${msg.id}\nFrom: ${msg.from}\nDate: ${
              msg.date
            }\nSubject: ${msg.subject}\nSnippet: ${msg.snippet}`
        )
        .join("\n\n---\n\n");
    } catch (error) {
      throw new Error(
        `Failed to list emails: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  getMessageIdByIndex(index: number): string {
    if (index < 1 || index > this.recentEmails.length) {
      throw new Error(
        `Invalid email index: ${index}. Available range: 1-${this.recentEmails.length}`
      );
    }
    return this.recentEmails[index - 1].id;
  }

  async getEmail(messageId: string, format: string = "full") {
    try {
      const response = await this.gmail.users.messages.get({
        userId: "me",
        id: messageId,
        format: format,
      });

      const { payload, snippet, labelIds } = response.data;
      const headers = payload.headers;

      // Extract common headers
      const subject =
        headers.find((h: any) => h.name === "Subject")?.value || "(No subject)";
      const from = headers.find((h: any) => h.name === "From")?.value || "";
      const to = headers.find((h: any) => h.name === "To")?.value || "";
      const date = headers.find((h: any) => h.name === "Date")?.value || "";

      // Extract message body
      let body = "";
      if (payload.parts) {
        // Multipart message
        for (const part of payload.parts) {
          if (part.mimeType === "text/plain" && part.body.data) {
            body = Buffer.from(part.body.data, "base64").toString();
            break;
          } else if (part.mimeType === "text/html" && part.body.data) {
            body = Buffer.from(part.body.data, "base64").toString();
          }
        }
      } else if (payload.body && payload.body.data) {
        // Simple message
        body = Buffer.from(payload.body.data, "base64").toString();
      }

      // Format the result
      let result = `Subject: ${subject}\n`;
      result += `From: ${from}\n`;
      result += `To: ${to}\n`;
      result += `Date: ${date}\n`;
      result += `Labels: ${labelIds.join(", ")}\n\n`;
      result += `Snippet: ${snippet}\n\n`;
      result += `Body: \n${body.substring(0, 1500)}${
        body.length > 1500 ? "... (truncated)" : ""
      }`;

      return result;
    } catch (error) {
      throw new Error(
        `Failed to get email: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async sendEmail(
    to: string[],
    subject: string,
    body: string,
    cc?: string[],
    bcc?: string[],
    isHtml: boolean = false
  ) {
    try {
      const emailLines = [];

      // Add headers
      emailLines.push(`To: ${to.join(", ")}`);
      if (cc && cc.length) {
        emailLines.push(`Cc: ${cc.join(", ")}`);
      }
      if (bcc && bcc.length) {
        emailLines.push(`Bcc: ${bcc.join(", ")}`);
      }
      emailLines.push(`Subject: ${subject}`);
      emailLines.push(
        `Content-Type: ${isHtml ? "text/html" : "text/plain"}; charset=utf-8`
      );
      emailLines.push("");
      emailLines.push(body);

      // Encode the email
      const email = emailLines.join("\r\n");
      const encodedEmail = Buffer.from(email)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      // Send the email
      const res = await this.gmail.users.messages.send({
        userId: "me",
        requestBody: {
          raw: encodedEmail,
        },
      });

      return `Email sent successfully. Message ID: ${res.data.id}`;
    } catch (error) {
      throw new Error(
        `Failed to send email: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async draftEmail(
    to: string[],
    subject: string,
    body: string,
    cc?: string[],
    bcc?: string[],
    isHtml: boolean = false
  ) {
    try {
      const emailLines = [];

      // Add headers
      emailLines.push(`To: ${to.join(", ")}`);
      if (cc && cc.length) {
        emailLines.push(`Cc: ${cc.join(", ")}`);
      }
      if (bcc && bcc.length) {
        emailLines.push(`Bcc: ${bcc.join(", ")}`);
      }
      emailLines.push(`Subject: ${subject}`);
      emailLines.push(
        `Content-Type: ${isHtml ? "text/html" : "text/plain"}; charset=utf-8`
      );
      emailLines.push("");
      emailLines.push(body);

      // Encode the email
      const email = emailLines.join("\r\n");
      const encodedEmail = Buffer.from(email)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      // Create the draft
      const res = await this.gmail.users.drafts.create({
        userId: "me",
        requestBody: {
          message: {
            raw: encodedEmail,
          },
        },
      });

      return `Draft created successfully. Draft ID: ${res.data.id}`;
    } catch (error) {
      throw new Error(
        `Failed to create draft: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async deleteEmail(messageId: string, permanently: boolean = false) {
    try {
      if (permanently) {
        await this.gmail.users.messages.delete({
          userId: "me",
          id: messageId,
        });
        return `Message ${messageId} permanently deleted.`;
      } else {
        await this.gmail.users.messages.trash({
          userId: "me",
          id: messageId,
        });
        return `Message ${messageId} moved to trash.`;
      }
    } catch (error) {
      throw new Error(
        `Failed to delete message: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async modifyLabels(
    messageId: string,
    addLabelIds?: string[],
    removeLabelIds?: string[]
  ) {
    try {
      await this.gmail.users.messages.modify({
        userId: "me",
        id: messageId,
        requestBody: {
          addLabelIds: addLabelIds || [],
          removeLabelIds: removeLabelIds || [],
        },
      });

      let result = `Successfully modified labels for message ${messageId}.`;
      if (addLabelIds && addLabelIds.length > 0) {
        result += `\nAdded labels: ${addLabelIds.join(", ")}`;
      }
      if (removeLabelIds && removeLabelIds.length > 0) {
        result += `\nRemoved labels: ${removeLabelIds.join(", ")}`;
      }

      return result;
    } catch (error) {
      throw new Error(
        `Failed to modify labels: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
