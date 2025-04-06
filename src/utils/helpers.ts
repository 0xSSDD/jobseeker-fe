import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { supabase, uploadResumeFile } from '@/lib/supabase'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Upload a file to Supabase and save info to database
export async function uploadFile(file: File, userId?: string) {
  // Upload file to Supabase storage
  const { path, url } = await uploadResumeFile(file)
  
  // Extract text from the file (simplified for demo)
  // In a real implementation, you would use a PDF parsing library
  // or send the file to a serverless function for processing
  const skills = ['JavaScript', 'React', 'TypeScript', 'Next.js']
  const latestRole = 'Software Engineer'
  
  // Create a resume entry in the database
  const { data, error } = await supabase
    .from('resumes')
    .insert({
      name: file.name,
      file_path: path,
      latest_role: latestRole,
      skills: skills,
      email: null,  // In a real app, get this from the parsed resume
      phone: null   // In a real app, get this from the parsed resume
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error saving resume:', error)
    throw error
  }
  
  return data
}

// Search for jobs in the database
export async function searchJobs(title: string, location: string, sources: string[], resumeId?: string) {
  let query = supabase
    .from('jobs')
    .select('*')
  
  // Apply filters
  if (title) {
    query = query.ilike('title', `%${title}%`)
  }
  
  if (location) {
    query = query.ilike('location', `%${location}%`)
  }
  
  if (sources && sources.length > 0) {
    query = query.in('source', sources)
  }
  
  // Link jobs to the resume
  if (resumeId) {
    // Update any jobs we find to be linked to this resume
    const { data, error } = await query
  
    if (error) {
      console.error('Error searching jobs:', error)
      throw error
    }
    
    // Since this is a demo, we're simulating job searches by returning 
    // all matching jobs. In a real app, you'd fetch real jobs from APIs.
    return data || []
  } else {
    const { data, error } = await query
    
    if (error) {
      console.error('Error searching jobs:', error)
      throw error
    }
    
    return data || []
  }
}

// Generate a cover letter (in a real app, this would use AI)
export async function generateCoverLetter(jobId: string, resumeId: string) {
  // Get job and resume details
  const { data: job } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .single()
  
  const { data: resume } = await supabase
    .from('resumes')
    .select('*')
    .eq('id', resumeId)
    .single()
  
  if (!job || !resume) {
    throw new Error('Job or resume not found')
  }
  
  // In a real app, you would generate the cover letter using AI
  // For now, create a simple template
  const content = `Dear ${job.hiring_manager_name || 'Hiring Manager'},

I am writing to express my interest in the ${job.title} position at ${job.company}. With my experience as a ${resume.latest_role}, I believe I would be a great addition to your team.

The job requirements mention ${job.requirements?.slice(0, 2).join(', ') || 'skills that match my background'}, which align perfectly with my experience.

I look forward to discussing how my skills can benefit ${job.company}.

Sincerely,
${resume.name}`
  
  // Create a text file for the cover letter
  const file = new File([content], `coverletter-${job.company}.txt`, { type: 'text/plain' })
  
  // Upload the file to Supabase
  const fileExt = 'txt'
  const fileName = `${Date.now()}.${fileExt}`
  const filePath = `${fileName}`
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('coverletters')
    .upload(filePath, file)
  
  if (uploadError) {
    throw uploadError
  }
  
  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from('coverletters')
    .getPublicUrl(filePath)
  
  // Save to database
  const { data: coverLetter, error } = await supabase
    .from('cover_letters')
    .insert({
      resume_id: resumeId,
      job_id: jobId,
      content: content,
      file_path: publicUrl
    })
    .select()
    .single()
  
  if (error) {
    throw error
  }
  
  return coverLetter
}

// Format date for display
export function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

// Format salary for display
export function formatSalary(salary: string | null) {
  if (!salary) return null
  
  // Remove any non-numeric characters except for the decimal point
  const numericValue = salary.replace(/[^0-9.]/g, '')
  
  // Convert to a number and format with dollar sign
  const formattedSalary = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(parseFloat(numericValue))
  
  return formattedSalary
}