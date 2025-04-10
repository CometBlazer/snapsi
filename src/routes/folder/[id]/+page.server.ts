import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getFolderById } from '$lib/server/supabase';
import { listFolderImages } from '$lib/server/gcloud';

export const load: PageServerLoad = async ({ params }) => {
  const folderId = params.id;
  
  // Get folder information
  const folder = await getFolderById(folderId);
  
  if (!folder) {
    throw error(404, 'Folder not found');
  }
  
  // Get images in this folder
  const images = await listFolderImages(folderId);
  
  return {
    folder: {
      id: folder.id,
      name: folder.name,
      createdAt: folder.created_at
    },
    images
  };
};