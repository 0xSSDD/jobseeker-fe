import { NextRequest, NextResponse } from 'next/server';
import jobSearchService from '@/services/jobSearchService';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const title = searchParams.get('title') || '';
    const location = searchParams.get('location') || '';
    const sources = searchParams.get('sources')?.split(',') || [];
    const resumeId = searchParams.get('resumeId') || undefined;
    
    const jobs = await jobSearchService.searchJobs(title, location, sources, resumeId);
    
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error searching for jobs:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to search for jobs' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { jobId, resumeId } = await req.json();
    
    if (!jobId || !resumeId) {
      return NextResponse.json(
        { error: 'Job ID and Resume ID are required' },
        { status: 400 }
      );
    }
    
    // This route can be used to track applications or perform other job-related actions
    // For now, we'll just return success
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in job POST request:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process job request' },
      { status: 500 }
    );
  }
}