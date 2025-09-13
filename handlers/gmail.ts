import GoogleGmail from "../utils/gmail";
import {
  isListLabelsArgs,
  isListEmailsArgs,
  isGetEmailArgs,
  isGetEmailByIndexArgs,
  isSendEmailArgs,
  isDraftEmailArgs,
  isDeleteEmailArgs,
  isModifyLabelsArgs,
  isDownloadAttachmentsArgs,
} from "../utils/helper";

export async function handleGmailListLabels(
  args: any,
  googleGmailInstance: GoogleGmail
) {
  if (!isListLabelsArgs(args)) {
    throw new Error("Invalid arguments for google_gmail_list_labels");
  }
  const labels = await googleGmailInstance.listLabels();
  const formattedResult = labels
    .map((label: any) => `${label.name} - ID: ${label.id} (${label.type})`)
    .join("\n");
  return {
    content: [{ type: "text", text: formattedResult }],
    isError: false,
  };
}

export async function handleGmailListEmails(
  args: any,
  googleGmailInstance: GoogleGmail
) {
  if (!isListEmailsArgs(args)) {
    throw new Error("Invalid arguments for google_gmail_list_emails");
  }
  const { labelIds, maxResults, query } = args;
  const result = await googleGmailInstance.listEmails(
    labelIds,
    maxResults,
    query
  );
  return {
    content: [{ type: "text", text: result }],
    isError: false,
  };
}

export async function handleGmailGetEmail(
  args: any,
  googleGmailInstance: GoogleGmail
) {
  if (!isGetEmailArgs(args)) {
    throw new Error("Invalid arguments for google_gmail_get_email");
  }
  const { messageId, format } = args;
  const result = await googleGmailInstance.getEmail(messageId, format);
  return {
    content: [{ type: "text", text: result }],
    isError: false,
  };
}

export async function handleGmailGetEmailByIndex(
  args: any,
  googleGmailInstance: GoogleGmail
) {
  if (!isGetEmailByIndexArgs(args)) {
    throw new Error("Invalid arguments for google_gmail_get_email_by_index");
  }
  const { index, format } = args;
  try {
    const messageId = googleGmailInstance.getMessageIdByIndex(index);
    const result = await googleGmailInstance.getEmail(messageId, format);
    return {
      content: [{ type: "text", text: result }],
      isError: false,
    };
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
}

export async function handleGmailSendEmail(
  args: any,
  googleGmailInstance: GoogleGmail
) {
  if (!isSendEmailArgs(args)) {
    throw new Error("Invalid arguments for google_gmail_send_email");
  }
  const { to, subject, body, cc, bcc, isHtml, attachments } = args;
  const result = await googleGmailInstance.sendEmail(
    to,
    subject,
    body,
    cc,
    bcc,
    isHtml,
    attachments
  );
  return {
    content: [{ type: "text", text: result }],
    isError: false,
  };
}

export async function handleGmailDraftEmail(
  args: any,
  googleGmailInstance: GoogleGmail
) {
  if (!isDraftEmailArgs(args)) {
    throw new Error("Invalid arguments for google_gmail_draft_email");
  }
  const { to, subject, body, cc, bcc, isHtml, attachments } = args;
  const result = await googleGmailInstance.draftEmail(
    to,
    subject,
    body,
    cc,
    bcc,
    isHtml,
    attachments
  );
  return {
    content: [{ type: "text", text: result }],
    isError: false,
  };
}

export async function handleGmailDeleteEmail(
  args: any,
  googleGmailInstance: GoogleGmail
) {
  if (!isDeleteEmailArgs(args)) {
    throw new Error("Invalid arguments for google_gmail_delete_email");
  }
  const { messageId, permanently } = args;
  const result = await googleGmailInstance.deleteEmail(messageId, permanently);
  return {
    content: [{ type: "text", text: result }],
    isError: false,
  };
}

export async function handleGmailModifyLabels(
  args: any,
  googleGmailInstance: GoogleGmail
) {
  if (!isModifyLabelsArgs(args)) {
    throw new Error("Invalid arguments for google_gmail_modify_labels");
  }
  const { messageId, addLabelIds, removeLabelIds } = args;
  const result = await googleGmailInstance.modifyLabels(
    messageId,
    addLabelIds,
    removeLabelIds
  );
  return {
    content: [{ type: "text", text: result }],
    isError: false,
  };
}

export async function handleGmailDownloadAttachments(
  args: any,
  googleGmailInstance: GoogleGmail
) {
  if (!isDownloadAttachmentsArgs(args)) {
    throw new Error("Invalid arguments for google_gmail_download_attachments");
  }
  const { messageId, downloadPath, attachmentIds } = args;
  const result = await googleGmailInstance.downloadAttachments(
    messageId,
    downloadPath,
    attachmentIds
  );
  return {
    content: [{ type: "text", text: result }],
    isError: false,
  };
}
