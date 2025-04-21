//src/routes/api/folders/[id]/images/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getFolderById } from '$lib/server/supabase';
import { listFolderImages, generateSignedUrls } from '$lib/server/gcloud';

export const GET: RequestHandler = async ({ params }) => {
  try {
    const folderId = params.id;
    
    // Verify the folder exists
    const folder = await getFolderById(folderId);
    
    if (!folder) {
      return json({ message: 'Folder not found' }, { status: 404 });
    }
    
    // Get images in the folder
    const images = await listFolderImages(folderId);
    
    // Generate signed URLs for the images
    const imagesWithSignedUrls = await generateSignedUrls(images);
    
    return json(imagesWithSignedUrls);
  } catch (error) {
    console.error('Error listing folder images:', error);
    return json(
      { message: error instanceof Error ? error.message : 'An error occurred listing folder images' },
      { status: 500 }
    );
  }
};