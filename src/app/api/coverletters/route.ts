import { NextRequest, NextResponse } from 'next/server';
import coverLetterService from '@/services/coverLetterService';

export async function POST(req: NextRequest) {
  try {
    const { jobId, resumeId } = await req.json();
    
    if (!jobId || !resumeId) {
      return NextResponse.json(
        { error: 'Job ID and Resume ID are required' },
        { status: 400 }
      );
    }
    
    // Generate cover letter
    const coverLetter = await coverLetterService.generateCoverLetter(jobId, resumeId);
    
    return NextResponse.json(coverLetter);
  } catch (error) {
    console.error('Error generating cover letter:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate cover letter' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const jobId = searchParams.get('jobId');
    const resumeId = searchParams.get('resumeId');
    
    if (jobId) {
      // Get cover letters for a specific job
      const coverLetters = await coverLetterService.getCoverLettersForJob(jobId);
      return NextResponse.json(coverLetters);
    } else if (resumeId) {
      // Get cover letters for a specific resume
      const coverLetters = await coverLetterService.getCoverLettersForResume(resumeId);
      return NextResponse.json(coverLetters);
    } else {
      return NextResponse.json(
        { error: 'Either jobId or resumeId is required' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error fetching cover letters:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch cover letters' },
      { status: 500 }
    );
  }
}