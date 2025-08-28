import GoogleDrive from "../utils/drive";
import {
  isListFilesArgs,
  isGetFileContentArgs,
  isCreateFileArgs,
  isUpdateFileArgs,
  isDeleteFileArgs,
  isShareFileArgs,
} from "../utils/helper";

export async function handleDriveListFiles(
  args: any,
  googleDriveInstance: GoogleDrive
) {
  if (!isListFilesArgs(args)) {
    throw new Error("Invalid arguments for google_drive_list_files");
  }
  const { query, pageSize, orderBy, fields } = args;
  const result = await googleDriveInstance.listFiles(
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

export async function handleDriveGetFileContent(
  args: any,
  googleDriveInstance: GoogleDrive
) {
  if (!isGetFileContentArgs(args)) {
    throw new Error("Invalid arguments for google_drive_get_file_content");
  }
  const { fileId } = args;
  const result = await googleDriveInstance.getFileContent(fileId);
  return {
    content: [{ type: "text", text: result }],
    isError: false,
  };
}

export async function handleDriveCreateFile(
  args: any,
  googleDriveInstance: GoogleDrive
) {
  if (!isCreateFileArgs(args)) {
    throw new Error("Invalid arguments for google_drive_create_file");
  }
  const { name, content, mimeType, folderId } = args;
  const result = await googleDriveInstance.createFile(
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

export async function handleDriveUpdateFile(
  args: any,
  googleDriveInstance: GoogleDrive
) {
  if (!isUpdateFileArgs(args)) {
    throw new Error("Invalid arguments for google_drive_update_file");
  }
  const { fileId, content, mimeType } = args;
  const result = await googleDriveInstance.updateFile(
    fileId,
    content,
    mimeType
  );
  return {
    content: [{ type: "text", text: result }],
    isError: false,
  };
}

export async function handleDriveDeleteFile(
  args: any,
  googleDriveInstance: GoogleDrive
) {
  if (!isDeleteFileArgs(args)) {
    throw new Error("Invalid arguments for google_drive_delete_file");
  }
  const { fileId, permanently } = args;
  const result = await googleDriveInstance.deleteFile(fileId, permanently);
  return {
    content: [{ type: "text", text: result }],
    isError: false,
  };
}

export async function handleDriveShareFile(
  args: any,
  googleDriveInstance: GoogleDrive
) {
  if (!isShareFileArgs(args)) {
    throw new Error("Invalid arguments for google_drive_share_file");
  }
  const { fileId, emailAddress, role, sendNotification, message } = args;
  const result = await googleDriveInstance.shareFile(
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
