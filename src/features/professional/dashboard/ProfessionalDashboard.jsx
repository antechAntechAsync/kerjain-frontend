import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Users, TrendingUp, Plus, ArrowRight, Eye } from 'lucide-react';

import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { ProgressBar } from '@/components/ui/Progress';
import { formatCompactNumber } from '@/lib/utils';
import client from '@/lib/api/client';
import { PROFESSIONAL } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/queryKeys';
import { useAuthStore } from '@/stores/authStore';

function useDashboard() {
  return useQuery({
    queryKey: queryKeys.professional.dashboard(),
    queryFn: () => client.get(PROFESSIONAL.DASHBOARD),
    select: (r) => r.data,
  });
}

export default function ProfessionalDashboard() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { data, isLoading } = useDashboard();

  const firstName = user?.name?.split(' ')[0] ?? 'Partner';

  const stats = [
    { label: t('professional.totalApplicants'), value: data?.total_applicants ?? 0, icon: Users, color: 'text-secondary' },
    { label: t('professional.newToday'), value: data?.new_today ?? 0, icon: TrendingUp, color: 'text-success' },
    { label: 'Active Jobs', value: data?.active_jobs ?? 0, icon: Briefcase, color: 'text-accent' },
  ];

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-1">Welcome back 👋</p>
          <h1 className="font-heading text-4xl font-extrabold text-primary dark:text-dark-primary tracking-tight">{firstName}</h1>
        </div>
        <Link to="/professional/jobs/create">
          <Button leftIcon={<Plus size={16} />}>{t('professional.createJob')}</Button>
        </Link>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-12 gap-5">
          {[4, 4, 4, 8, 4].map((c, i) => <div key={i} className={`col-span-${c}`}><Skeleton.Card /></div>)}
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.07 } } }}
          className="grid grid-cols-12 gap-5"
        >
          {/* Stat cards */}
          {stats.map(({ label, value, icon: Icon, color }, i) => (
            <motion.div key={label} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="col-span-12 md:col-span-4">
              <Card className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-sq-md bg-surface-container-low dark:bg-dark-surface-container flex items-center justify-center flex-shrink-0">
                  <Icon size={22} className={color} />
                </div>
                <div>
                  <p className="font-heading text-3xl font-extrabold text-primary dark:text-dark-primary">{formatCompactNumber(value)}</p>
                  <p className="text-xs text-on-surface-variant dark:text-dark-on-surface-variant font-semibold">{label}</p>
                </div>
              </Card>
            </motion.div>
          ))}

          {/* Recent jobs */}
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="col-span-12 lg:col-span-8">
            <Card>
              <Card.Header>
                <Card.Title>{t('professional.myJobs')}</Card.Title>
                <Link to="/professional/jobs"><Button variant="tertiary" size="sm">{t('common.seeAll')}</Button></Link>
              </Card.Header>
              <div className="space-y-3">
                {(data?.recent_jobs ?? []).slice(0, 5).map((job) => (
                  <Link key={job.id} to={`/professional/jobs/${job.id}`}>
                    <div className="flex items-center gap-3 p-3 rounded-sq-md hover:bg-surface-container-low dark:hover:bg-dark-surface-container transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-primary dark:text-dark-primary truncate">{job.title}</p>
                        <p className="text-xs text-on-surface-variant dark:text-dark-on-surface-variant">{job.total_applicants ?? 0} pelamar</p>
                      </div>
                      <Badge variant={job.is_open ? 'success' : 'default'} dot={job.is_open}>
                        {job.is_open ? t('professional.openJob') : t('professional.closedJob')}
                      </Badge>
                    </div>
                  </Link>
                ))}
                {(!data?.recent_jobs?.length) && (
                  <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant text-center py-4">Belum ada lowongan. <Link to="/professional/jobs/create" className="text-secondary font-bold">Buat sekarang →</Link></p>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Recent applicants */}
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="col-span-12 lg:col-span-4">
            <Card>
              <Card.Header>
                <Card.Title>{t('professional.applicants')}</Card.Title>
                <Link to="/professional/applicants"><Button variant="tertiary" size="sm">{t('common.seeAll')}</Button></Link>
              </Card.Header>
              <div className="space-y-3">
                {(data?.recent_applicants ?? []).slice(0, 4).map((a) => (
                  <div key={a.id} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-secondary font-black text-sm flex-shrink-0">
                      {a.student_name?.[0] ?? '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-primary dark:text-dark-primary truncate">{a.student_name}</p>
                      <p className="text-xs text-on-surface-variant dark:text-dark-on-surface-variant truncate">{a.job_title}</p>
                    </div>
                    <Badge variant="info">{a.match_score ?? 0}%</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
