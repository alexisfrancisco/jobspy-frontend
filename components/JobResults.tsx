'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

interface JobResultsProps {
  jobs: Job[];
  isLoading: boolean;
  error?: string;
}

export default function JobResults({
  jobs,
  isLoading,
  error,
}: JobResultsProps) {
  const [sortBy, setSortBy] = useState<'recent' | 'salary'>('recent');
  const [filterSalaryOnly, setFilterSalaryOnly] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/30 bg-destructive/5 p-4 text-destructive">
        {error}
      </Card>
    );
  }

  let filteredJobs = [...jobs];

  if (filterSalaryOnly) {
    filteredJobs = filteredJobs.filter(
      (job) => job.min_amount && job.max_amount
    );
  }

  if (sortBy === 'salary') {
    filteredJobs.sort((a, b) => {
      const aMin = a.min_amount || 0;
      const bMin = b.min_amount || 0;
      return bMin - aMin;
    });
  }

  if (jobs.length === 0) {
    return (
      <div className="py-12 text-center text-lg text-muted-foreground">
        No jobs found. Try a new search!
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4">
      <Card className="border border-border/60 bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-muted-foreground">
            Found <span className="font-bold text-foreground">{jobs.length}</span>{' '}
            jobs
            {filterSalaryOnly && (
              <span className="ml-2 text-emerald-600">
                ({filteredJobs.length} with salary)
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-2">
              <Checkbox
                id="salary-only"
                checked={filterSalaryOnly}
                onCheckedChange={(checked) => setFilterSalaryOnly(Boolean(checked))}
              />
              <Label htmlFor="salary-only" className="cursor-pointer text-sm">
                Salary Only
              </Label>
            </div>

            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as 'recent' | 'salary')}
            >
              <SelectTrigger className="w-[180px] bg-background text-foreground">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Sort by Recent</SelectItem>
                <SelectItem value="salary">Sort by Salary</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={() => exportToCSV(filteredJobs)} variant="secondary">
              Export CSV
            </Button>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {filteredJobs.map((job, idx) => (
          <JobCard key={idx} job={job} />
        ))}
      </div>
    </div>
  );
}

function JobCard({ job }: { job: Job }) {
  const [expanded, setExpanded] = useState(false);

  const salary = job.min_amount
    ? `${job.min_amount.toLocaleString()}-${job.max_amount?.toLocaleString()} ${job.currency}`
    : 'Not disclosed';

  return (
    <Card className="border border-border/60 bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground">{job.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {job.company} • {job.location}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {job.is_remote && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                Remote
              </Badge>
            )}
            <Badge variant="outline">{job.job_type || 'Full-time'}</Badge>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
              {salary}
            </Badge>
          </div>

          <p className="mt-2 text-xs text-muted-foreground">
            Posted: {new Date(job.posted_date).toLocaleDateString()}
          </p>
        </div>

        <Button
          onClick={() => window.open(job.job_url, '_blank', 'noopener,noreferrer')}
        >
          View
        </Button>
      </div>

      {expanded && job.description && (
        <div className="mt-4 border-t border-border pt-4 text-sm leading-6 text-muted-foreground">
          {job.description.substring(0, 300)}...
        </div>
      )}

      {job.description && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-sm font-medium text-primary hover:underline"
        >
          {expanded ? 'Show less' : 'Show description'}
        </button>
      )}
    </Card>
  );
}

function exportToCSV(jobs: Job[]) {
  const headers = [
    'Title',
    'Company',
    'Location',
    'Job Type',
    'Remote',
    'Salary Min',
    'Salary Max',
    'Currency',
    'Posted Date',
    'URL',
  ];

  const rows = jobs.map((job) => [
    job.title,
    job.company,
    job.location,
    job.job_type,
    job.is_remote ? 'Yes' : 'No',
    job.min_amount || '',
    job.max_amount || '',
    job.currency || '',
    job.posted_date,
    job.job_url,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row
        .map((cell) =>
          typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell
        )
        .join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `jobs_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
}
