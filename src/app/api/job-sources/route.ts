import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('job_sources')
      .select('*')
      .order('id');
    
    if (error) {
      console.error('Error fetching job sources:', error);
      return NextResponse.json({ success: false, error: 'Failed to fetch job sources' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, jobSources: data });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, enabled } = body;
    
    if (!id || enabled === undefined) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }
    
    const { data, error } = await supabase
      .from('job_sources')
      .update({ enabled })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating job source:', error);
      return NextResponse.json({ success: false, error: 'Failed to update job source' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, jobSource: data });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}