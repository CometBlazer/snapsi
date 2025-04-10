import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getFolderById } from '$lib/server/supabase';
import { listFolderImages } from '$lib/server/gcloud';

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
    
    return json(images);
  } catch (error) {
    console.error('Error listing folder images:', error);
    return json(
      { message: error instanceof Error ? error.message : 'An error occurred listing folder images' },
      { status: 500 }
    );
  }
};