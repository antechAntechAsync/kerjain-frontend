import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Lock, PlayCircle, Brain, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react';

import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/Progress';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { toast } from '@/components/ui/Toast';
import client from '@/lib/api/client';
import { STUDENT } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/queryKeys';
import { cn } from '@/lib/utils';

/* ── Hook ─────────────────────────────────────────────── */
function useRoadmap() {
  return useQuery({
    queryKey: queryKeys.student.roadmap(),
    queryFn: () => client.get(STUDENT.ROADMAP),
    select: (r) => r.data,
  });
}

/* ── Page ─────────────────────────────────────────────── */
export default function RoadmapPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { data, isLoading, isError } = useRoadmap();

  const generateMutation = useMutation({
    mutationFn: (roleId) => client.post(STUDENT.GENERATE_ROADMAP, { career_role_id: roleId }),
    onSuccess: () => {
      toast.success('Roadmap berhasil dibuat!');
      qc.invalidateQueries({ queryKey: queryKeys.student.roadmap() });
    },
    onError: (err) => toast.error(err.message),
  });

  if (isLoading) return <RoadmapSkeleton />;

  if (!data || !data.career_role) {
    return (
      <div className="max-w-lg mx-auto py-12">
        <EmptyState
          icon={Brain}
          title={t('student.noRoadmap')}
          description="Selesaikan asesmen minat terlebih dahulu untuk mendapatkan roadmap personalmu."
          action={
            <Link to="/student/interest">
              <Button rightIcon={<ChevronRight size={16} />}>{t('student.startAssessment')}</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const { career_role, nodes = [], completed_nodes, total_nodes } = data;
  const pct = total_nodes > 0 ? Math.round((completed_nodes / total_nodes) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Badge variant="info" className="mb-3">{t('student.careerRole')}</Badge>
        <h1 className="font-heading text-4xl font-extrabold text-primary dark:text-dark-primary tracking-tight mb-3">
          {career_role.name}
        </h1>
        <ProgressBar
          value={completed_nodes}
          max={total_nodes || 1}
          showValue
          size="lg"
          label={t('student.progressLabel', { completed: completed_nodes, total: total_nodes })}
          color="secondary"
        />
      </motion.div>

      {/* Node tree */}
      <div className="relative flex flex-col gap-4">
        {/* Vertical line */}
        <div className="absolute left-[27px] top-10 bottom-10 w-px bg-outline-variant dark:bg-dark-outline-variant pointer-events-none" />

        {nodes.map((node, i) => (
          <RoadmapNode key={node.id} node={node} index={i} t={t} />
        ))}
      </div>
    </div>
  );
}

/* ── Node Card ────────────────────────────────────────── */
function RoadmapNode({ node, index, t }) {
  const isCompleted = node.status === 'completed';
  const isAvailable = node.status === 'available';
  const isLocked = node.status === 'locked';
  const isCooldown = node.cooldown_until && new Date(node.cooldown_until) > new Date();

  const statusConfig = {
    completed: { icon: CheckCircle, iconClass: 'text-success', ring: 'ring-success/30 bg-success/10', badge: 'success' },
    available: { icon: PlayCircle, iconClass: 'text-secondary', ring: 'ring-secondary/30 bg-secondary/10', badge: 'info' },
    locked: { icon: Lock, iconClass: 'text-on-surface-variant', ring: 'ring-outline-variant bg-surface-container-high', badge: 'default' },
  };

  const config = statusConfig[node.status] ?? statusConfig.locked;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, type: 'spring', stiffness: 300, damping: 30 }}
      className="flex gap-4"
    >
      {/* Node dot */}
      <div className={cn('w-14 h-14 rounded-full ring-2 flex items-center justify-center flex-shrink-0 z-10', config.ring)}>
        <Icon size={22} className={config.iconClass} />
      </div>

      {/* Card */}
      <Card
        className={cn(
          'flex-1 transition-all duration-200',
          isLocked && 'opacity-60',
          isAvailable && 'hover:shadow-ambient spring',
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant dark:text-dark-on-surface-variant">
                Skill {index + 1}
              </p>
              <Badge variant={config.badge} className="text-[9px]">
                {isCompleted ? 'Selesai' : isAvailable ? 'Tersedia' : 'Terkunci'}
              </Badge>
            </div>
            <h3 className="font-heading font-bold text-lg text-primary dark:text-dark-primary">{node.skill_name}</h3>
            {node.description && (
              <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant mt-1 line-clamp-2">
                {node.description}
              </p>
            )}

            {/* Score chip */}
            {isCompleted && node.score != null && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs font-black text-success">{node.score}%</span>
                <ProgressBar value={node.score} max={100} size="sm" className="w-24" color={node.score >= 70 ? 'success' : 'warning'} />
              </div>
            )}

            {/* Cooldown */}
            {isCooldown && (
              <p className="text-xs text-warning mt-2 flex items-center gap-1">
                <AlertCircle size={12} />
                {t('student.cooldown')} {new Date(node.cooldown_until).toLocaleTimeString('id', { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>

          {/* Action */}
          {isAvailable && !isCooldown && (
            <Link to={`/student/assessment/${node.id}`} className="flex-shrink-0">
              <Button size="sm" leftIcon={<Brain size={14} />}>
                {t('student.startQuiz')}
              </Button>
            </Link>
          )}

          {isCompleted && (
            <Link to={`/student/assessment/${node.id}`} className="flex-shrink-0">
              <Button variant="ghost" size="sm" leftIcon={<RefreshCw size={14} />}>
                Ulangi
              </Button>
            </Link>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

/* ── Skeleton ─────────────────────────────────────────── */
function RoadmapSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <Skeleton className="h-10 w-48 rounded-sq-sm mb-2" />
      <Skeleton className="h-6 w-full rounded-sq-sm" />
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="w-14 h-14 rounded-full flex-shrink-0" />
          <Skeleton.Card className="flex-1" />
        </div>
      ))}
    </div>
  );
}
