import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Map, Briefcase, FolderKanban, Brain, ArrowRight, TrendingUp, CheckCircle, Clock } from 'lucide-react';

import Card from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/Progress';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { useAuthStore } from '@/stores/authStore';
import client from '@/lib/api/client';
import { STUDENT } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/queryKeys';
import { formatRelativeTime, cn } from '@/lib/utils';

/* ── Data hook ────────────────────────────────────────── */
function useStudentDashboard() {
  return useQuery({
    queryKey: queryKeys.student.dashboard(),
    queryFn: () => client.get(STUDENT.DASHBOARD),
    select: (res) => res.data,
  });
}

/* ── Section fade-in ──────────────────────────────────── */
const stagger = {
  show: { transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 320, damping: 32 } },
};

/* ── Page ─────────────────────────────────────────────── */
export default function StudentDashboard() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { data, isLoading } = useStudentDashboard();

  const firstName = user?.name?.split(' ')[0] ?? 'Student';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Selamat pagi' : hour < 17 ? 'Selamat siang' : 'Selamat malam';

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-1">{greeting} 👋</p>
        <h1 className="font-heading text-4xl font-extrabold text-primary dark:text-dark-primary tracking-tight">
          {firstName}
        </h1>
        <p className="mt-1 text-on-surface-variant dark:text-dark-on-surface-variant">
          {t('student.recentActivity')} — {new Date().toLocaleDateString('id', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </motion.div>

      {isLoading ? <DashboardSkeleton /> : <DashboardContent data={data} t={t} />}
    </div>
  );
}

/* ── Content ──────────────────────────────────────────── */
function DashboardContent({ data, t }) {
  const streak = data?.streak;
  const roadmap = data?.roadmap;
  const recentJobs = data?.recent_jobs ?? [];
  const skills = data?.skill_scores ?? [];

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-12 gap-5">

      {/* Streak widget (2 cols on mobile, 4 on desktop) */}
      <motion.div variants={item} className="col-span-12 md:col-span-6 lg:col-span-4">
        <StreakWidget streak={streak} t={t} />
      </motion.div>

      {/* Roadmap progress */}
      <motion.div variants={item} className="col-span-12 md:col-span-6 lg:col-span-4">
        <RoadmapWidget roadmap={roadmap} t={t} />
      </motion.div>

      {/* Quick actions */}
      <motion.div variants={item} className="col-span-12 lg:col-span-4">
        <QuickActionsWidget t={t} />
      </motion.div>

      {/* Skill scores */}
      <motion.div variants={item} className="col-span-12 lg:col-span-7">
        <SkillScoresWidget skills={skills} t={t} />
      </motion.div>

      {/* Recent jobs */}
      <motion.div variants={item} className="col-span-12 lg:col-span-5">
        <RecentJobsWidget jobs={recentJobs} t={t} />
      </motion.div>
    </motion.div>
  );
}

/* ── Streak Widget ──────────────────────────────────── */
function StreakWidget({ streak, t }) {
  const current = streak?.current_streak ?? 0;
  const checkedIn = streak?.checked_in_today ?? false;

  return (
    <Card variant="dark" className="h-full flex flex-col justify-between min-h-[180px]">
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-4">{t('student.streak')}</p>
        <div className="flex items-end gap-3">
          <span className="text-5xl">{current > 0 ? '🔥' : '❄️'}</span>
          <div>
            <p className="font-heading text-5xl font-extrabold text-white tracking-tight leading-none">{current}</p>
            <p className="text-white/60 text-sm font-semibold mt-1">{t('student.streakDay')}</p>
          </div>
        </div>
      </div>
      <Link to="/student/streak" className="mt-6 block">
        <Button
          variant={checkedIn ? 'ghost' : 'primary'}
          size="sm"
          className={cn(
            'w-full',
            checkedIn
              ? 'bg-white/10 text-white/80 hover:bg-white/20'
              : 'bg-white text-primary-container hover:bg-white/90',
          )}
          leftIcon={checkedIn ? <CheckCircle size={14} /> : <Flame size={14} />}
        >
          {checkedIn ? t('student.checkinDone') : t('student.checkin')}
        </Button>
      </Link>
    </Card>
  );
}

