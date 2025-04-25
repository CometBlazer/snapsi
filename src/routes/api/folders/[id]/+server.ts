import { error, json } from '@sveltejs/kit';
import { getFolderById } from '$lib/server/supabase';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
  try {
    const folder = await getFolderById(params.id);
    
    if (!folder) {
      throw error(404, 'Folder not found');
    }
    
    // Transform the folder data to match the expected format in the client
    const transformedFolder = {
      id: folder.id,
      name: folder.name,
      hasPassword: !!folder.password,
      createdAt: folder.created_at,
      lastUploadAt: folder.last_upload_at,
      imageCount: folder.image_count || 0
    };
    
    return json(transformedFolder);
  } catch (err) {
    console.error('Error getting folder by ID:', err);
    throw error(500, 'Failed to get folder');
  }
}; 