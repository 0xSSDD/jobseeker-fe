import JobSearchApp from '@/components/JobSearchApp';
import { jobSearchService } from '@/services';

export default async function HomePage() {
  // Fetch job sources
  const jobSources = await jobSearchService.getJobSources();
  
  return (
    <main>
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Find Your Dream Job
          </h1>
          <p className="text-indigo-100 text-lg md:text-xl max-w-3xl mx-auto">
            Upload your resume once, search across multiple job platforms, and generate
            custom cover letters tailored to each position.
          </p>
        </div>
      </header>
      
      <section className="py-8 md:py-12">
        <JobSearchApp jobSources={jobSources} />
      </section>
      
      <footer className="border-t py-8 bg-gray-50">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Job Search Assistant. All rights reserved.</p>
          <p className="mt-2">
            Helping job seekers find opportunities across LinkedIn, Indeed, Glassdoor, ZipRecruiter and more.
          </p>
        </div>
      </footer>
    </main>
  );
}