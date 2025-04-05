import JobSearchApp from "@/components/JobSearchApp";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <main className="flex-grow max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-600">Cover Letter Generator</h1>
        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
          Upload your resume, search for jobs, and get personalized cover letters instantly. No more spending hours tailoring applications.
        </p>
        <JobSearchApp />
      </main>
      <footer className="py-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Cover Letter Generator • Built with ❤️ by Indie Hackers
      </footer>
    </div>
  );
}
