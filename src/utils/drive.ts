import { Readable } from "stream";
import { monthFolderName, rootFolderName } from "../constants/folder-names";
import { drive_v3 } from "googleapis";
import { logger } from "firebase-functions/v2";

// utils/drive.ts
export async function setupDriveFolderStructure(drive: drive_v3.Drive): Promise<string> {
  const rootFolderId = await getOrCreateFolder(drive, rootFolderName);
  return await getOrCreateFolder(drive, monthFolderName, rootFolderId);
}

export async function uploadDocxToDrive(
  drive: drive_v3.Drive,
  buffer: Buffer,
  fileName: string,
  folderId: string
): Promise<string> {
  const stream = Readable.from(buffer);
  const response = await drive.files.create({
    requestBody: {
      name: fileName,
      mimeType: "application/vnd.google-apps.document",
      parents: [folderId],
    },
    media: {
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      body: stream,
    },
    fields: "id",
  });

  if (!response.data.id) throw new Error("Failed to upload: No document ID");
  return response.data.id;
}

export async function verifyDriveFile(drive: drive_v3.Drive, fileId: string) {
  const doc = await drive.files.get({
    fileId,
    fields: "id,name,mimeType,size",
  });
  logger.info("Document verification", {
    name: doc.data.name,
    mimeType: doc.data.mimeType,
    size: doc.data.size,
  });
}

async function getOrCreateFolder(drive: any, folderName: string, parentId?: string): Promise<string> {
  const query = [
    `name = '${folderName}'`,
    `mimeType = 'application/vnd.google-apps.folder'`,
    `'${parentId || "root"}' in parents`,
    "trashed = false",
  ].join(" and ");

  const res = await drive.files.list({
    q: query,
    fields: "files(id, name)",
    spaces: "drive",
  });

  if (res.data.files && res.data.files.length > 0) {
    return res.data.files[0].id!;
  }

  // Create the folder if not found
  const folderMetadata = {
    name: folderName,
    mimeType: "application/vnd.google-apps.folder",
    parents: parentId ? [parentId] : undefined,
  };

  const createRes = await drive.files.create({
    requestBody: folderMetadata,
    fields: "id",
  });

  return createRes.data.id!;
}
