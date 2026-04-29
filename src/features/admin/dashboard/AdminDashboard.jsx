import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Users, Briefcase, TrendingUp, UserCheck, UserX, Activity } from 'lucide-react';

import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import { ProgressBar } from '@/components/ui/Progress';
import { formatCompactNumber, formatDate } from '@/lib/utils';
import adminClient from '@/lib/api/adminClient';
import { ADMIN } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/queryKeys';

function useDashboard() {
  return useQuery({
    queryKey: queryKeys.admin.dashboard(),
    queryFn: () => adminClient.get(ADMIN.DASHBOARD),
    select: (r) => r.data,
  });
}

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { data, isLoading } = useDashboard();

  const stats = [
    { label: t('admin.totalUsers'), value: data?.total_users ?? 0, icon: Users, color: 'text-secondary', sub: `+${data?.new_this_week ?? 0} ${t('admin.newThisWeek')}` },
    { label: t('admin.totalJobs'), value: data?.total_jobs ?? 0, icon: Briefcase, color: 'text-accent', sub: `${data?.active_jobs ?? 0} aktif` },
    { label: t('admin.totalApplications'), value: data?.total_applications ?? 0, icon: TrendingUp, color: 'text-success', sub: 'Total lamaran' },
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-1">— Platform Overview</p>
        <h1 className="font-heading text-4xl font-extrabold text-slate-100 tracking-tight">{t('admin.platformStats')}</h1>
        <p className="mt-1 text-slate-400">{formatDate(new Date().toISOString(), 'id')}</p>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-12 gap-5">
          {[4, 4, 4, 8, 4].map((c, i) => <div key={i} className={`col-span-${c} col-span-12 md:col-span-${c}`}><Skeleton.Card /></div>)}
        </div>
      ) : (
        <motion.div
          initial="hidden" animate="show"
          variants={{ show: { transition: { staggerChildren: 0.07 } } }}
          className="grid grid-cols-12 gap-5"
        >
          {/* Stats */}
          {stats.map(({ label, value, icon: Icon, color, sub }, i) => (
            <motion.div key={label} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="col-span-12 md:col-span-4">
              <div className="p-6 rounded-sq-xl bg-slate-900/60 backdrop-blur-sm border border-slate-800">
                <div className="flex items-start justify-between mb-4">
                  <Icon size={22} className={color} />
                  <span className="text-xs text-slate-500 font-semibold">{sub}</span>
                </div>
                <p className="font-heading text-4xl font-extrabold text-slate-100 tracking-tight">{formatCompactNumber(value)}</p>
                <p className="text-slate-400 text-sm font-semibold mt-1">{label}</p>
              </div>
            </motion.div>
          ))}

          {/* Role breakdown */}
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="col-span-12 lg:col-span-8">
            <div className="p-6 rounded-sq-xl bg-slate-900/60 backdrop-blur-sm border border-slate-800">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-5">User Breakdown</p>
              <div className="space-y-4">
                {[
                  { label: t('admin.students'), value: data?.students ?? 0, total: data?.total_users ?? 1, color: 'secondary' },
                  { label: t('admin.professionals'), value: data?.professionals ?? 0, total: data?.total_users ?? 1, color: 'accent' },
                  { label: t('admin.admins'), value: data?.admins ?? 0, total: data?.total_users ?? 1, color: 'success' },
                ].map(({ label, value, total, color }) => (
                  <ProgressBar key={label} label={`${label} (${value})`} value={value} max={total} showValue size="md" color={color} />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Job breakdown */}
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="col-span-12 lg:col-span-4">
            <div className="p-6 rounded-sq-xl bg-slate-900/60 backdrop-blur-sm border border-slate-800 h-full">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-5">Jobs Status</p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-success" />
                    <span className="text-sm text-slate-300">{t('admin.activeJobs')}</span>
                  </div>
                  <span className="font-bold text-slate-100">{data?.active_jobs ?? 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-600" />
                    <span className="text-sm text-slate-300">{t('admin.closedJobs')}</span>
                  </div>
                  <span className="font-bold text-slate-100">{data?.closed_jobs ?? 0}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
