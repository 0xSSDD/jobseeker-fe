import { FiSearch, FiBriefcase, FiCheckCircle, FiServer } from 'react-icons/fi';

export function LoadingComponent() {
  return (
    <div className="w-full max-w-lg mx-auto py-8">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Finding Your Perfect Matches</h2>
        <p className="text-gray-600">
          We're searching across multiple job platforms to find positions that match your skills and experience.
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white">
            <FiSearch className="text-lg" />
          </div>
          <div className="ml-4 flex-1">
            <div className="h-2 bg-primary rounded-full mb-2 animate-pulse"></div>
            <div className="h-2 bg-gray-200 rounded-full w-3/4"></div>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 text-primary">
            <FiBriefcase className="text-lg" />
          </div>
          <div className="ml-4 flex-1">
            <div className="h-2 bg-gray-200 rounded-full mb-2"></div>
            <div className="h-2 bg-gray-200 rounded-full w-3/4"></div>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 text-primary">
            <FiCheckCircle className="text-lg" />
          </div>
          <div className="ml-4 flex-1">
            <div className="h-2 bg-gray-200 rounded-full mb-2"></div>
            <div className="h-2 bg-gray-200 rounded-full w-3/4"></div>
          </div>
        </div>
        
        <div className="py-6">
          <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full w-2/3 animate-pulse"></div>
          </div>
          <div className="mt-2 text-sm text-gray-500 text-center">
            Searching job platforms...
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <JobSkeleton />
          <JobSkeleton />
          <JobSkeleton />
          <JobSkeleton />
        </div>
      </div>
    </div>
  );
}

function JobSkeleton() {
  return (
    <div className="border rounded-lg p-4 animate-pulse">
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="ml-3">
          <div className="h-2.5 bg-gray-200 rounded-full w-32 mb-2"></div>
          <div className="h-2 bg-gray-200 rounded-full w-24"></div>
        </div>
      </div>
      <div className="h-2.5 bg-gray-200 rounded-full w-full mb-2.5"></div>
      <div className="h-2 bg-gray-200 rounded-full mb-2.5"></div>
      <div className="h-2 bg-gray-200 rounded-full w-3/4"></div>
      <div className="flex items-center mt-4 justify-between">
        <div className="h-3 bg-gray-200 rounded-full w-1/4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  );
}