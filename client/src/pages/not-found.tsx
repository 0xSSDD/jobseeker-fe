import React from 'react';
import { Link } from 'wouter';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center dark:bg-gray-900 dark:text-white">
      <div className="text-center max-w-md p-8">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-lg mb-8 text-gray-600 dark:text-gray-400">The page you are looking for doesn't exist or has been moved.</p>
        <Link href="/">
          <a className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
            Return Home
          </a>
        </Link>
      </div>
    </div>
  );
}