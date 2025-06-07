
import { supabase } from './supabaseClient'; 
import { decode } from 'base64-arraybuffer'; 

const BUCKET_NAME = 'alerts';

export async function uploadImageToSupabase(uri: string): Promise<string> {
  try {
    const fileName = `alert-${Date.now()}.jpg`;

    
    const res = await fetch(uri);
    if (!res.ok) {
      throw new Error(`Failed to fetch image URI: ${res.statusText}`);
    }
    const blob = await res.blob();

    
    const { data, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, blob, {
        contentType: blob.type || 'image/jpeg', 
        upsert: true, 
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      
      if (uploadError.message.includes('security policy')) {
          console.error('RLS Policy is still blocking the upload. Ensure the user is logged in and the policy is correct.');
      }
      throw new Error(`Erro ao enviar imagem para o Supabase: ${uploadError.message}`);
    }

    if (!data) {
        throw new Error('Upload para Supabase não retornou dados.');
    }

    
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    if (!publicUrlData || !publicUrlData.publicUrl) {
        console.error('Supabase getPublicUrl error: No public URL returned');
        throw new Error('Não foi possível obter a URL pública da imagem enviada.');
    }

    console.log('Imagem enviada com sucesso:', publicUrlData.publicUrl);
    return publicUrlData.publicUrl;

  } catch (error) {
    console.error('Erro detalhado no uploadImageToSupabase:', error);
    if (error instanceof Error) {
        throw new Error(`Erro no processo de upload: ${error.message}`);
    } else {
        throw new Error('Ocorreu um erro desconhecido durante o upload da imagem.');
    }
  }
}

