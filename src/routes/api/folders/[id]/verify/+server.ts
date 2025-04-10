import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { verifyFolderPassword } from '$lib/server/supabase';

export const POST: RequestHandler = async ({ request, params }) => {
  try {
    const folderId = params.id;
    const { password } = await request.json();
    
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