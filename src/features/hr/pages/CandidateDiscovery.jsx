import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import CandidateCard from '../components/CandidateCard';

const mockCandidates = [
  {
    id: 1,
    name: 'Alice Smith',
    school: 'UI',
    major: 'Computer Science',
    matchScore: 92,
    skills: ['React', 'TypeScript', 'Node.js'],
    status: 'Pending',
  },
  {
    id: 2,
    name: 'Budi Santoso',
    school: 'ITB',
    major: 'Informatics Engineering',
    matchScore: 75,
    skills: ['React', 'JavaScript', 'CSS'],
    status: 'Pending',
  },
  {
    id: 3,
    name: 'Citra Dewi',
    school: 'UGM',
    major: 'Information Systems',
    matchScore: 55,
    skills: ['HTML', 'CSS', 'Figma'],
    status: 'Pending',
  },
  {
    id: 4,
    name: 'David Wong',
    school: 'Binus',
    major: 'Computer Science',
    matchScore: 88,
    skills: ['React', 'Next.js', 'TailwindCSS'],
    status: 'Reviewed',
  },
];

export default function CandidateDiscovery() {
  const { jobId } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b pb-4">
        <Link to="/hr/jobs">
          <Button variant="ghost" size="sm" className="px-2 hover:bg-slate-100">
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-heading font-bold tracking-tight text-primary">
            Candidate Discovery
          </h2>
          <p className="text-slate-500 mt-1">
            Reviewing applicants for Job #{jobId} (Senior Frontend Developer)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCandidates.map((candidate) => (
          <CandidateCard key={candidate.id} candidate={candidate} />
        ))}
      </div>
    </div>
  );
}
