import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import * as mime from "mime-types";

export interface FileAttachment {
  filename: string;
  mimeType: string;
  data: string; // base64 encoded
  size: number;
}

export interface EmailAttachment {
  attachmentId: string;
  filename: string;
  mimeType: string;
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

  static getDefaultDownloadPath(): string {
    const platform = os.platform();
    const homeDir = os.homedir();

    switch (platform) {
      case "win32":
        // Windows: C:\Users\username\Downloads
        return path.join(homeDir, "Downloads");
      case "darwin":
        // macOS: /Users/username/Downloads
        return path.join(homeDir, "Downloads");
      case "linux":
        // Linux: /home/username/Downloads (or XDG_DOWNLOAD_DIR if set)
        const xdgDownload = process.env.XDG_DOWNLOAD_DIR;
        return xdgDownload || path.join(homeDir, "Downloads");
      default:
        // Fallback for other platforms
        return path.join(homeDir, "Downloads");
    }
  }

  static ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  static async saveBase64File(
    base64Data: string,
    filename: string,
    downloadPath: string
  ): Promise<string> {
    try {
      // Ensure the directory exists
      this.ensureDirectoryExists(downloadPath);

      // Create the full file path
      const filePath = path.join(downloadPath, filename);

      // Handle file name conflicts
      let finalFilePath = filePath;
      let counter = 1;
      while (fs.existsSync(finalFilePath)) {
        const extension = path.extname(filename);
        const baseName = path.basename(filename, extension);
        finalFilePath = path.join(
          downloadPath,
          `${baseName}_${counter}${extension}`
        );
        counter++;
      }

      // Convert base64 to buffer and save
      const buffer = Buffer.from(base64Data, "base64");
      fs.writeFileSync(finalFilePath, buffer);

      return finalFilePath;
    } catch (error) {
      throw new Error(
        `Failed to save file: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  static sanitizeFilename(filename: string): string {
    // Remove or replace invalid characters for file names
    return filename.replace(/[<>:"/\\|?*\x00-\x1f]/g, "_");
  }
}
