'use client';

import { useState } from 'react';
import SearchForm, { SearchParams } from '@/components/SearchForm';
import JobResults from '@/components/JobResults';

interface Job {
  title: string;
  company: string;
  location: string;
  posted_date: string;
  job_type: string;
  is_remote: boolean;
  job_url: string;
  min_amount?: number;
  max_amount?: number;
  currency?: string;
  description?: string;
}

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = async (params: SearchParams) => {
    setIsLoading(true);
    setError(null);

    try {
      // Call the FastAPI backend
      const response = await fetch('http://localhost:8000/api/v1/search_jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'f7099592-194f-40fd-9f11-5d04f759a1e4', // TODO: Move to env variable
        },
        body: JSON.stringify({
          search_term: params.search_term,
          location: params.location,
          distance: params.distance,
          country_indeed: params.country_indeed,
          results_wanted: params.results_wanted,
          job_type: params.job_type || undefined,
          is_remote: params.is_remote || undefined,
          site_name: params.site_names,
          enforce_annual_salary: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || 'Failed to fetch jobs. Please try again.'
        );
      }

      const data = await response.json();
      setJobs(data.jobs || []);
      setSearchPerformed(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">JobSpy Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Search jobs across multiple platforms
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <SearchForm onSearch={handleSearch} isLoading={isLoading} />

        <div className="mt-8">
          {searchPerformed && (
            <JobResults jobs={jobs} isLoading={isLoading} error={error || undefined} />
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>
            Make sure the JobSpy API is running on localhost:8000 before
            searching
          </p>
        </div>
      </footer>
    </main>
  );
}
