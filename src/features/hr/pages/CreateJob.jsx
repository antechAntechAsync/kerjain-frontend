import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Select } from '../../../components/ui/Select';
import { Plus, Trash2 } from 'lucide-react';

export default function CreateJob() {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([{ id: Date.now(), name: '', level: '1' }]);

  const addSkillRow = () => {
    setSkills([...skills, { id: Date.now(), name: '', level: '1' }]);
  };

  const removeSkillRow = (id) => {
    if (skills.length > 1) {
      setSkills(skills.filter(skill => skill.id !== id));
    }
  };

  const updateSkill = (id, field, value) => {
    setSkills(skills.map(skill => skill.id === id ? { ...skill, [field]: value } : skill));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newJob = {
      id: Math.random().toString(36).substr(2, 9),
      title: e.target.title.value,
      type: e.target.type.value,
      location: e.target.location.value,
      applicants: 0,
      createdAt: new Date().toISOString(),
      status: 'Active'
    };

    const existingJobs = JSON.parse(localStorage.getItem('mock_created_jobs') || '[]');
    localStorage.setItem('mock_created_jobs', JSON.stringify([newJob, ...existingJobs]));

    console.log("Job listing created:", newJob, "with skills:", skills);
    navigate('/hr/jobs');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-heading font-bold tracking-tight text-primary">Create Job Posting</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium leading-none">Job Title</label>
              <Input id="title" placeholder="e.g. Senior Frontend Developer" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="type" className="text-sm font-medium leading-none">Employment Type</label>
                <Select id="type" required>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="location" className="text-sm font-medium leading-none">Location</label>
                <Input id="location" placeholder="e.g. Remote, Jakarta, ID" required />
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium leading-none">Job Description</label>
              <Textarea id="description" placeholder="Describe the responsibilities and requirements..." className="min-h-[150px]" required />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Required Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-500 mb-4">Add skills and select the required proficiency level (1 = Beginner, 5 = Expert).</p>
            
            {skills.map((skill) => (
              <div key={skill.id} className="flex items-center gap-3">
                <div className="flex-1">
                  <Input 
                    placeholder="Skill name (e.g. React.js)" 
                    value={skill.name}
                    onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                    required
                  />
                </div>
                <div className="w-32">
                  <Select 
                    value={skill.level}
                    onChange={(e) => updateSkill(skill.id, 'level', e.target.value)}
                  >
                    <option value="1">Level 1</option>
                    <option value="2">Level 2</option>
                    <option value="3">Level 3</option>
                    <option value="4">Level 4</option>
                    <option value="5">Level 5</option>
                  </Select>
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2"
                  onClick={() => removeSkillRow(skill.id)}
                  disabled={skills.length === 1}
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            ))}

            <Button type="button" variant="outline" onClick={addSkillRow} className="mt-2 text-sm w-full md:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Another Skill
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={() => navigate('/hr/jobs')}>Cancel</Button>
          <Button type="submit">Post Job</Button>
        </div>
      </form>
    </div>
  );
}
