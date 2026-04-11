import React, { useState } from 'react';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { ChevronRight, Sparkles } from 'lucide-react';

export default function InterestAssessment() {
  const [step, setStep] = useState('start');

  if (step === 'start') {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 min-h-screen flex flex-col justify-center">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 space-y-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-semibold tracking-wide uppercase">
              <Sparkles className="w-4 h-4 mr-2" />
              Discover Your Future
            </div>
            <h1 className="text-7xl font-heading font-extrabold text-primary leading-[1.1] tracking-tighter">
              Map Your <span className="text-secondary">Career</span> Path.
            </h1>
            <p className="text-xl text-customText font-body max-w-xl leading-relaxed">
              Our AI-driven assessment analyzes your natural interests and skills to match you with the perfect vocational opportunities in the digital industry.
            </p>
            <div className="flex items-center gap-6 pt-4">
              <Button size="lg" className="px-10 h-14 text-lg" onClick={() => setStep('quiz')}>
                Start Assessment
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
              <p className="text-sm text-customText/60 font-medium">Takes about 5-10 minutes</p>
            </div>
          </div>
          
          <div className="md:col-span-5 relative">
            <Card className="p-8 aspect-square flex flex-col justify-end bg-primary overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-secondary/30 transition-colors" />
              <div className="relative z-10 space-y-4">
                <div className="w-16 h-1 w-16 bg-secondary rounded-full" />
                <h3 className="text-3xl font-heading font-bold text-white leading-tight">
                  89% Accuracy for Vocational Students
                </h3>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-12 space-y-4 text-center">
        <div className="text-sm font-heading font-bold text-secondary tracking-widest uppercase">
          Step 1 of 5
        </div>
        <h2 className="text-4xl font-heading font-extrabold text-primary tracking-tight">
          What excites you the most?
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          'Building complex technical systems',
          'Designing beautiful user interfaces',
          'Managing team projects and workflows',
          'Analyzing data to find patterns'
        ].map((choice) => (
          <button 
            key={choice}
            className="group relative p-8 text-left bg-surface-container-low hover:bg-surface-container-lowest rounded-sq-md transition-all duration-300 hover:shadow-ambient active:scale-[0.98]"
          >
            <div className="text-xl font-heading font-bold text-primary mb-2 group-hover:text-secondary transition-colors">
              {choice}
            </div>
            <div className="text-sm text-customText opacity-60">
              Matches Backend & Cloud roles
            </div>
          </button>
        ))}
      </div>

      <div className="mt-12 flex justify-between items-center">
        <Button variant="ghost">Save & Exit</Button>
        <div className="flex gap-4">
          <Button variant="outline">Previous</Button>
          <Button>Next Step</Button>
        </div>
      </div>
    </div>
  );
}
