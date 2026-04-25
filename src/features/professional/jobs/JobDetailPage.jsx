import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, ToggleRight, ToggleLeft, Eye } from 'lucide-react';

import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { MatchScoreBadge } from '@/components/ui/Progress';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';
import { toast } from '@/components/ui/Toast';
import client from '@/lib/api/client';
import { PROFESSIONAL } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/queryKeys';
import { buildQueryString, employmentTypeLabels, siteTypeLabels } from '@/lib/utils';

export default function ProJobDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [filters, setFilters] = useState({ page: 1, sort: 'newest' });

  const { data: job, isLoading: loadingJob } = useQuery({
    queryKey: queryKeys.professional.jobs.detail(id),
    queryFn: () => client.get(PROFESSIONAL.JOB_DETAIL(id)),
    select: (r) => r.data,
  });

  const { data: applicants, isLoading: loadingApplicants } = useQuery({
    queryKey: queryKeys.professional.applicants.list(id, filters),
    queryFn: () => client.get(`${PROFESSIONAL.JOB_APPLICANTS(id)}?${buildQueryString(filters)}`),
    select: (r) => r.data,
  });

  const toggleMutation = useMutation({
    mutationFn: () => client.patch(PROFESSIONAL.JOB_STATUS(id)),
    onSuccess: () => { toast.success('Status diperbarui'); qc.invalidateQueries({ queryKey: queryKeys.professional.jobs.detail(id) }); },
    onError: (err) => toast.error(err.message),
  });

  if (loadingJob) return <div className="space-y-4"><Skeleton.Card /><Skeleton.Card /></div>;
  if (!job) return null;

  const apps = applicants?.data ?? [];
  const meta = applicants?.meta;

  return (
    <div>
      <Button variant="ghost" size="sm" leftIcon={<ArrowLeft size={14} />} onClick={() => navigate(-1)} className="mb-5 -ml-2">
        Kembali
      </Button>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        {/* Job header */}
        <Card className="mb-6 p-7">
          <div className="flex flex-col md:flex-row md:items-start gap-5">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant={job.is_open ? 'success' : 'default'} dot={job.is_open}>
                  {job.is_open ? t('professional.openJob') : t('professional.closedJob')}
                </Badge>
                <Badge variant="outline">{employmentTypeLabels[job.employment_type] ?? job.employment_type}</Badge>
                <Badge variant="outline">{siteTypeLabels[job.site_type] ?? job.site_type}</Badge>
              </div>
              <h1 className="font-heading text-3xl font-extrabold text-primary dark:text-dark-primary tracking-tight mb-2">{job.title}</h1>
              <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant flex items-center gap-2">
                <Users size={14} /> {job.total_applicants ?? 0} {t('professional.totalApplicants')}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" leftIcon={<ToggleRight size={14} />}
                loading={toggleMutation.isPending} onClick={() => toggleMutation.mutate()}>
                {job.is_open ? 'Tutup' : 'Buka'}
              </Button>
              <Button variant="secondary" size="sm" onClick={() => navigate(`/professional/jobs/${id}/edit`)}>
                Edit
              </Button>
            </div>
          </div>

          {/* Required skills */}
          {job.required_skills?.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {job.required_skills.map((s) => (
                <span key={s} className="px-3 py-1 rounded-full bg-primary-fixed text-secondary text-xs font-bold">{s}</span>
              ))}
            </div>
          )}
        </Card>

        {/* Applicants */}
        <Card>
          <Card.Header>
            <Card.Title>{t('professional.applicants')} ({job.total_applicants ?? 0})</Card.Title>
            <Select value={filters.sort} onChange={(e) => setFilters(p => ({ ...p, sort: e.target.value, page: 1 }))} className="w-44">
              <option value="newest">{t('professional.sortNewest')}</option>
              <option value="match_score">{t('professional.sortMatchScore')}</option>
            </Select>
          </Card.Header>

          {loadingApplicants ? (
            <div className="space-y-3">{Array(3).fill(0).map((_, i) => <Skeleton className="h-16 rounded-sq-md" key={i} />)}</div>
          ) : apps.length === 0 ? (
            <EmptyState icon={Users} title={t('professional.noApplicants')} />
          ) : (
            <div className="space-y-3">
              {apps.map((app) => (
                <div key={app.id} className="flex items-center gap-4 p-4 rounded-sq-md bg-surface-container-low dark:bg-dark-surface-container">
                  <Avatar src={app.student?.avatar} name={app.student?.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-primary dark:text-dark-primary">{app.student?.name}</p>
                    <p className="text-xs text-on-surface-variant dark:text-dark-on-surface-variant">{app.student?.student_profile?.school_name}</p>
                  </div>
                  <MatchScoreBadge score={app.match_score ?? 0} size="sm" />
                  <Button size="sm" variant="secondary" leftIcon={<Eye size={13} />}
                    onClick={() => navigate(`/professional/applicants/${app.id}/profile`)}>
                    {t('professional.applicantProfile')}
                  </Button>
                </div>
              ))}
              <Pagination meta={meta} onChange={(p) => setFilters(prev => ({ ...prev, page: p }))} className="mt-4" />
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
