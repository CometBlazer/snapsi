//src/routes/api/folders/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createFolder } from '$lib/server/supabase';
import { ensureFolderExists } from '$lib/server/gcloud';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { name, password } = await request.json();
    
    // Validate required fields
    if (!name) {
      return json({ message: 'Name is required' }, { status: 400 });
    }
    
    // Password is optional, pass empty string if not provided
    const folderPassword = password || null;
    
    // Create folder in Supabase
    const folder = await createFolder(name, folderPassword);
    
    // Ensure folder exists in Google Cloud Storage
    await ensureFolderExists(folder.id);
    
    // Return the created folder data
    return json(folder);
  } catch (error) {
    console.error('Error creating folder:', error);
    return json(
      { message: error instanceof Error ? error.message : 'An error occurred creating the folder' },
      { status: 500 }
    );
  }
};