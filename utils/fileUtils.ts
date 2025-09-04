import * as fs from "fs";
import * as path from "path";
import * as mime from "mime-types";

export interface FileAttachment {
  filename: string;
  mimeType: string;
  data: string; // base64 encoded
  size: number;
}

export class FileUtils {
  private static readonly MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB limit for Gmail attachments

  static async readFileAsBase64(
    filePath: string,
    customFilename?: string
  ): Promise<FileAttachment> {
    try {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      // Get file stats
      const stats = fs.statSync(filePath);

      // Check file size
      if (stats.size > this.MAX_FILE_SIZE) {
        throw new Error(
          `File size (${Math.round(
            stats.size / 1024 / 1024
          )}MB) exceeds Gmail's 25MB attachment limit: ${filePath}`
        );
      }

      // Read file content
      const fileBuffer = fs.readFileSync(filePath);
      const base64Data = fileBuffer.toString("base64");

      // Get filename
      const originalFilename = path.basename(filePath);
      const filename = customFilename || originalFilename;

      // Detect MIME type
      const mimeType = mime.lookup(filePath) || "application/octet-stream";

      return {
        filename,
        mimeType,
        data: base64Data,
        size: stats.size,
      };
    } catch (error) {
      throw new Error(
        `Failed to read file ${filePath}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  static validateFilePath(filePath: string): void {
    // Basic security check - prevent directory traversal
    const normalizedPath = path.normalize(filePath);
    if (normalizedPath.includes("..")) {
      throw new Error("Invalid file path: directory traversal not allowed");
    }
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
}
