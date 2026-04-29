import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, CheckCircle, XCircle, ArrowRight, Timer, Award, RotateCcw, AlertCircle } from 'lucide-react';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/Progress';
import Skeleton from '@/components/ui/Skeleton';
import { toast } from '@/components/ui/Toast';
import client from '@/lib/api/client';
import { STUDENT } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/queryKeys';
import { cn } from '@/lib/utils';

/* ── Hooks ────────────────────────────────────────────── */
function useNodeInfo(nodeId) {
  return useQuery({
    queryKey: queryKeys.student.assessment.node(nodeId),
    queryFn: () => client.get(STUDENT.ASSESSMENT_NODE(nodeId)),
    select: (r) => r.data,
  });
}

/* ── Page ─────────────────────────────────────────────── */
export default function AssessmentPage() {
  const { t } = useTranslation();
  const { nodeId } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [phase, setPhase] = useState('start');   // start | quiz | result
  const [session, setSession] = useState(null);   // { session_id, question, question_type, options, total }
  const [currentQ, setCurrentQ] = useState(1);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);

  const { data: node, isLoading } = useNodeInfo(nodeId);

  /* Start quiz */
  const startMutation = useMutation({
    mutationFn: () => client.post(STUDENT.ASSESSMENT_START(nodeId)),
    onSuccess: (res) => {
      setSession(res.data);
      setPhase('quiz');
    },
    onError: (err) => toast.error(err.message),
  });

  /* Submit answer */
  const answerMutation = useMutation({
    mutationFn: (answer) => client.post(STUDENT.ASSESSMENT_ANSWER(nodeId), {
      session_id: session.session_id,
      answer,
    }),
    onSuccess: (res) => {
      const d = res.data;
      if (d.is_complete) {
        setResult(d);
        setPhase('result');
        qc.invalidateQueries({ queryKey: queryKeys.student.roadmap() });
        qc.invalidateQueries({ queryKey: queryKeys.student.dashboard() });
      } else {
        setSession(d);
        setCurrentQ((n) => n + 1);
        setSelected(null);
      }
    },
    onError: (err) => toast.error(err.message),
  });

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 py-8">
        <Skeleton className="h-10 w-48 rounded-sq-sm" />
        <Skeleton.Card />
      </div>
    );
  }

  /* Cooldown guard */
  const isCooldown = node?.cooldown_until && new Date(node.cooldown_until) > new Date();

  return (
    <div className="max-w-2xl mx-auto py-6">
      <AnimatePresence mode="wait">
        {phase === 'start' && (
          <motion.div key="start" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <StartScreen node={node} isCooldown={isCooldown} onStart={() => startMutation.mutate()} loading={startMutation.isPending} t={t} />
          </motion.div>
        )}

        {phase === 'quiz' && (
          <motion.div key="quiz" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <QuizScreen
              session={session}
              currentQ={currentQ}
              selected={selected}
              onSelect={setSelected}
              onSubmit={() => selected != null && answerMutation.mutate(selected)}
              loading={answerMutation.isPending}
              t={t}
            />
          </motion.div>
        )}

        {phase === 'result' && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <ResultScreen result={result} node={node} navigate={navigate} t={t} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Start Screen ─────────────────────────────────────── */
function StartScreen({ node, isCooldown, onStart, loading, t }) {
  return (
    <Card className="p-8 text-center">
      <div className="w-16 h-16 rounded-sq-xl bg-secondary mx-auto flex items-center justify-center mb-6 shadow-lg shadow-secondary/30">
        <Brain size={30} className="text-white" />
      </div>

      <Badge variant="info" className="mb-3 mx-auto">{t('student.selfAssessment')}</Badge>
      <h1 className="font-heading text-3xl font-extrabold text-primary dark:text-dark-primary tracking-tight mb-3">
        {node?.skill_name ?? 'Skill Assessment'}
      </h1>
      {node?.description && (
        <p className="text-on-surface-variant dark:text-dark-on-surface-variant text-sm leading-relaxed mb-6 max-w-md mx-auto">
          {node.description}
        </p>
      )}

      <div className="flex justify-center flex-wrap gap-3 mb-8">
        {['10 Soal Pilihan Ganda', 'Skor Minimal 70%', 'AI-Generated'].map((l) => (
          <Badge key={l} variant="outline">{l}</Badge>
        ))}
      </div>

      {isCooldown ? (
        <div className="flex flex-col items-center gap-3">
          <p className="text-warning flex items-center gap-2 font-semibold text-sm">
            <AlertCircle size={16} /> {t('student.cooldown')}{' '}
            {new Date(node.cooldown_until).toLocaleTimeString('id')}
          </p>
          <Button variant="ghost" size="sm" disabled>{t('errors.cooldownActive')}</Button>
        </div>
      ) : (
        <Button size="lg" loading={loading} onClick={onStart} rightIcon={<ArrowRight size={18} />}>
          {t('student.startQuiz')}
        </Button>
      )}
    </Card>
  );
}

/* ── Quiz Screen ──────────────────────────────────────── */
function QuizScreen({ session, currentQ, selected, onSelect, onSubmit, loading, t }) {
  const pct = session.total_questions ? (currentQ / session.total_questions) * 100 : 0;
  const options = session.options ?? [];
  const isEssay = session.question_type === 'essay';

  const [essayAnswer, setEssayAnswer] = useState('');

  return (
    <div>
      {/* Progress header */}
      <div className="flex items-center justify-between mb-4">
        <Badge variant="info">
          {t('student.question')} {currentQ} {t('student.of')} {session.total_questions}
        </Badge>
        <div className="flex items-center gap-2 text-xs text-on-surface-variant dark:text-dark-on-surface-variant">
          <Timer size={13} />
          Jangan refresh halaman
        </div>
      </div>

      <ProgressBar value={currentQ} max={session.total_questions ?? 10} size="sm" className="mb-6" />

      {/* Question card */}
      <Card className="mb-5 p-6">
        <p className="font-heading text-xl font-bold text-primary dark:text-dark-primary leading-snug">
          {session.question}
        </p>
      </Card>

      {/* Options */}
      {isEssay ? (
        <textarea
          value={essayAnswer}
          onChange={(e) => { setEssayAnswer(e.target.value); onSelect(e.target.value); }}
          rows={4}
          placeholder={t('student.answerPlaceholder')}
          className="w-full px-5 py-4 rounded-sq-md border border-outline-variant dark:border-dark-outline-variant bg-surface-container-lowest dark:bg-dark-surface-container-lowest text-primary dark:text-dark-primary outline-none focus:border-secondary/50 input-glow resize-none mb-5"
        />
      ) : (
        <div className="flex flex-col gap-3 mb-6">
          {options.map((opt, i) => {
            const isSelected = selected === opt;
            return (
              <motion.button
                key={i}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(opt)}
                className={cn(
                  'w-full text-left px-5 py-4 rounded-sq-md border transition-all duration-150 spring font-medium text-sm',
                  isSelected
                    ? 'border-secondary bg-primary-fixed text-secondary shadow-sm'
                    : 'border-outline-variant dark:border-dark-outline-variant text-primary dark:text-dark-primary hover:border-secondary/40 hover:bg-surface-container-low dark:hover:bg-dark-surface-container',
                )}
              >
                <span className={cn(
                  'inline-flex w-6 h-6 rounded-full items-center justify-center text-xs font-black mr-3 flex-shrink-0',
                  isSelected ? 'bg-secondary text-white' : 'bg-surface-container-high dark:bg-dark-surface-container text-on-surface-variant',
                )}>
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </motion.button>
            );
          })}
        </div>
      )}

      <Button
        className="w-full"
        loading={loading}
        disabled={selected == null}
        onClick={() => onSubmit(isEssay ? essayAnswer : selected)}
        rightIcon={<ArrowRight size={16} />}
      >
        {t('common.next')}
      </Button>
    </div>
  );
}

/* ── Result Screen ────────────────────────────────────── */
function ResultScreen({ result, node, navigate, t }) {
  const passed = result?.passed;
  const score = result?.score ?? 0;
  const passingScore = result?.passing_score ?? 70;

  return (
    <Card variant={passed ? 'dark' : 'default'} className={cn('p-8 text-center', passed && 'bg-primary-container')}>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="mb-6"
      >
        {passed
          ? <CheckCircle size={64} className="text-success mx-auto" />
          : <XCircle size={64} className="text-error mx-auto" />
        }
      </motion.div>

      <p className={cn('text-xs font-black uppercase tracking-widest mb-2', passed ? 'text-white/60' : 'text-on-surface-variant')}>
        {t('student.score')}
      </p>
      <p className={cn('font-heading text-7xl font-extrabold tracking-tight mb-1', passed ? 'text-white' : 'text-primary dark:text-dark-primary')}>
        {score}
        <span className="text-2xl opacity-60">%</span>
      </p>
      <p className={cn('text-sm mb-8', passed ? 'text-white/70' : 'text-on-surface-variant dark:text-dark-on-surface-variant')}>
        Batas lulus: {passingScore}%
      </p>

      <h2 className={cn('font-heading text-2xl font-bold mb-2', passed ? 'text-white' : 'text-primary dark:text-dark-primary')}>
        {passed ? t('student.passedAssessment') : t('student.failedAssessment')}
      </h2>

      <div className="flex flex-wrap justify-center gap-3 mt-6">
        {passed ? (
          <>
            <Button size="md" className="bg-white text-primary-container hover:bg-white/90" onClick={() => navigate('/student/roadmap')} rightIcon={<ArrowRight size={16} />}>
              {t('student.nextSkill')}
            </Button>
            <Button variant="ghost" size="md" className="text-white/70 hover:bg-white/10" onClick={() => navigate('/student/dashboard')}>
              Dashboard
            </Button>
          </>
        ) : (
          <>
            <Button size="md" onClick={() => navigate(0)} leftIcon={<RotateCcw size={14} />}>
              {t('student.tryAgain')}
            </Button>
            <Button variant="secondary" size="md" onClick={() => navigate('/student/roadmap')}>
              Kembali ke Roadmap
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}