/* ── Roadmap Widget ───────────────────────────────────── */
function RoadmapWidget({ roadmap, t }) {
  const completed = roadmap?.completed_nodes ?? 0;
  const total = roadmap?.total_nodes ?? 0;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const role = roadmap?.career_role_name;

  return (
    <Card className="h-full flex flex-col justify-between min-h-[180px]">
      <div>
        <Card.Subtitle>{t('student.roadmap')}</Card.Subtitle>
        {role ? (
          <>
            <p className="font-heading text-xl font-bold text-primary dark:text-dark-primary mt-2 mb-1">{role}</p>
            <p className="text-xs text-on-surface-variant dark:text-dark-on-surface-variant mb-4">
              {t('student.progressLabel', { completed, total })}
            </p>
            <ProgressBar value={completed} max={total || 1} showValue size="md" />
          </>
        ) : (
          <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant mt-2">
            {t('student.noRoadmap')}
          </p>
        )}
      </div>
      <Link to={role ? '/student/roadmap' : '/student/interest'} className="mt-5 block">
        <Button variant="secondary" size="sm" className="w-full" rightIcon={<ArrowRight size={14} />}>
          {role ? t('student.roadmap') : t('student.startAssessment')}
        </Button>
      </Link>
    </Card>
  );
}

/* ── Quick Actions Widget ─────────────────────────────── */
function QuickActionsWidget({ t }) {
  const actions = [
    { to: '/student/interest', icon: Brain, label: t('student.interestAssessment'), color: 'text-secondary' },
    { to: '/student/jobs', icon: Briefcase, label: t('student.jobs'), color: 'text-success' },
    { to: '/student/portfolio', icon: FolderKanban, label: t('student.portfolio'), color: 'text-accent' },
    { to: '/student/roadmap', icon: Map, label: t('student.roadmap'), color: 'text-warning' },
  ];

  return (
    <Card className="h-full">
      <Card.Header>
        <Card.Title>Quick Actions</Card.Title>
      </Card.Header>
      <div className="grid grid-cols-2 gap-3">
        {actions.map(({ to, icon: Icon, label, color }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-col items-center gap-2 p-4 rounded-sq-md bg-surface-container-low dark:bg-dark-surface-container hover:bg-surface-container-high dark:hover:bg-dark-surface-container-high transition-all duration-200 spring text-center"
          >
            <Icon size={22} className={color} />
            <span className="text-xs font-bold text-primary dark:text-dark-primary leading-tight">{label}</span>
          </Link>
        ))}
      </div>
    </Card>
  );
}

/* ── Skill Scores Widget ──────────────────────────────── */
function SkillScoresWidget({ skills, t }) {
  return (
    <Card className="h-full">
      <Card.Header>
        <Card.Title>Skill Scores</Card.Title>
        <Link to="/student/roadmap">
          <Button variant="tertiary" size="sm">{t('common.seeAll')}</Button>
        </Link>
      </Card.Header>
      {skills.length === 0 ? (
        <EmptyState
          icon={TrendingUp}
          title="No skill scores yet"
          description="Complete assessments on your roadmap to see your skill scores here."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {skills.slice(0, 6).map((skill) => (
            <ProgressBar
              key={skill.id}
              label={skill.name}
              value={skill.score}
              max={100}
              showValue
              size="md"
              color={skill.score >= 70 ? 'success' : skill.score >= 40 ? 'secondary' : 'warning'}
            />
          ))}
        </div>
      )}
    </Card>
  );
}

/* ── Recent Jobs Widget ───────────────────────────────── */
function RecentJobsWidget({ jobs, t }) {
  return (
    <Card className="h-full">
      <Card.Header>
        <Card.Title>{t('student.jobs')}</Card.Title>
        <Link to="/student/jobs">
          <Button variant="tertiary" size="sm">{t('common.seeAll')}</Button>
        </Link>
      </Card.Header>
      {jobs.length === 0 ? (
        <EmptyState icon={Briefcase} title="No jobs yet" description="Browse the job marketplace to find your match." />
      ) : (
        <div className="flex flex-col gap-3">
          {jobs.slice(0, 4).map((job) => (
            <Link key={job.id} to={`/student/jobs/${job.id}`}>
              <div className="flex items-center gap-3 p-3 rounded-sq-md hover:bg-surface-container-low dark:hover:bg-dark-surface-container transition-colors">
                <div className="w-10 h-10 rounded-sq-md bg-primary-fixed flex items-center justify-center text-secondary font-black text-sm flex-shrink-0">
                  {job.company_name?.[0] ?? '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-primary dark:text-dark-primary truncate">{job.title}</p>
                  <p className="text-xs text-on-surface-variant dark:text-dark-on-surface-variant truncate">{job.company_name}</p>
                </div>
                <Badge variant="info" className="flex-shrink-0">
                  {job.match_score ?? 0}%
                </Badge>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}

/* ── Skeleton ─────────────────────────────────────────── */
function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-12 gap-5">
      {[4, 4, 4, 7, 5].map((cols, i) => (
        <div key={i} className={`col-span-12 lg:col-span-${cols}`}>
          <Skeleton.Card className="min-h-[180px]" />
        </div>
      ))}
    </div>
  );
}
