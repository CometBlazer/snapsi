//src/routes/api/upload/[id]/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { verifyFolderPassword } from '$lib/server/supabase';
import { generateUploadUrl } from '$lib/server/gcloud';

export const POST: RequestHandler = async ({ request, params }) => {
  try {
    const folderId = params.id;
    const { fileName, contentType, password } = await request.json();
    
    // Validate input
    if (!fileName || !contentType || !password) {
      return json({ message: 'Missing required parameters' }, { status: 400 });
    }
    
    // Verify the folder password
    const isValid = await verifyFolderPassword(folderId, password);
    
    if (!isValid) {
      return json({ message: 'Invalid password' }, { status: 403 });
    }
    
    // Generate a signed URL for upload
    const url = await generateUploadUrl(folderId, fileName, contentType);
    
    return json({ url });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    return json(
      { message: error instanceof Error ? error.message : 'An error occurred generating the upload URL' },
      { status: 500 }
    );
  }
};