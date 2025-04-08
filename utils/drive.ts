import { google } from "googleapis";

export default class GoogleDrive {
  private drive: any;

  constructor(authClient: any) {
    this.drive = google.drive({ version: "v3", auth: authClient });
  }

  async listFiles(
    query?: string,
    pageSize: number = 10,
    orderBy?: string,
    fields?: string
  ) {
    try {
      const response = await this.drive.files.list({
        q: query || "trashed = false",
        pageSize: pageSize,
        orderBy: orderBy || "modifiedTime desc",
        fields:
          fields ||
          "files(id, name, mimeType, modifiedTime, size, webViewLink)",
      });

      if (!response.data.files || response.data.files.length === 0) {
        return "No files found.";
      }

      return response.data.files
        .map((file: any) => {
          const size = file.size
            ? `${(parseInt(file.size) / 1024).toFixed(2)} KB`
            : "N/A";
          return `${file.name} (${file.mimeType})\nID: ${file.id}\nModified: ${
            file.modifiedTime
          }\nSize: ${size}\nLink: ${file.webViewLink || "N/A"}`;
        })
        .join("\n\n---\n\n");
    } catch (error) {
      throw new Error(
        `Failed to list files: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async getFileContent(fileId: string) {
    try {
      // First get the file metadata to check its type
      const fileMetadata = await this.drive.files.get({
        fileId: fileId,
        fields: "name,mimeType",
      });

      const { name, mimeType } = fileMetadata.data;

      // Handle text files directly
      if (
        mimeType === "text/plain" ||
        mimeType === "application/json" ||
        mimeType.includes("text/") ||
        mimeType.includes("application/javascript")
      ) {
        const response = await this.drive.files.get({
          fileId: fileId,
          alt: "media",
        });

        return `File: ${name}\nContent:\n\n${response.data}`;
      }

      // For Google Docs, get the content as plain text
      else if (
        mimeType === "application/vnd.google-apps.document" ||
        mimeType === "application/vnd.google-apps.spreadsheet"
      ) {
        let exportMimeType = "text/plain";
        if (mimeType === "application/vnd.google-apps.spreadsheet") {
          exportMimeType = "text/csv";
        }

        const response = await this.drive.files.export({
          fileId: fileId,
          mimeType: exportMimeType,
        });

        return `File: ${name}\nContent (exported as ${exportMimeType}):\n\n${response.data}`;
      }

      // For other file types, just return metadata
      else {
        return `File: ${name}\nType: ${mimeType}\nThis file type cannot be displayed as text. You can access it via Google Drive directly.`;
      }
    } catch (error) {
      throw new Error(
        `Failed to get file content: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async createFile(
    name: string,
    content: string,
    mimeType: string = "text/plain",
    folderId?: string
  ) {
    try {
      const fileMetadata: any = {
        name: name,
      };

      if (folderId) {
        fileMetadata.parents = [folderId];
      }

      // If creating a Google Doc, Spreadsheet, etc.
      if (mimeType.includes("application/vnd.google-apps")) {
        const response = await this.drive.files.create({
          requestBody: fileMetadata,
          fields: "id,name,webViewLink",
          mimeType: mimeType,
        });

        const { id, webViewLink } = response.data;
        return `Created ${mimeType} with name: ${name}\nID: ${id}\nLink: ${webViewLink}`;
      }

      // For regular files with content
      const response = await this.drive.files.create({
        requestBody: fileMetadata,
        media: {
          mimeType: mimeType,
          body: content,
        },
        fields: "id,name,webViewLink",
      });

      const { id, webViewLink } = response.data;
      return `Created file with name: ${name}\nID: ${id}\nLink: ${
        webViewLink || "N/A"
      }`;
    } catch (error) {
      throw new Error(
        `Failed to create file: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async updateFile(fileId: string, content: string, mimeType?: string) {
    try {
      // First get the file metadata to verify its type
      const fileMetadata = await this.drive.files.get({
        fileId: fileId,
        fields: "name,mimeType",
      });

      const { mimeType: fileMimeType } = fileMetadata.data;

      // Check if this is a Google Doc/Sheet - these require different update approach
      if (fileMimeType.includes("application/vnd.google-apps")) {
        throw new Error(
          `Updating Google ${fileMimeType
            .split(".")
            .pop()} content is not supported via this tool. Please use the Google Drive web interface.`
        );
      }

      // Update regular file content
      const response = await this.drive.files.update({
        fileId: fileId,
        media: {
          mimeType: mimeType || fileMimeType,
          body: content,
        },
        fields: "id,name",
      });

      return `File '${response.data.name}' updated successfully.`;
    } catch (error) {
      throw new Error(
        `Failed to update file: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async deleteFile(fileId: string, permanently: boolean = false) {
    try {
      if (permanently) {
        await this.drive.files.delete({
          fileId: fileId,
        });
        return `File with ID ${fileId} permanently deleted.`;
      } else {
        await this.drive.files.update({
          fileId: fileId,
          requestBody: {
            trashed: true,
          },
        });
        return `File with ID ${fileId} moved to trash.`;
      }
    } catch (error) {
      throw new Error(
        `Failed to delete file: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async shareFile(
    fileId: string,
    emailAddress: string,
    role: string = "reader",
    sendNotification: boolean = true,
    message?: string
  ) {
    try {
      const response = await this.drive.permissions.create({
        fileId: fileId,
        requestBody: {
          type: "user",
          role: role,
          emailAddress: emailAddress,
        },
        sendNotificationEmail: sendNotification,
        emailMessage: message,
      });

      // Get the file name
      const fileMetadata = await this.drive.files.get({
        fileId: fileId,
        fields: "name",
      });

      return `File '${fileMetadata.data.name}' shared with ${emailAddress} as ${role}.`;
    } catch (error) {
      throw new Error(
        `Failed to share file: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
