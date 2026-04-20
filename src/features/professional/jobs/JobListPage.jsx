import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Users, ToggleLeft, ToggleRight, Edit, Trash2, Eye } from 'lucide-react';

import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';
import { toast } from '@/components/ui/Toast';
import client from '@/lib/api/client';
import { PROFESSIONAL } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/queryKeys';
import { buildQueryString, employmentTypeLabels, siteTypeLabels, formatRelativeTime } from '@/lib/utils';

export default function ProJobListPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [filters, setFilters] = useState({ page: 1, q: '', status: '' });

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.professional.jobs.list(filters),
    queryFn: () => client.get(`${PROFESSIONAL.JOBS}?${buildQueryString(filters)}`),
    select: (r) => r.data,
    keepPreviousData: true,
  });

  const toggleMutation = useMutation({
    mutationFn: (id) => client.patch(PROFESSIONAL.JOB_STATUS(id)),
    onSuccess: () => {
      toast.success('Status lowongan diperbarui');
      qc.invalidateQueries({ queryKey: queryKeys.professional.jobs.all() });
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => client.delete(PROFESSIONAL.JOB_DETAIL(id)),
    onSuccess: () => {
      toast.success('Lowongan dihapus');
      qc.invalidateQueries({ queryKey: queryKeys.professional.jobs.all() });
    },
    onError: (err) => toast.error(err.message),
  });

  const jobs = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-4xl font-extrabold text-primary dark:text-dark-primary tracking-tight">{t('professional.myJobs')}</h1>
        <Link to="/professional/jobs/create">
          <Button leftIcon={<Plus size={16} />}>{t('professional.createJob')}</Button>
        </Link>
      </motion.div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-6">
        <div className="md:col-span-8">
          <Input placeholder="Cari lowongan..." value={filters.q} onChange={(e) => setFilters(p => ({ ...p, q: e.target.value, page: 1 }))} />
        </div>
        <div className="md:col-span-4">
          <Select value={filters.status} onChange={(e) => setFilters(p => ({ ...p, status: e.target.value, page: 1 }))}>
            <option value="">Semua Status</option>
            <option value="open">Buka</option>
            <option value="closed">Tutup</option>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">{Array(4).fill(0).map((_, i) => <Skeleton.Card key={i} />)}</div>
      ) : jobs.length === 0 ? (
        <EmptyState icon={Plus} title="Belum ada lowongan" description="Mulai rekrut dengan memposting lowongan pertamamu."
          action={<Link to="/professional/jobs/create"><Button leftIcon={<Plus size={14} />}>{t('professional.createJob')}</Button></Link>}
        />
      ) : (
        <div className="space-y-4">
          {jobs.map((job, i) => (
            <motion.div key={job.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className="spring">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={job.is_open ? 'success' : 'default'} dot={job.is_open}>
                        {job.is_open ? t('professional.openJob') : t('professional.closedJob')}
                      </Badge>
                      <Badge variant="outline">{employmentTypeLabels[job.employment_type] ?? job.employment_type}</Badge>
                    </div>
                    <h3 className="font-heading font-bold text-xl text-primary dark:text-dark-primary">{job.title}</h3>
                    <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1"><Users size={13} />{job.total_applicants ?? 0} pelamar</span>
                      <span>{formatRelativeTime(job.created_at, 'id')}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link to={`/professional/jobs/${job.id}`}>
                      <Button variant="ghost" size="sm" leftIcon={<Eye size={14} />}>Lihat</Button>
                    </Link>
                    <Link to={`/professional/jobs/${job.id}/edit`}>
                      <Button variant="ghost" size="sm" leftIcon={<Edit size={14} />}>Edit</Button>
                    </Link>
                    <Button
                      variant="secondary" size="sm"
                      leftIcon={job.is_open ? <ToggleRight size={14} className="text-success" /> : <ToggleLeft size={14} />}
                      loading={toggleMutation.isPending}
                      onClick={() => toggleMutation.mutate(job.id)}
                    >
                      {job.is_open ? 'Tutup' : 'Buka'}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
          <Pagination meta={meta} onChange={(p) => setFilters(prev => ({ ...prev, page: p }))} className="mt-4" />
        </div>
      )}
    </div>
  );
}
