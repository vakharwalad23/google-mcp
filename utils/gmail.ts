import { google } from "googleapis";
import * as path from "path";
import {
  FileUtils,
  type FileAttachment,
  type EmailAttachment,
} from "./fileUtils";

interface Attachment {
  filePath?: string;
  driveFileId?: string;
  filename?: string;
  mimeType?: string;
}

export default class GoogleGmail {
  private gmail: any;
  private drive: any;
  private recentEmails: { id: string; subject: string }[] = [];

  constructor(authClient: any) {
    this.gmail = google.gmail({ version: "v1", auth: authClient });
    this.drive = google.drive({ version: "v3", auth: authClient });
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

      // Get attachment information
      const attachments = await this.getEmailAttachments(messageId);

      // Format the result
      let result = `Subject: ${subject}\n`;
      result += `From: ${from}\n`;
      result += `To: ${to}\n`;
      result += `Date: ${date}\n`;
      result += `Labels: ${labelIds.join(", ")}\n\n`;
      result += `Snippet: ${snippet}\n\n`;

      if (attachments.length > 0) {
        result += `Attachments (${attachments.length}):\n`;
        attachments.forEach((att, index) => {
          result += `  ${index + 1}. ${att.filename} (${
            att.mimeType
          }, ${FileUtils.formatFileSize(att.size)})\n`;
          result += `     Attachment ID: ${att.attachmentId}\n`;
        });
        result += `\nUse google_gmail_download_attachments to download these files.\n\n`;
      }

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

  private async processAttachments(
    attachments: Attachment[]
  ): Promise<FileAttachment[]> {
    const processedAttachments: FileAttachment[] = [];

    for (const attachment of attachments) {
      if (attachment.filePath) {
        // Handle local file
        FileUtils.validateFilePath(attachment.filePath);
        const fileAttachment = await FileUtils.readFileAsBase64(
          attachment.filePath,
          attachment.filename
        );

        // Override MIME type if specified
        if (attachment.mimeType) {
          fileAttachment.mimeType = attachment.mimeType;
        }

        processedAttachments.push(fileAttachment);
      } else if (attachment.driveFileId) {
        // Handle Google Drive file
        try {
          // Get file metadata
          const metadataResponse = await this.drive.files.get({
            fileId: attachment.driveFileId,
            fields: "name,mimeType,size",
          });

          const { name, mimeType, size } = metadataResponse.data;

          // Check file size
          if (size && parseInt(size) > 25 * 1024 * 1024) {
            throw new Error(
              `Drive file size (${FileUtils.formatFileSize(
                parseInt(size)
              )}) exceeds Gmail's 25MB attachment limit`
            );
          }

          // Get file content
          const fileResponse = await this.drive.files.get({
            fileId: attachment.driveFileId,
            alt: "media",
          });

          const base64Data = Buffer.from(fileResponse.data).toString("base64");

          processedAttachments.push({
            filename: attachment.filename || name,
            mimeType:
              attachment.mimeType || mimeType || "application/octet-stream",
            data: base64Data,
            size: size ? parseInt(size) : 0,
          });
        } catch (error) {
          throw new Error(
            `Failed to fetch Drive file ${attachment.driveFileId}: ${
              error instanceof Error ? error.message : String(error)
            }`
          );
        }
      } else {
        throw new Error(
          "Invalid attachment: must provide either 'filePath' or 'driveFileId'"
        );
      }
    }

    return processedAttachments;
  }

  private async createMultipartEmail(
    to: string[],
    subject: string,
    body: string,
    cc?: string[],
    bcc?: string[],
    isHtml: boolean = false,
    attachments?: FileAttachment[]
  ): Promise<string> {
    const boundary = "boundary_" + Math.random().toString(36).substr(2, 9);
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
    emailLines.push(`MIME-Version: 1.0`);
    emailLines.push(`Content-Type: multipart/mixed; boundary="${boundary}"`);
    emailLines.push("");

    // Add body part
    emailLines.push(`--${boundary}`);
    emailLines.push(
      `Content-Type: ${isHtml ? "text/html" : "text/plain"}; charset=utf-8`
    );
    emailLines.push("");
    emailLines.push(body);
    emailLines.push("");

    // Add attachments
    if (attachments && attachments.length > 0) {
      for (const attachment of attachments) {
        emailLines.push(`--${boundary}`);
        emailLines.push(`Content-Type: ${attachment.mimeType}`);
        emailLines.push(`Content-Transfer-Encoding: base64`);
        emailLines.push(
          `Content-Disposition: attachment; filename="${attachment.filename}"`
        );
        emailLines.push("");

        // Split base64 data into 76-character lines (RFC 2045)
        const base64Lines = attachment.data.match(/.{1,76}/g) || [];
        emailLines.push(...base64Lines);
        emailLines.push("");
      }
    }

    // Close the boundary
    emailLines.push(`--${boundary}--`);

    return emailLines.join("\r\n");
  }

  async sendEmail(
    to: string[],
    subject: string,
    body: string,
    cc?: string[],
    bcc?: string[],
    isHtml: boolean = false,
    attachments?: Attachment[]
  ) {
    try {
      let processedAttachments: FileAttachment[] = [];

      // Process attachments if provided
      if (attachments && attachments.length > 0) {
        processedAttachments = await this.processAttachments(attachments);
      }

      let email: string;

      if (processedAttachments.length > 0) {
        // Use multipart email for attachments
        email = await this.createMultipartEmail(
          to,
          subject,
          body,
          cc,
          bcc,
          isHtml,
          processedAttachments
        );
      } else {
        // Use simple email format for no attachments
        const emailLines = [];
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
        email = emailLines.join("\r\n");
      }

      // Encode the email
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

      let result = `Email sent successfully. Message ID: ${res.data.id}`;
      if (processedAttachments.length > 0) {
        result += `\nAttachments: ${processedAttachments.length} file(s) attached`;
        result += `\nAttachment details:`;
        processedAttachments.forEach((att, index) => {
          result += `\n  ${index + 1}. ${att.filename} (${
            att.mimeType
          }, ${FileUtils.formatFileSize(att.size)})`;
        });
      }

      return result;
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
    isHtml: boolean = false,
    attachments?: Attachment[]
  ) {
    try {
      let processedAttachments: FileAttachment[] = [];

      // Process attachments if provided
      if (attachments && attachments.length > 0) {
        processedAttachments = await this.processAttachments(attachments);
      }

      let email: string;

      if (processedAttachments.length > 0) {
        // Use multipart email for attachments
        email = await this.createMultipartEmail(
          to,
          subject,
          body,
          cc,
          bcc,
          isHtml,
          processedAttachments
        );
      } else {
        // Use simple email format for no attachments
        const emailLines = [];
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
        email = emailLines.join("\r\n");
      }

      // Encode the email
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

      let result = `Draft created successfully. Draft ID: ${res.data.id}`;
      if (processedAttachments.length > 0) {
        result += `\nAttachments: ${processedAttachments.length} file(s) attached`;
        result += `\nAttachment details:`;
        processedAttachments.forEach((att, index) => {
          result += `\n  ${index + 1}. ${att.filename} (${
            att.mimeType
          }, ${FileUtils.formatFileSize(att.size)})`;
        });
      }

      return result;
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

  async getEmailAttachments(messageId: string): Promise<EmailAttachment[]> {
    try {
      const response = await this.gmail.users.messages.get({
        userId: "me",
        id: messageId,
        format: "full",
      });

      const attachments: EmailAttachment[] = [];
      const parts = response.data.payload.parts || [];

      const extractAttachments = (parts: any[]) => {
        for (const part of parts) {
          if (
            part.filename &&
            part.filename.length > 0 &&
            part.body.attachmentId
          ) {
            attachments.push({
              attachmentId: part.body.attachmentId,
              filename: part.filename,
              mimeType: part.mimeType || "application/octet-stream",
              size: part.body.size || 0,
            });
          }

          // Recursively check nested parts
          if (part.parts) {
            extractAttachments(part.parts);
          }
        }
      };

      extractAttachments(parts);
      return attachments;
    } catch (error) {
      throw new Error(
        `Failed to get email attachments: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async downloadAttachments(
    messageId: string,
    downloadPath?: string,
    attachmentIds?: string[]
  ): Promise<string> {
    try {
      // Get all attachments from the email
      const emailAttachments = await this.getEmailAttachments(messageId);

      if (emailAttachments.length === 0) {
        return "No attachments found in this email.";
      }

      // Filter attachments if specific IDs are provided
      const attachmentsToDownload = attachmentIds
        ? emailAttachments.filter((att) =>
            attachmentIds.includes(att.attachmentId)
          )
        : emailAttachments;

      if (attachmentsToDownload.length === 0) {
        return "No matching attachments found.";
      }

      // Use default download path if not provided
      const targetPath = downloadPath || FileUtils.getDefaultDownloadPath();

      const downloadedFiles: string[] = [];
      let totalSize = 0;

      for (const attachment of attachmentsToDownload) {
        try {
          // Get the attachment data
          const attachmentResponse =
            await this.gmail.users.messages.attachments.get({
              userId: "me",
              messageId: messageId,
              id: attachment.attachmentId,
            });

          // Sanitize filename to prevent issues
          const sanitizedFilename = FileUtils.sanitizeFilename(
            attachment.filename
          );

          // Save the attachment
          const filePath = await FileUtils.saveBase64File(
            attachmentResponse.data.data,
            sanitizedFilename,
            targetPath
          );

          downloadedFiles.push(filePath);
          totalSize += attachment.size;
        } catch (error) {
          console.error(
            `Failed to download attachment ${attachment.filename}:`,
            error
          );
          // Continue with other attachments even if one fails
        }
      }

      if (downloadedFiles.length === 0) {
        return "Failed to download any attachments.";
      }

      let result = `Successfully downloaded ${downloadedFiles.length} attachment(s)`;
      result += `\nTotal size: ${FileUtils.formatFileSize(totalSize)}`;
      result += `\nDownload location: ${targetPath}`;
      result += `\n\nDownloaded files:`;
      downloadedFiles.forEach((filePath, index) => {
        const filename = path.basename(filePath);
        result += `\n  ${index + 1}. ${filename}`;
      });

      return result;
    } catch (error) {
      throw new Error(
        `Failed to download attachments: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
