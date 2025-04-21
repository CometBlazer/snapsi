//src/routes/api/upload/[id]/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { verifyFolderPassword, getFolderById, updateFolderLastUpload } from '$lib/server/supabase';
import { ensureFolderExists, listFolderImages } from '$lib/server/gcloud';
import { GOOGLE_CLOUD_BUCKET_NAME } from '$env/static/private';
import { Storage } from '@google-cloud/storage';
import { GOOGLE_CLOUD_PROJECT_ID, GOOGLE_CLOUD_CLIENT_EMAIL, GOOGLE_CLOUD_PRIVATE_KEY } from '$env/static/private';
import { createRateLimiter } from '$lib/server/rateLimiter';

const storage = new Storage({
  projectId: GOOGLE_CLOUD_PROJECT_ID,
  credentials: {
    client_email: GOOGLE_CLOUD_CLIENT_EMAIL,
    private_key: GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n')
  }
});

const bucket = storage.bucket(GOOGLE_CLOUD_BUCKET_NAME);

// Create a rate limiter - 5 uploads per minute per folder
const uploadRateLimiter = createRateLimiter(5, 60 * 1000); // 5 requests per minute

// Maximum file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

// Maximum number of images per folder
const MAX_IMAGES_PER_FOLDER = 20;

// Allowed MIME types
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// Function to sanitize filename
function sanitizeFilename(filename: string): string {
  // Replace potentially dangerous characters
  let sanitized = filename.replace(/[/\\?%*:|"<>]/g, '_');
  
  // Ensure no directory traversal
  sanitized = sanitized.replace(/^\.+|\.+$/g, '');
  
  // Limit length
  if (sanitized.length > 100) {
    const extension = sanitized.split('.').pop() || '';
    sanitized = sanitized.substring(0, 95) + '.' + extension;
  }
  
  return sanitized;
}

export const POST: RequestHandler = async ({ request, params, getClientAddress }) => {
  try {
    const folderId = params.id;
    const clientIp = getClientAddress();
    
    // Apply rate limiting based on folder ID and client IP
    const rateLimitKey = `${folderId}:${clientIp}`;
    if (!uploadRateLimiter.check(rateLimitKey)) {
      return json({ 
        message: 'Rate limit exceeded. Please wait before uploading more images.' 
      }, { status: 429 });
    }
    
    // For multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const password = formData.get('password') as string;
    
    if (!file) {
      return json({ message: 'No file provided' }, { status: 400 });
    }
    
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return json({ 
        message: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB` 
      }, { status: 400 });
    }
    
    // Check file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return json({ 
        message: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.' 
      }, { status: 400 });
    }
    
    // Check if folder exists
    const folder = await getFolderById(folderId);
    if (!folder) {
      return json({ message: 'Folder not found' }, { status: 404 });
    }
    
    // If the folder has a password, verify it
    if (folder.password) {
      const isValid = await verifyFolderPassword(folderId, password);
      
      if (!isValid) {
        return json({ message: 'Invalid password' }, { status: 403 });
      }
    }
    
    // Check number of existing images
    const existingImages = await listFolderImages(folderId);
    if (existingImages.length >= MAX_IMAGES_PER_FOLDER) {
      return json({ 
        message: `Maximum number of images (${MAX_IMAGES_PER_FOLDER}) reached for this folder` 
      }, { status: 400 });
    }
    
    // Ensure folder exists in GCS
    await ensureFolderExists(folderId);
    
    // Sanitize filename
    const originalFileName = file.name;
    const sanitizedFileName = sanitizeFilename(originalFileName);
    
    // Add timestamp to filename to avoid conflicts
    const timestamp = new Date().getTime();
    const fileNameParts = sanitizedFileName.split('.');
    const extension = fileNameParts.pop() || '';
    const baseName = fileNameParts.join('.');
    const finalFileName = `${baseName}_${timestamp}.${extension}`;
    const filePath = `${folderId}/${finalFileName}`;
    
    // Upload file to Google Cloud Storage
    const fileBuffer = await file.arrayBuffer();
    const contentType = file.type;
    
    const gcsFile = bucket.file(filePath);
    await gcsFile.save(Buffer.from(fileBuffer), {
      contentType: contentType,
      metadata: {
        contentType: contentType,
        originalFileName: originalFileName
      }
    });
    
    try {
      // Update last upload timestamp and increment image count
      await updateFolderLastUpload(folderId);
    } catch (error) {
      console.error('Error updating folder metadata:', error);
      // Continue anyway since the file was uploaded successfully
    }
    
    // Generate a signed URL for this specific file for immediate use
    const [signedUrl] = await gcsFile.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });
    
    // Increment rate limiter
    uploadRateLimiter.increment(rateLimitKey);
    
    return json({ 
      success: true, 
      url: signedUrl,
      name: finalFileName,
      originalName: originalFileName,
      contentType: contentType
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return json(
      { message: error instanceof Error ? error.message : 'An error occurred uploading the file' },
      { status: 500 }
    );
  }
};