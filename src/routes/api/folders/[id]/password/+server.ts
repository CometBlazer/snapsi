// src/routes/api/folders/[id]/password/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getFolderById } from '$lib/server/supabase';

export const GET: RequestHandler = async ({ params }) => {
  try {
    const folderId = params.id;
    
    if (!folderId) {
      return json({ error: 'Folder ID is required' }, { status: 400 });
    }
    
    // Get the folder from Supabase
    const folder = await getFolderById(folderId);
    
    if (!folder) {
      return json({ error: 'Folder not found' }, { status: 404 });
    }
    
    // Return the password (in a real app, you'd want to ensure proper authorization here)
    // This should only be accessible to the folder owner or authorized users
    return json({
      password: folder.password || ''
    });
  } catch (error) {
    console.error('Error retrieving folder password:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};