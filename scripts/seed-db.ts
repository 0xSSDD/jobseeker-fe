// scripts/seed-db.ts - Replace for init-db.ts
import { supabase } from '../server/supabase';
import crypto from 'crypto';

async function seedDatabase() {
  console.log('Seeding database with initial data...');

  // Seed job sources
  await seedJobSources();

  // Optional: Seed sample jobs for development
  await seedSampleJobs();

  console.log('Database seeding completed successfully');
}

async function seedJobSources() {
  console.log('Seeding job sources...');

  const sources = [
    { source_name: 'LinkedIn', enabled: true },
    { source_name: 'Indeed', enabled: true },
    { source_name: 'Glassdoor', enabled: false },
    { source_name: 'ZipRecruiter', enabled: false },
    { source_name: 'Monster', enabled: false }
  ];

  // Check if job sources already exist
  const { data: existingSources } = await supabase
    .from('job_sources')
    .select('source_name');

  const existingNames = existingSources?.map(s => s.source_name) || [];

  // Filter out sources that already exist
  const sourcesToInsert = sources.filter(s =>
    !existingNames.includes(s.source_name)
  );

  if (sourcesToInsert.length > 0) {
    const { error } = await supabase
      .from('job_sources')
      .insert(sourcesToInsert);

    if (error) {
      console.error('Error seeding job sources:', error);
    } else {
      console.log(`Added ${sourcesToInsert.length} job sources`);
    }
  } else {
    console.log('Job sources already seeded');
  }
}

async function seedSampleJobs() {
  console.log('Seeding sample jobs...');

  const now = new Date().toISOString();
  const sampleJobs = [
    {
      title: "Frontend Developer",
      company: "TechFlow",
      location: "San Francisco, CA",
      description: "We're looking for a skilled Frontend Developer to join our growing team. You'll be responsible for building beautiful, responsive user interfaces using React and modern JavaScript.",
      requirements: ["React", "TypeScript", "CSS"],
      url: "https://example.com/apply",
      source: "linkedin",
      posted_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      salary: "$110,000 - $140,000",
      hiring_manager_name: "Jane Smith",
      hiring_manager_email: "jane@techflow.com",
      hiring_manager_title: "Engineering Manager",
      processed: false
    },
    {
      title: "Senior React Developer",
      company: "InnovateCorp",
      location: "New York, NY",
      description: "InnovateCorp is seeking an experienced React Developer to help build our next-generation web applications. You should have 4+ years of experience with React and deep knowledge of state management solutions.",
      requirements: ["React", "Redux", "Node.js"],
      url: "https://example.com/apply",
      source: "indeed",
      posted_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      salary: "$130,000 - $160,000",
      hiring_manager_name: "John Doe",
      hiring_manager_email: "john@innovatecorp.com",
      hiring_manager_title: "CTO",
      processed: false
    }
  ];

  // Check for existing sample jobs to avoid duplicates
  const { data: existingJobs } = await supabase
    .from('job_listings')
    .select('title, company')
    .in('title', sampleJobs.map(job => job.title));

  if (existingJobs && existingJobs.length > 0) {
    console.log('Sample jobs already exist');
    return;
  }

  const { error } = await supabase
    .from('job_listings')
    .insert(sampleJobs);

  if (error) {
    console.error('Error seeding sample jobs:', error);
  } else {
    console.log(`Added ${sampleJobs.length} sample jobs`);
  }
}

// Execute if run directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Error during database seeding:', err);
      process.exit(1);
    });
}

export { seedDatabase };