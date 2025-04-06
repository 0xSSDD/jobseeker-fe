-- Create storage buckets
INSERT INTO storage.buckets (id, name) VALUES 
  ('resumes', 'resumes'),
  ('cover_letters', 'cover_letters');

-- Create tables
CREATE TABLE IF NOT EXISTS public.resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  filename text NOT NULL,
  storage_path text NOT NULL,
  uploaded_at timestamptz DEFAULT now(),
  parsed_content text,
  skills text[]
);

CREATE TABLE IF NOT EXISTS public.experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id uuid REFERENCES public.resumes(id) ON DELETE CASCADE,
  title text NOT NULL,
  company text NOT NULL,
  start_date text NOT NULL,
  end_date text,
  description text
);

CREATE TABLE IF NOT EXISTS public.job_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  source_name text NOT NULL,
  enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.job_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company text NOT NULL,
  location text,
  description text NOT NULL,
  requirements text[],
  url text NOT NULL,
  source text DEFAULT 'linkedin',
  posted_date text,
  salary text,
  hiring_manager_name text,
  hiring_manager_email text,
  hiring_manager_title text,
  processed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cover_letters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  job_id text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Insert initial job sources
INSERT INTO public.job_sources (source_name, enabled) VALUES
  ('LinkedIn', true),
  ('Indeed', true),
  ('Glassdoor', false),
  ('ZipRecruiter', false),
  ('Monster', false);

-- Insert example job listings
INSERT INTO public.job_listings (title, company, location, description, requirements, url, source, posted_date)
VALUES
  (
    'Senior Software Engineer', 
    'Tech Corp', 
    'Remote', 
    'Join our team as a Senior Software Engineer working on cutting-edge technologies.',
    ARRAY['JavaScript', 'React', 'Node.js', 'AWS'], 
    'https://example.com/job/1',
    'linkedin',
    '20/03/2024'
  ),
  (
    'Full Stack Developer', 
    'Startup Inc', 
    'New York, NY', 
    'We''re looking for a talented Full Stack Developer to help build our product.',
    ARRAY['JavaScript', 'React', 'Node.js', 'MongoDB'], 
    'https://example.com/job/2',
    'indeed',
    '21/03/2024'
  ),
  (
    'Frontend Engineer', 
    'Design Co', 
    'San Francisco, CA', 
    'Looking for a Frontend Engineer to create beautiful user interfaces.',
    ARRAY['JavaScript', 'React', 'CSS', 'HTML'], 
    'https://example.com/job/3',
    'linkedin',
    '19/03/2024'
  );