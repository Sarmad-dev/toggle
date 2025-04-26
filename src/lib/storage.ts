"use server"
import { createClient } from '@/lib/supabase/server';

export async function uploadFile(file: File, folder: string, bucketName: string) {
  const supabase = await createClient()
  try {
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${folder}/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file);

    if (uploadError) throw uploadError;
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    const { data } = await supabase.storage.from(bucketName).createSignedUrl(filePath, 60)

    return {
      url: publicUrl,
      signedUrl: data?.signedUrl,
      fileName: file.name,
      fileType: file.type
    };
  } catch (error) {
    console.error('Upload error:', error);
  }
} 