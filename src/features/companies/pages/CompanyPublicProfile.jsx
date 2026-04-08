import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { MapPin, Briefcase, Clock, Building, Globe, Users } from 'lucide-react';
import kerjainLogo from '../../../assets/kerjain_logo_final.png';

const mockCompanyJobs = [
  { id: 1, title: 'Frontend Developer', type: 'Full-time', location: 'Remote', posted: '2 days ago' },
  { id: 2, title: 'UX Designer', type: 'Contract', location: 'Jakarta, ID', posted: '5 days ago' },
];

export default function CompanyPublicProfile() {
  return (
    <div className="min-h-screen bg-customBg font-body pb-12">
      {/* Hero Banner */}
      <div className="h-64 w-full bg-primary relative">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 md:p-8 flex flex-col md:flex-row items-center md:items-end gap-6 mb-8">
          <div className="w-32 h-32 bg-white rounded-md p-4 shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
            <img src={kerjainLogo} alt="Logo" className="w-full object-contain" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-heading font-bold text-primary">KerjaIn Tech</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3 text-sm text-slate-500 font-body">
              <span className="flex items-center gap-1.5"><Building className="w-4 h-4" /> Technology</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Jakarta, Indonesia</span>
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> 50-200 Employees</span>
              <a href="#" className="flex items-center gap-1.5 text-secondary hover:underline"><Globe className="w-4 h-4" /> kerjain.com</a>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-3">
             <Link to="/hr">
               <Button variant="ghost">Dashboard</Button>
             </Link>
             <Button>Follow Company</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-lg p-8 shadow-sm border border-slate-200">
              <h2 className="text-xl font-heading font-semibold text-primary mb-4">About Us</h2>
              <div className="space-y-4 text-slate-600 font-body leading-relaxed">
                <p>
                  KerjaIn Tech is at the forefront of revolutionizing how talent matches with opportunity. 
                  Our mission is to bridge the gap between skilled professionals and forward-thinking enterprises
                  through our modern, seamless platform.
                </p>
                <p>
                  We value innovation, transparency, and a deeply design-driven approach to complex problems.
                  Join us as we build the next generation of career development infrastructure that empowers
                  millions of students and professionals.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold text-primary mb-4">Current Openings</h2>
              <div className="grid gap-4">
                {mockCompanyJobs.map(job => (
                  <Card key={job.id} className="hover:border-secondary transition-colors">
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="font-heading font-semibold text-lg text-primary">{job.title}</h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 font-body">
                            <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {job.type}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {job.posted}</span>
                          </div>
                        </div>
                        <div className="shrink-0">
                          <Link to={`/company/job/${job.id}`}>
                            <Button variant="outline">View Details</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-sm font-heading font-semibold text-primary uppercase tracking-wider mb-4">Life at KerjaIn</h3>
              <div className="space-y-4">
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80" alt="Office" className="rounded-md w-full object-cover h-32" />
                <img src="https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&q=80" alt="Team event" className="rounded-md w-full object-cover h-32" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
