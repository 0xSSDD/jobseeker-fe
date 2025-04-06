import { createClient } from '@supabase/supabase-js'

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  }
})

// Upload a resume file to Supabase Storage
export async function uploadResumeFile(file: File) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}.${fileExt}`
  const filePath = `${fileName}`

  // Upload the file to the "resumes" bucket
  const { data, error } = await supabase.storage
    .from('resumes')
    .upload(filePath, file)

  if (error) {
    throw error
  }

  // Get the public URL for the file
  const { data: { publicUrl } } = supabase.storage
    .from('resumes')
    .getPublicUrl(filePath)

  return { path: filePath, url: publicUrl }
}