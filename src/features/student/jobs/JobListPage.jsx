import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Briefcase, Clock, Users, ChevronDown } from 'lucide-react';

import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { MatchScoreBadge } from '@/components/ui/Progress';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';
import { toast } from '@/components/ui/Toast';
import client from '@/lib/api/client';
import { STUDENT } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/queryKeys';
import { buildQueryString, employmentTypeLabels, siteTypeLabels } from '@/lib/utils';

/* ── Hooks ────────────────────────────────────────────── */
function useJobs(filters) {
  return useQuery({
    queryKey: queryKeys.student.jobs.list(filters),
    queryFn: () => client.get(`${STUDENT.JOBS}?${buildQueryString(filters)}`),
    select: (r) => r.data,
    keepPreviousData: true,
  });
}

/* ── Page ─────────────────────────────────────────────── */
export default function JobListPage() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({ page: 1, per_page: 12, q: '', employment_type: '', site_type: '' });

  const { data, isLoading, isFetching } = useJobs(filters);
  const jobs = data?.data ?? [];
  const meta = data?.meta;

  const handle = (key) => (e) => setFilters((prev) => ({ ...prev, [key]: e.target.value, page: 1 }));

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="font-heading text-4xl font-extrabold text-primary dark:text-dark-primary tracking-tight">{t('student.jobs')}</h1>
        <p className="mt-1 text-on-surface-variant dark:text-dark-on-surface-variant">Temukan pekerjaan yang matches dengan skill-mu</p>
      </motion.div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-6">
        <div className="md:col-span-6">
          <Input
            placeholder={`${t('common.search')} lowongan...`}
            leftIcon={<Search size={16} />}
            value={filters.q}
            onChange={handle('q')}
          />
        </div>
        <div className="md:col-span-3">
          <Select value={filters.employment_type} onChange={handle('employment_type')}>
            <option value="">{t('professional.employmentType')}</option>
            {Object.entries(employmentTypeLabels).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </Select>
        </div>
        <div className="md:col-span-3">
          <Select value={filters.site_type} onChange={handle('site_type')}>
            <option value="">{t('professional.siteType')}</option>
            {Object.entries(siteTypeLabels).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </Select>
        </div>
      </div>

      {/* Applied Jobs shortcut */}
      <div className="flex justify-end mb-4">
        <Link to="/student/jobs/applied">
          <Button variant="ghost" size="sm">{t('student.appliedJobs')} →</Button>
        </Link>
      </div>

      {/* Job grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array(6).fill(0).map((_, i) => <Skeleton.Card key={i} />)}
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState icon={Briefcase} title="Tidak ada lowongan" description="Coba ubah filter pencarianmu." />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isFetching ? 0.6 : 1 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-8"
        >
          {jobs.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <JobCard job={job} t={t} />
            </motion.div>
          ))}
        </motion.div>
      )}

      <Pagination meta={meta} onChange={(p) => setFilters((prev) => ({ ...prev, page: p }))} />
    </div>
  );
}

/* ── Job Card ─────────────────────────────────────────── */
function JobCard({ job, t }) {
  return (
    <Link to={`/student/jobs/${job.id}`}>
      <Card className="h-full spring hover:shadow-ambient group cursor-pointer">
        {/* Company + Match */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-sq-md bg-primary-fixed flex items-center justify-center font-black text-secondary text-base flex-shrink-0">
              {job.company_name?.[0] ?? '?'}
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant dark:text-dark-on-surface-variant">{job.company_name}</p>
            </div>
          </div>
          {job.match_score != null && (
            <MatchScoreBadge score={job.match_score} size="sm" className="flex-shrink-0" />
          )}
        </div>

        {/* Title */}
        <h3 className="font-heading text-lg font-bold text-primary dark:text-dark-primary mb-2 group-hover:text-secondary transition-colors line-clamp-2">
          {job.title}
        </h3>

        {/* Meta badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="flex items-center gap-1">
            <Briefcase size={10} />
            {employmentTypeLabels[job.employment_type] ?? job.employment_type}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <MapPin size={10} />
            {siteTypeLabels[job.site_type] ?? job.site_type}
          </Badge>
        </div>

        {/* Skills */}
        {job.required_skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {job.required_skills.slice(0, 3).map((skill) => (
              <span key={skill} className="px-2.5 py-1 rounded-full bg-primary-fixed text-secondary text-[10px] font-bold">{skill}</span>
            ))}
            {job.required_skills.length > 3 && (
              <span className="px-2.5 py-1 rounded-full bg-surface-container-high dark:bg-dark-surface-container text-on-surface-variant text-[10px] font-bold">
                +{job.required_skills.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-outline-variant dark:border-dark-outline-variant">
          <span className="text-xs text-on-surface-variant dark:text-dark-on-surface-variant flex items-center gap-1">
            <Users size={12} /> {job.total_applicants ?? 0} {t('student.totalApplicants')}
          </span>
          {job.location && (
            <span className="text-xs text-on-surface-variant dark:text-dark-on-surface-variant flex items-center gap-1">
              <MapPin size={12} /> {job.location}
            </span>
          )}
        </div>
      </Card>
    </Link>
  );
}
