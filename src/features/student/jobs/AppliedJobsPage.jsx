import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Clock, ArrowRight } from 'lucide-react';

import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';
import { useState } from 'react';
import client from '@/lib/api/client';
import { STUDENT } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/queryKeys';
import { buildQueryString, employmentTypeLabels, formatRelativeTime } from '@/lib/utils';
import { useTranslation as useTrans } from 'react-i18next';

const statusConfig = {
  pending: { label: 'Menunggu', variant: 'warning' },
  reviewed: { label: 'Ditinjau', variant: 'info' },
  accepted: { label: 'Diterima', variant: 'success' },
  rejected: { label: 'Ditolak', variant: 'error' },
};

export default function AppliedJobsPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.student.jobs.applied({ page }),
    queryFn: () => client.get(`${STUDENT.APPLIED_JOBS}?${buildQueryString({ page, per_page: 10 })}`),
    select: (r) => r.data,
  });

  const jobs = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="font-heading text-3xl font-extrabold text-primary dark:text-dark-primary tracking-tight">{t('student.appliedJobs')}</h1>
      </motion.div>

      {isLoading ? (
        <div className="space-y-4">{Array(4).fill(0).map((_, i) => <Skeleton.Card key={i} />)}</div>
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="Belum ada lamaran"
          description="Cari dan lamar pekerjaan yang cocok dengan skill kamu."
          action={<Link to="/student/jobs"><Badge variant="info" className="cursor-pointer mt-2">Lihat Lowongan</Badge></Link>}
        />
      ) : (
        <div className="space-y-4">
          {jobs.map((app, i) => {
            const sc = statusConfig[app.status] ?? statusConfig.pending;
            return (
              <motion.div key={app.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Link to={`/student/jobs/${app.job?.id}`}>
                  <Card className="spring hover:shadow-ambient">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-sq-md bg-primary-fixed flex items-center justify-center font-black text-secondary text-lg flex-shrink-0">
                        {app.job?.company_name?.[0] ?? '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-on-surface-variant dark:text-dark-on-surface-variant">{app.job?.company_name}</p>
                        <p className="font-heading font-bold text-primary dark:text-dark-primary truncate">{app.job?.title}</p>
                        <p className="text-xs text-on-surface-variant dark:text-dark-on-surface-variant flex items-center gap-1 mt-0.5">
                          <Clock size={11} /> Dilamar {formatRelativeTime(app.created_at, 'id')}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={sc.variant}>{sc.label}</Badge>
                        <span className="text-[10px] text-on-surface-variant dark:text-dark-on-surface-variant">
                          {employmentTypeLabels[app.job?.employment_type] ?? ''}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
          <Pagination meta={meta} onChange={setPage} className="mt-6" />
        </div>
      )}
    </div>
  );
}
