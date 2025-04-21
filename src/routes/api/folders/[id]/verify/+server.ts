//src/routes/api/folders/[id]/verify/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { verifyFolderPassword, getFolderById } from '$lib/server/supabase';

export const POST: RequestHandler = async ({ request, params }) => {
  try {
    const folderId = params.id;
    const { password } = await request.json();
    
    // First check if folder exists
    const folder = await getFolderById(folderId);
    if (!folder) {
      return json({ message: 'Folder not found' }, { status: 404 });
    }
    
    // If folder has no password, authentication is always successful
    if (!folder.password) {
      return json({ success: true });
    }
    
    // Otherwise verify the provided password
    if (!password) {
      return json({ message: 'Password is required' }, { status: 400 });
    }
    
    const isValid = await verifyFolderPassword(folderId, password);
    
    if (isValid) {
      return json({ success: true });
    } else {
      return json({ message: 'Invalid password' }, { status: 403 });
    }
  } catch (error) {
    console.error('Error verifying password:', error);
    return json(
      { message: error instanceof Error ? error.message : 'An error occurred verifying the password' },
      { status: 500 }
    );
  }
};