// src/routes/api/folders/[id]/images/[fileName]/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { verifyFolderPassword, getFolderById, decrementFolderImageCount } from '$lib/server/supabase';
import { deleteImage } from '$lib/server/gcloud';
import { createRateLimiter } from '$lib/server/rateLimiter';

// Create a rate limiter - 100 deletes per minute per folder
const deleteRateLimiter = createRateLimiter(100, 60 * 1000);

export const DELETE: RequestHandler = async ({ request, params, getClientAddress }) => {
  try {
    const { password } = await request.json();
    const folderId = params.id;
    const fileName = params.fileName;
    const clientIp = getClientAddress();
    
    // Apply rate limiting based on folder ID and client IP
    const rateLimitKey = `${folderId}:${clientIp}:delete`;
    if (!deleteRateLimiter.check(rateLimitKey)) {
      return json({ 
        message: 'Rate limit exceeded. Please wait before deleting more images.' 
      }, { status: 429 });
    }
    
    if (!fileName) {
      return json({ message: 'File name is required' }, { status: 400 });
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
    
    try {
      // Delete the file from Google Cloud Storage
      await deleteImage(folderId, fileName);
      
      // Update the folder image count
      await decrementFolderImageCount(folderId);
      
      // Increment rate limiter
      deleteRateLimiter.increment(rateLimitKey);
      
      return json({ success: true });
    } catch (error) {
      console.error(`Error in delete process: ${error}`);
      return json({ 
        message: error instanceof Error ? error.message : 'An error occurred deleting the image'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    return json(
      { message: error instanceof Error ? error.message : 'An error occurred deleting the image' },
      { status: 500 }
    );
  }
};