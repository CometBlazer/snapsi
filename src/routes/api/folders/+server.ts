//src/routes/api/folders/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createFolder } from '$lib/server/supabase';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { name, password } = await request.json();
    
    // Validate required fields
    if (!name || !password) {
      return json({ message: 'Name and password are required' }, { status: 400 });
    }
    
    // Create folder in Supabase
    const folder = await createFolder(name, password);
    
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