import JobSearchApp from '@/components/JobSearchApp'
import { supabase } from '@/lib/supabase'
import { JobSource } from '@/types'

export default async function Home() {
  // Fetch job sources from the database
  const { data: jobSources, error } = await supabase
    .from('job_sources')
    .select('*')
  
  // If there's an error, provide default job sources
  // This ensures the app doesn't crash if the DB isn't available
  const defaultSources: JobSource[] = [
    {
      id: 1,
      name: 'LinkedIn',
      key: 'linkedin',
      enabled: true,
      logo: null
    },
    {
      id: 2,
      name: 'Indeed',
      key: 'indeed',
      enabled: true,
      logo: null
    },
    {
      id: 3,
      name: 'Glassdoor',
      key: 'glassdoor',
      enabled: true,
      logo: null
    },
    {
      id: 4,
      name: 'ZipRecruiter',
      key: 'ziprecruiter',
      enabled: true,
      logo: null
    }
  ]
  
  return (
    <JobSearchApp jobSources={jobSources || defaultSources} />
  )
}