import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Handle file uploads
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }
    
    // Get the file extension
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `${fileName}`
    
    // Upload the file to the "resumes" bucket
    const { data, error } = await supabase.storage
      .from('resumes')
      .upload(filePath, file)
    
    if (error) {
      console.error('Supabase storage error:', error)
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      )
    }
    
    // Get the public URL for the file
    const { data: { publicUrl } } = supabase.storage
      .from('resumes')
      .getPublicUrl(filePath)
    
    // Extract text from the file (simplified for demo)
    // In a real implementation, you would use a PDF parsing library
    // or send the file to a serverless function for processing
    const skills = ['JavaScript', 'React', 'TypeScript', 'Next.js']
    const latestRole = 'Software Engineer'
    
    // Create a resume entry in the database
    const { data: resumeData, error: resumeError } = await supabase
      .from('resumes')
      .insert({
        name: file.name,
        file_path: filePath,
        latest_role: latestRole,
        skills: skills
      })
      .select()
      .single()
    
    if (resumeError) {
      console.error('Supabase database error:', resumeError)
      return NextResponse.json(
        { error: 'Failed to save resume data' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      message: 'File uploaded successfully',
      resume: resumeData
    })
    
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}