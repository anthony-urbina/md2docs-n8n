import { google } from "googleapis";
import { logger } from "firebase-functions/v2";
import type { GoogleDocResponse } from "../types";
import { convertMarkdownToDocx } from "./docx-converter";
import { setupDriveFolderStructure, uploadDocxToDrive, verifyDriveFile } from "../utils/drive";
import { stripMarkdownCodeBlock } from "../utils/markdown";
import { initializeAuth } from "../utils/auth";

export async function convertMarkdownToGoogleDoc(
  markdownContent: string,
  accessToken: string,
  fileName: string = "Converted from Markdown"
): Promise<GoogleDocResponse> {
  try {
    logger.info("Starting markdown to Google Doc conversion", {
      markdownLength: markdownContent.length,
      fileName,
      sampleMarkdown: markdownContent.substring(0, 100),
    });

    const cleanedMarkdown = stripMarkdownCodeBlock(markdownContent);
    const auth = initializeAuth(accessToken);
    const drive = google.drive({ version: "v3", auth });

    const docxBuffer = await convertMarkdownToDocx(cleanedMarkdown);
    if (!docxBuffer || docxBuffer.length === 0) {
      throw new Error("DOCX conversion failed - empty buffer");
    }

    const monthFolderId = await setupDriveFolderStructure(drive);
    const documentId = await uploadDocxToDrive(drive, docxBuffer, fileName, monthFolderId);

    logger.info("Document created", {
      documentId,
      documentUrl: `https://docs.google.com/document/d/${documentId}`,
      fileName,
    });

    try {
      await verifyDriveFile(drive, documentId);
    } catch (e) {
      logger.warn("Verification failed, skipping", { error: (e as Error).message });
    }

    return {
      documentId,
      url: `https://docs.google.com/document/d/${documentId}`,
      status: 200,
      fileName,
    };
  } catch (error: any) {
    logger.error("Error in document creation", {
      message: error.message,
      status: error.status || error.code || 500,
      details: error.errors || error.stack,
    });
    throw error;
  }
}
