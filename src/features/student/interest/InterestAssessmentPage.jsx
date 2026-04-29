import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, SendHorizontal, ArrowRight, Lightbulb, CheckCircle } from 'lucide-react';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { toast } from '@/components/ui/Toast';
import client from '@/lib/api/client';
import { STUDENT } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/queryKeys';
import { cn } from '@/lib/utils';

/* ── Hooks ────────────────────────────────────────────── */
function useCareerRecommendations() {
  return useQuery({
    queryKey: queryKeys.student.interest.recommendations(),
    queryFn: () => client.get(STUDENT.CAREER_RECOMMENDATIONS),
    select: (r) => r.data,
    retry: false,
  });
}

/* ── Page ─────────────────────────────────────────────── */
export default function InterestAssessmentPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: existing } = useCareerRecommendations();

  const [session, setSession] = useState(null);      // { session_id, question, question_number, total_questions }
  const [messages, setMessages] = useState([]);       // chat history
  const [input, setInput] = useState('');
  const [done, setDone] = useState(false);
  const [result, setResult] = useState(null);
  const bottomRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* Start assessment */
  const startMutation = useMutation({
    mutationFn: () => client.post(STUDENT.INTEREST_START),
    onSuccess: (res) => {
      const d = res.data;
      setSession(d);
      setMessages([{ role: 'ai', text: d.question, num: 1, total: d.total_questions }]);
    },
    onError: (err) => toast.error(err.message),
  });

  /* Submit answer */
  const answerMutation = useMutation({
    mutationFn: (answer) => client.post(STUDENT.INTEREST_ANSWER, { session_id: session.session_id, answer }),
    onSuccess: (res) => {
      const d = res.data;
      // Add user message + next AI question or result
      setMessages((prev) => [...prev, { role: 'user', text: input }]);
      setInput('');

      if (d.is_complete) {
        setDone(true);
        setResult(d.recommendations?.[0] ?? null);
        setMessages((prev) => [...prev, { role: 'ai', text: t('student.assessmentComplete'), isResult: true }]);
      } else {
        setSession(d);
        setMessages((prev) => [...prev, { role: 'ai', text: d.question, num: d.question_number, total: d.total_questions }]);
      }
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSubmit = (e) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || answerMutation.isPending) return;
    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    answerMutation.mutate(trimmed);
    setInput('');
  };

  /* If already has recommendations — show result directly */
  if (existing?.length > 0 && !session) {
    return <AssessmentResult recommendations={existing} navigate={navigate} t={t} alreadyDone />;
  }

  /* Not started yet */
  if (!session) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-sq-xl bg-secondary flex items-center justify-center mx-auto mb-5 shadow-lg shadow-secondary/30">
              <Brain size={30} className="text-white" />
            </div>
            <h1 className="font-heading text-4xl font-extrabold text-primary dark:text-dark-primary tracking-tight mb-3">
              {t('student.interestAssessment')}
            </h1>
            <p className="text-on-surface-variant dark:text-dark-on-surface-variant max-w-sm mx-auto leading-relaxed">
              {t('student.interestAssessmentDesc')}. Jawab 10 pertanyaan singkat, AI kami akan analisa minatmu.
            </p>
          </div>

          {/* Info chips */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {['10 Pertanyaan', '± 5 Menit', 'AI-Powered', 'Gratis'].map((label) => (
              <Badge key={label} variant="info">{label}</Badge>
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              size="lg"
              loading={startMutation.isPending}
              onClick={() => startMutation.mutate()}
              rightIcon={<ArrowRight size={18} />}
            >
              Mulai Asesmen
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  /* Chat Interface */
  const progress = session ? (messages.filter(m => m.role === 'user').length / (session.total_questions ?? 10)) * 100 : 0;

  return (
    <div className="max-w-2xl mx-auto py-4 flex flex-col h-[calc(100vh-120px)]">
      {/* Header with progress */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-sq-md bg-secondary flex items-center justify-center">
            <Brain size={18} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-sm text-primary dark:text-dark-primary">AI Career Coach</p>
            <p className="text-xs text-on-surface-variant dark:text-dark-on-surface-variant">KerjaIn Intelligence</p>
          </div>
        </div>
        <Badge variant="info">
          {messages.filter(m => m.role === 'user').length} / {session.total_questions ?? 10}
        </Badge>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-surface-container-high dark:bg-dark-surface-container-high rounded-full mb-4 overflow-hidden">
        <motion.div
          className="h-full bg-secondary rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 pb-4 pr-1">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
            >
              {msg.role === 'ai' && (
                <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                  <Brain size={13} className="text-white" />
                </div>
              )}
              <div
                className={cn(
                  'max-w-[80%] px-5 py-3 rounded-sq-md text-sm leading-relaxed',
                  msg.role === 'ai'
                    ? 'bg-surface-container-low dark:bg-dark-surface-container-high text-primary dark:text-dark-primary rounded-tl-sm'
                    : 'bg-secondary text-white rounded-tr-sm',
                )}
              >
                {msg.isResult ? (
                  <span className="flex items-center gap-2 font-bold">
                    <CheckCircle size={16} /> {msg.text}
                  </span>
                ) : (
                  <>
                    {msg.num && (
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">
                        {t('student.question')} {msg.num} {t('student.of')} {msg.total}
                      </p>
                    )}
                    {msg.text}
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {answerMutation.isPending && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
              <Brain size={13} className="text-white" />
            </div>
            <div className="flex gap-1 px-4 py-3 bg-surface-container-low dark:bg-dark-surface-container-high rounded-sq-md">
              {[0, 0.2, 0.4].map((d, i) => (
                <motion.div key={i} className="w-2 h-2 rounded-full bg-on-surface-variant dark:bg-dark-on-surface-variant"
                  animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: d }} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Result */}
        {done && result && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-2">
            <AssessmentResult recommendations={[result]} navigate={navigate} t={t} />
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      {!done && (
        <form onSubmit={handleSubmit} className="flex gap-3 mt-2 pt-4 border-t border-outline-variant dark:border-dark-outline-variant">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit(e)}
            placeholder={t('student.answerPlaceholder')}
            disabled={answerMutation.isPending}
            className="flex-1 px-5 py-3.5 rounded-sq-md bg-surface-container-lowest dark:bg-dark-surface-container-lowest border border-outline-variant dark:border-dark-outline-variant text-sm text-primary dark:text-dark-primary placeholder:text-on-surface-variant/50 outline-none focus:border-secondary/50 input-glow transition-all disabled:opacity-50"
          />
          <Button type="submit" loading={answerMutation.isPending} size="md" className="flex-shrink-0">
            <SendHorizontal size={18} />
          </Button>
        </form>
      )}
    </div>
  );
}

/* ── Result card ──────────────────────────────────────── */
function AssessmentResult({ recommendations, navigate, t, alreadyDone }) {
  const top = recommendations[0];

  return (
    <div className="max-w-2xl mx-auto py-8">
      {alreadyDone && (
        <div className="text-center mb-8">
          <Badge variant="success" dot>Assessment Selesai</Badge>
          <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant mt-2">
            Hasil asesmen kamu sebelumnya:
          </p>
        </div>
      )}
      <Card variant="dark" className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-sq-lg bg-white/10 flex items-center justify-center">
              <Lightbulb size={24} className="text-yellow-300" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-white/60">{t('student.recommendedRole')}</p>
              <h2 className="font-heading text-2xl font-extrabold text-white tracking-tight">{top?.career_role_name}</h2>
            </div>
          </div>

          {top?.description && (
            <p className="text-white/70 text-sm leading-relaxed mb-6">{top.description}</p>
          )}

          {recommendations.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {recommendations.slice(1).map((r) => (
                <Badge key={r.career_role_id} variant="outline" className="border-white/20 text-white/70">
                  {r.career_role_name}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Button
              size="md"
              className="bg-white text-primary-container hover:bg-white/90"
              onClick={() => navigate('/student/roadmap')}
              rightIcon={<ArrowRight size={16} />}
            >
              {t('student.generateRoadmap')}
            </Button>
            <Button
              variant="secondary"
              size="md"
              className="border-white/20 text-white glass"
              onClick={() => navigate('/student/dashboard')}
            >
              Dashboard
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
