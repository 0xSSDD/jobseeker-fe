import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title')
    const location = searchParams.get('location')
    const sourcesParam = searchParams.get('sources')
    const resumeId = searchParams.get('resumeId')
    
    // Parse sources from comma-separated string if provided
    const sources = sourcesParam ? sourcesParam.split(',') : null
    
    // Build the query
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
    
    // Execute the query
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching jobs:', error)
      return NextResponse.json(
        { error: 'Failed to fetch jobs' },
        { status: 500 }
      )
    }
    
    // If a resumeId is provided, we should update the job records
    // to associate them with this resume, but for the demo we'll skip this
    
    return NextResponse.json(data || [])
    
  } catch (error) {
    console.error('Jobs API error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

// Handle job creation (for demo or testing purposes)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('jobs')
      .insert(body)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating job:', error)
      return NextResponse.json(
        { error: 'Failed to create job' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Job creation error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}