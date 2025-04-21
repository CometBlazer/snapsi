//src/routes/folder/[id]/+page.server.ts
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getFolderById } from '$lib/server/supabase';
import { listFolderImages, generateSignedUrls } from '$lib/server/gcloud';

export const load: PageServerLoad = async ({ params }) => {
  const folderId = params.id;
  
  // Get folder information
  const folder = await getFolderById(folderId);
  
  if (!folder) {
    throw error(404, 'Folder not found');
  }
  
  // Get images in this folder
  const images = await listFolderImages(folderId);
  
  // Generate signed URLs for all images
  const imagesWithSignedUrls = await generateSignedUrls(images);
  
  return {
    folder: {
      id: folder.id,
      name: folder.name,
      createdAt: folder.created_at,
      hasPassword: folder.password !== null && folder.password !== ''
    },
    images: imagesWithSignedUrls
  };
};