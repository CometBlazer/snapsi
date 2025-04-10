import { createClient } from '@supabase/supabase-js';   
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '$env/static/private';

// Create a single supabase client for interacting with your database
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Folder type definition based on your schema
export type Folder = {
  id: string;
  name: string;
  password: string;
  created_at: string;
};

// Function to create a new folder
export async function createFolder(name: string, password: string) {
  const { data, error } = await supabase
    .from('folders')
    .insert([{ name, password }])
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
export async function verifyFolderPassword(id: string, password: string) {
  const folder = await getFolderById(id);
  
  if (!folder) {
    return false;
  }
  
  return folder.password === password;
}