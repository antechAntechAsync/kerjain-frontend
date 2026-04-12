import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { studentApi } from '../../../services/api';
import { useNavigate } from 'react-router-dom';

export default function KnowledgeCheck() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      if (import.meta.env.VITE_ENABLE_MOCK_AUTH === 'true') {
        setQuestions([
          {
            id: 1,
            question: "Which of the following is a core principle of RESTful APIs?",
            options: ["Statelessness", "Coupling", "Synchronous execution", "Manual scaling"]
          },
          {
            id: 2,
            question: "In React, what is the primary purpose of the 'useEffect' hook?",
            options: ["Manage state", "Handle side effects", "Define styles", "Create context"]
          }
        ]);
      } else {
        const data = await studentApi.getKnowledgeCheckQuestions();
        setQuestions(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId, optionLabel) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionLabel }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const formattedAnswers = Object.entries(answers).map(([qId, ans]) => ({
        question_id: parseInt(qId),
        selected_answer: ans
      }));

      if (import.meta.env.VITE_ENABLE_MOCK_AUTH !== 'true') {
        await studentApi.submitKnowledgeCheck({ answers: formattedAnswers });
      }
      navigate('/student/portfolio');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (questions.length === 0) {
    return <div className="text-center py-20 text-customText">No questions available.</div>;
  }

  const isLastQuestion = currentQuestion === questions.length - 1;
  const currentQ = questions[currentQuestion];
  const selectedAnswer = answers[currentQ.id];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-16 space-y-6">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h1 className="text-5xl font-heading font-extrabold text-primary tracking-tight">
              Knowledge <span className="text-secondary">Check</span>.
            </h1>
            <p className="text-lg text-customText/60">Module: Web Development Fundamentals</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-heading font-bold text-primary">
              {currentQuestion + 1} <span className="text-customText/30">/</span> {questions.length}
            </div>
          </div>
        </div>
        
        {/* Editorial Progress Bar */}
        <div className="h-2 w-full bg-surface-container-low rounded-full overflow-hidden">
          <div 
            className="h-full bg-secondary transition-all duration-500 ease-out"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-12">
        <h2 className="text-3xl font-heading font-bold text-primary leading-tight">
          {currentQ.question}
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {currentQ.options.map((option, index) => {
            const label = String.fromCharCode(65 + index);
            const isSelected = selectedAnswer === label;
            return (
              <button 
                key={option}
                onClick={() => handleSelectOption(currentQ.id, label)}
                className={`group flex items-center p-6 text-left bg-surface-container-low hover:bg-surface-container-lowest border-2 transition-all duration-200 rounded-sq-md ${isSelected ? 'border-secondary bg-surface-container-lowest' : 'border-transparent hover:border-secondary/20'}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mr-6 transition-colors ${isSelected ? 'bg-secondary text-white' : 'bg-white text-primary group-hover:bg-secondary group-hover:text-white'}`}>
                  {label}
                </div>
                <div className="text-xl font-heading font-semibold text-primary">
                  {option}
                </div>
              </button>
            );
          })}
        </div>

        <div className="pt-8 flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
          >
            <ChevronLeft className="mr-2 w-5 h-5" />
            Previous
          </Button>
          
          {isLastQuestion ? (
            <Button className="px-8 h-12" onClick={handleSubmit} disabled={submitting}>
              {submitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : "Submit Assessment"}
            </Button>
          ) : (
            <Button 
              className="px-8 h-12"
              onClick={() => setCurrentQuestion(currentQuestion + 1)}
            >
              Next Question
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
