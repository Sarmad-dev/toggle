import { createClient } from '@/lib/supabase/server';

export async function uploadFile(file: File, folder: string) {
  const supabase = await createClient()
  try {
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${folder}/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('chat-files')
      .upload(filePath, file);

    if (uploadError) throw uploadError;
    
    const { data: { publicUrl } } = supabase.storage
      .from('chat-files')
      .getPublicUrl(filePath);

    return {
      url: publicUrl,
      fileName: file.name,
      fileType: file.type
    };
  } catch (error) {
    console.error('Upload error:', error);
  }
} 