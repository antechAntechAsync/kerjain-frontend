import React, { useState } from 'react';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { GraduationCap, Award, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function CandidateCard({ candidate }) {
  const [status, setStatus] = useState(candidate.status || 'Pending');
  const [alert, setAlert] = useState(null);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-secondary bg-blue-50 border-blue-200';
    return 'text-slate-500 bg-slate-50 border-slate-200';
  };

  const scoreColorClass = getScoreColor(candidate.matchScore);

  const handleAction = (action, newStatus) => {
    setStatus(newStatus);
    setAlert(`${candidate.name} has been ${action}.`);
    setTimeout(() => setAlert(null), 3000);
  };

  return (
    <Card className="flex flex-col h-full hover:border-secondary transition-colors relative">
      <CardContent className="p-6 flex flex-col h-full">
        {alert && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-sm px-4 py-2 rounded-md shadow-lg z-10 transition-opacity whitespace-nowrap">
            {alert}
          </div>
        )}
        
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-heading font-semibold text-lg text-primary">{candidate.name}</h3>
            <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
              <GraduationCap className="w-4 h-4" />
              {candidate.school}
            </div>
            <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
              <Award className="w-4 h-4" />
              {candidate.major}
            </div>
          </div>
          <div className="text-right flex-shrink-0 ml-2">
            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full border-4 font-bold text-lg ${scoreColorClass.split(' ')[0]} ${scoreColorClass.split(' ')[2]}`}>
              {candidate.matchScore}%
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium text-center">Match</div>
          </div>
        </div>

        <div className="mb-6 flex-1">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Top Skills</h4>
          <div className="flex flex-wrap gap-2">
            {candidate.skills.map(skill => (
              <span key={skill} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-4 border-t">
          <div className="text-sm text-slate-500 mb-3 flex items-center gap-2">
            Status: <span className="font-medium text-primary">{status}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 text-xs px-2"
              onClick={() => handleAction('Marked as Reviewed', 'Reviewed')}
              disabled={status === 'Reviewed' || status === 'Hired' || status === 'Rejected'}
            >
              <Clock className="w-3 h-3 mr-1" /> Review
            </Button>
            <Button 
              size="sm" 
              className="flex-1 text-xs px-2 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => handleAction('Accepted/Hired', 'Hired')}
              disabled={status === 'Hired' || status === 'Rejected'}
            >
               <CheckCircle className="w-3 h-3 mr-1" /> Hire
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="flex-1 text-xs px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => handleAction('Rejected', 'Rejected')}
              disabled={status === 'Rejected' || status === 'Hired'}
            >
               <XCircle className="w-3 h-3 mr-1" /> Reject
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
