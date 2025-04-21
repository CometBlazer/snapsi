// src/lib/server/supabase.ts
import { createClient } from '@supabase/supabase-js';   
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '$env/static/private';

// Create a single supabase client for interacting with your database
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Folder type definition based on your schema
export type Folder = {
  id: string;
  name: string;
  password: string | null;
  created_at: string;
  last_upload_at?: string | null;
  image_count?: number;
};

// Function to create a new folder
export async function createFolder(name: string, password: string | null = null) {
  const { data, error } = await supabase
    .from('folders')
    .insert([{ 
      name, 
      password,
      image_count: 0 
    }])
    .select();

  if (error) {
    throw new Error(`Error creating folder: ${error.message}`);
  }

  return data?.[0] as Folder;
}

// Function to get a folder by ID
export async function getFolderById(id: string) {
  const { data, error } = await supabase
    .from('folders')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return null;
  }

  return data as Folder;
}

// Function to verify folder password
export async function verifyFolderPassword(id: string, password: string | null = null) {
  const folder = await getFolderById(id);
  
  if (!folder) {
    return false;
  }
  
  // If folder has no password, always return true
  if (!folder.password) {
    return true;
  }
  
  // Otherwise, check if provided password matches
  return folder.password === password;
}

// Function to update the last upload timestamp
export async function updateFolderLastUpload(id: string) {
  try {
    // First, update the last upload timestamp
    const { error: timestampError } = await supabase
      .from('folders')
      .update({ 
        last_upload_at: new Date().toISOString()
      })
      .eq('id', id);

    if (timestampError) {
      throw new Error(`Error updating folder timestamp: ${timestampError.message}`);
    }
    
    // Then, manually increment the image count instead of using RPC
    const folder = await getFolderById(id);
    if (!folder) {
      throw new Error('Folder not found when updating image count');
    }
    
    const currentCount = folder.image_count || 0;
    const newCount = currentCount + 1;
    
    const { error: countError } = await supabase
      .from('folders')
      .update({ image_count: newCount })
      .eq('id', id);

    if (countError) {
      throw new Error(`Error incrementing image count: ${countError.message}`);
    }

    return true;
  } catch (error) {
    console.error('Error in updateFolderLastUpload:', error);
    throw error;
  }
}

// Function to decrement image count after deletion
export async function decrementFolderImageCount(id: string) {
  try {
    const folder = await getFolderById(id);
    if (!folder) {
      throw new Error('Folder not found');
    }
    
    const currentCount = folder.image_count || 0;
    const newCount = Math.max(0, currentCount - 1); // Ensure we don't go below 0
    
    const { error } = await supabase
      .from('folders')
      .update({ image_count: newCount })
      .eq('id', id);

    if (error) {
      throw new Error(`Error updating folder image count: ${error.message}`);
    }

    return true;
  } catch (error) {
    console.error('Error in decrementFolderImageCount:', error);
    throw error;
  }
}

// Function to get folder image count
export async function getFolderImageCount(id: string): Promise<number> {
  const folder = await getFolderById(id);
  
  if (!folder) {
    return 0;
  }
  
  return folder.image_count || 0;
}