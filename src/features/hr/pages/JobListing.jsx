import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Briefcase, MapPin, Clock } from 'lucide-react';

const mockJobs = [
  { id: 1, title: 'Frontend Developer', type: 'Full-time', location: 'Remote', applicants: 12, posted: '2 days ago' },
  { id: 2, title: 'UX Designer', type: 'Contract', location: 'Jakarta, ID', applicants: 5, posted: '5 days ago' },
  { id: 3, title: 'Backend Engineer', type: 'Full-time', location: 'Remote', applicants: 28, posted: '1 week ago' },
];

export default function JobListing() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-heading font-bold tracking-tight text-primary">Job Listings</h2>
        <Link to="/hr/jobs/create">
          <Button>Create New Job</Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {mockJobs.map(job => (
          <Card key={job.id} className="hover:border-secondary transition-colors">
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-heading font-semibold text-lg text-primary">{job.title}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {job.type}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {job.posted}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{job.applicants}</div>
                    <div className="text-xs text-slate-500">Applicants</div>
                  </div>
                  <Link to={`/hr/jobs/${job.id}/candidates`}>
                    <Button variant="outline">Manage Candidates</Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
