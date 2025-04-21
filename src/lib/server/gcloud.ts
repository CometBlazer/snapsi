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

// Set up CORS for the bucket (optional - we're now using server-side uploads)
async function setupBucketCors() {
  try {
    await bucket.setCorsConfiguration([
      {
        maxAgeSeconds: 3600,
        method: ["GET", "PUT", "POST", "DELETE", "HEAD"],
        origin: ["*"], // In production, you might want to restrict this to your domain
        responseHeader: [
          "Content-Type",
          "Access-Control-Allow-Origin",
          "Origin",
          "x-requested-with"
        ]
      }
    ]);
    console.log("CORS configuration updated for bucket");
    return true;
  } catch (error) {
    console.error("Error setting up CORS for bucket:", error);
    return false;
  }
}

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

// Function to list all images in a folder
export async function listFolderImages(folderId: string) {
  try {
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
          // This is a placeholder URL, will be replaced with signed URL
          url: '', 
          contentType: file.metadata.contentType || '',
          size: parseInt(String(file.metadata.size || '0'), 10),
          createdAt: file.metadata.timeCreated || '',
          path: file.name
        };
      });
  } catch (error) {
    console.error('Error listing folder images:', error);
    return [];
  }
}

// Function to generate signed URLs for each image
export async function generateSignedUrls(images) {
  const result = [];
  
  for (const image of images) {
    try {
      const file = bucket.file(image.path);
      const [url] = await file.getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      });
      
      result.push({
        ...image,
        url: url
      });
    } catch (error) {
      console.error(`Error generating signed URL for ${image.path}:`, error);
      result.push(image); // Keep the original image with empty URL
    }
  }
  
  return result;
}

// Function to delete an image
export async function deleteImage(folderId: string, fileName: string) {
  const file = bucket.file(`${folderId}/${fileName}`);
  try {
    await file.delete();
    return true;
  } catch (error) {
    console.error(`Error deleting image ${fileName}:`, error);
    throw error;
  }
}