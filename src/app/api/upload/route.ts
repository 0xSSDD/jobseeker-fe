import { NextRequest, NextResponse } from 'next/server';
import { uploadFile } from '@/utils/helpers';
import resumeParser from '@/services/resumeParser';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    // Parse the form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Upload the file to Supabase storage
    const { filePath } = await uploadFile(file, 'resumes');
    
    // Convert file to buffer for parsing
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Parse resume using ResumeParser service
    const resumeData = await resumeParser.parseResume(buffer);
    
    // Save to database
    const { data: resumeRecord, error } = await supabase
      .from('resumes')
      .insert({
        name: resumeData.name,
        email: resumeData.email,
        phone: resumeData.phone,
        file_path: filePath,
        latest_role: resumeData.latestRole?.title || '',
        skills: resumeData.skills || []
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error saving resume to database:', error);
      return NextResponse.json(
        { error: 'Failed to save resume' },
        { status: 500 }
      );
    }
    
    // Save experiences to database if available
    if (resumeData.experiences && resumeData.experiences.length > 0) {
      const experiencesPromises = resumeData.experiences.map(exp => 
        supabase.from('experiences').insert({
          resume_id: resumeRecord.id,
          title: exp.title,
          company: exp.company,
          start_date: exp.startDate,
          end_date: exp.endDate,
          description: exp.description
        })
      );
      
      await Promise.all(experiencesPromises);
    }
    
    return NextResponse.json({
      ...resumeRecord,
      experiences: resumeData.experiences
    });
  } catch (error) {
    console.error('Error in resume upload:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process resume' },
      { status: 500 }
    );
  }
}