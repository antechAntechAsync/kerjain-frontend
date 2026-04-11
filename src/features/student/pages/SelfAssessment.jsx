import React, { useState } from 'react';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function SelfAssessment() {
  const [skills, setSkills] = useState([
    { id: 1, name: "JavaScript Fundamentals", level: 3 },
    { id: 2, name: "React Components", level: 2 },
    { id: 3, name: "CSS/Tailwind Design", level: 4 },
    { id: 4, name: "Node.js Basics", level: 1 },
  ]);

  const updateLevel = (id, newLevel) => {
    setSkills(skills.map(s => s.id === id ? { ...s, level: newLevel } : s));
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-4 space-y-6">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-widest">
            Expert Review
          </div>
          <h1 className="text-6xl font-heading font-extrabold text-primary leading-[1.05] tracking-tight">
            Self-Appraisal <span className="text-secondary">System</span>.
          </h1>
          <p className="text-lg text-customText/70 leading-relaxed">
            Rate your proficiency across key industry competencies. Your self-score will be compared with our AI-driven knowledge checks to verify your skills.
          </p>
          <div className="pt-6">
            <Button className="w-full h-14 group">
              Complete Assessment
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        <div className="md:col-span-8 space-y-4">
          {skills.map((skill) => (
            <div key={skill.id} className="p-8 bg-surface-container-low hover:bg-surface-container-lowest rounded-sq-md transition-all duration-300">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-heading font-bold text-primary">{skill.name}</h3>
                <div className="text-3xl font-heading font-extrabold text-secondary">0{skill.level}</div>
              </div>
              
              <div className="grid grid-cols-5 gap-3">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => updateLevel(skill.id, level)}
                    className={`h-3 rounded-full transition-all duration-300 ${
                      level <= skill.level 
                        ? 'bg-secondary' 
                        : 'bg-white hover:bg-secondary/20'
                    }`}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-3 text-[10px] font-heading font-bold uppercase tracking-widest text-customText/40">
                <span>Beginner</span>
                <span>Advanced Expert</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
