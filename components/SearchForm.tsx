'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
}

export interface SearchParams {
  search_term: string;
  location: string;
  distance: number;
  country_indeed: string;
  results_wanted: number;
  job_type: string;
  is_remote: boolean;
  site_names: string[];
}

const JOBS_SITES = [
  'indeed',
  'linkedin',
  'glassdoor',
  'zip_recruiter',
  'google',
  'bayt',
  'naukri',
];

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [formData, setFormData] = useState<SearchParams>({
    search_term: 'software engineer',
    location: 'New York',
    distance: 50,
    country_indeed: 'USA',
    results_wanted: 20,
    job_type: 'fulltime',
    is_remote: false,
    site_names: ['indeed', 'linkedin'],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : type === 'number'
            ? parseInt(value)
            : value,
    }));
  };

  const handleSiteToggle = (site: string) => {
    setFormData((prev) => ({
      ...prev,
      site_names: prev.site_names.includes(site)
        ? prev.site_names.filter((s) => s !== site)
        : [...prev.site_names, site],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(formData);
  };

  return (
    <Card className="mx-auto w-full max-w-5xl border border-border/60 bg-card p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Job Search
          </h2>
          <p className="text-sm text-muted-foreground">
            Search across multiple job boards in one place.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="search_term">Search Term</Label>
            <Input
              id="search_term"
              name="search_term"
              value={formData.search_term}
              onChange={handleChange}
              placeholder="e.g., Python Developer"
              className="bg-background text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., New York"
              className="bg-background text-foreground"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="distance">Distance (miles)</Label>
            <Input
              id="distance"
              name="distance"
              type="number"
              value={formData.distance}
              onChange={handleChange}
              min="0"
              className="bg-background text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country_indeed">Country (Indeed)</Label>
            <Input
              id="country_indeed"
              name="country_indeed"
              value={formData.country_indeed}
              onChange={handleChange}
              placeholder="USA"
              className="bg-background text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="results_wanted">Results Wanted</Label>
            <Input
              id="results_wanted"
              name="results_wanted"
              type="number"
              value={formData.results_wanted}
              onChange={handleChange}
              min="1"
              max="100"
              className="bg-background text-foreground"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="job_type">Job Type</Label>
            <Select
              value={formData.job_type || undefined}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, job_type: value ?? '' }))
              }
            >
              <SelectTrigger id="job_type" className="w-full bg-background text-foreground">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any</SelectItem>
                <SelectItem value="fulltime">Full Time</SelectItem>
                <SelectItem value="parttime">Part Time</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <div className="flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-2.5">
              <Checkbox
                id="is_remote"
                name="is_remote"
                checked={formData.is_remote}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, is_remote: !!checked }))
                }
              />
              <Label htmlFor="is_remote" className="cursor-pointer text-sm font-medium">
                Remote Only
              </Label>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">Job Sites</Label>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {JOBS_SITES.map((site) => (
              <div
                key={site}
                className="flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-2"
              >
                <Checkbox
                  id={site}
                  checked={formData.site_names.includes(site)}
                  onCheckedChange={() => handleSiteToggle(site)}
                />
                <Label htmlFor={site} className="cursor-pointer text-sm capitalize">
                  {site.replace('_', ' ')}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search Jobs'}
        </Button>
      </form>
    </Card>
  );
}
