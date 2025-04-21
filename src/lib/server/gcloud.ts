// src/lib/server/gcloud.ts
import { Storage } from '@google-cloud/storage';
import { GOOGLE_CLOUD_PROJECT_ID, GOOGLE_CLOUD_CLIENT_EMAIL, GOOGLE_CLOUD_PRIVATE_KEY, GOOGLE_CLOUD_BUCKET_NAME } from '$env/static/private';

// Initialize Google Cloud Storage
const storage = new Storage({
  projectId: GOOGLE_CLOUD_PROJECT_ID,
  credentials: {
    client_email: GOOGLE_CLOUD_CLIENT_EMAIL,
    private_key: GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n')
  }
});

const bucket = storage.bucket(GOOGLE_CLOUD_BUCKET_NAME);

// Function to ensure folder exists in bucket
export async function ensureFolderExists(folderId: string) {
  // In GCS, folders are actually just part of the object path and don't need to be created explicitly
  // But we'll create an empty placeholder file to simulate folder creation
  const folderFile = bucket.file(`${folderId}/.placeholder`);
  
  try {
    const [exists] = await folderFile.exists();
    if (!exists) {
      await folderFile.save('', { contentType: 'text/plain' });
    }
    return true;
  } catch (error) {
    console.error('Error ensuring folder exists:', error);
    return false;
  }
}

// Function to generate a signed URL for uploading an image
export async function generateUploadUrl(folderId: string, fileName: string, contentType: string) {
  // Ensure folder exists first
  await ensureFolderExists(folderId);
  
  const file = bucket.file(`${folderId}/${fileName}`);
  
  const [url] = await file.getSignedUrl({
    version: 'v4',
    action: 'write',
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    contentType
  });
  
  return url;
}

// Function to list all images in a folder
export async function listFolderImages(folderId: string) {
  const [files] = await bucket.getFiles({ prefix: `${folderId}/` });
  
  return files
    .filter((file) => {
      // Filter out the placeholder and any non-image files
      const fileName = file.name.split('/').pop();
      return fileName !== '.placeholder' && fileName !== '';
    })
    .map((file) => {
      const fileName = file.name.split('/').pop() || '';
      return {
        name: fileName,
        url: `https://storage.googleapis.com/${GOOGLE_CLOUD_BUCKET_NAME}/${file.name}`,
        contentType: file.metadata.contentType || '',
        size: parseInt(String(file.metadata.size || '0'), 10),
        createdAt: file.metadata.timeCreated || ''
      };
    });
}

// Function to delete an image
export async function deleteImage(folderId: string, fileName: string) {
  const file = bucket.file(`${folderId}/${fileName}`);
  await file.delete();
}