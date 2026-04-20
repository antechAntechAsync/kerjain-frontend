import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ToggleRight, ToggleLeft, Eye, Trash2 } from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';
import Modal from '@/components/ui/Modal';
import { toast } from '@/components/ui/Toast';
import adminClient from '@/lib/api/adminClient';
import { ADMIN } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/queryKeys';
import { buildQueryString, formatRelativeTime, employmentTypeLabels } from '@/lib/utils';

export default function AdminJobListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [filters, setFilters] = useState({ page: 1, q: '', status: '' });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.admin.jobs.list(filters),
    queryFn: () => adminClient.get(`${ADMIN.JOBS}?${buildQueryString(filters)}`),
    select: (r) => r.data,
    keepPreviousData: true,
  });

  const toggleMutation = useMutation({
    mutationFn: (id) => adminClient.patch(ADMIN.JOB_STATUS(id)),
    onSuccess: () => { toast.success('Status lowongan diperbarui'); qc.invalidateQueries({ queryKey: queryKeys.admin.jobs.all() }); },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminClient.delete(ADMIN.JOB_DETAIL(id)),
    onSuccess: () => { toast.success('Lowongan dihapus'); setDeleteTarget(null); qc.invalidateQueries({ queryKey: queryKeys.admin.jobs.all() }); },
    onError: (err) => toast.error(err.message),
  });

  const jobs = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-heading text-4xl font-extrabold text-slate-100 tracking-tight">{t('admin.jobManagement')}</h1>
      </motion.div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-6">
        <div className="md:col-span-8">
          <Input
            placeholder="Cari lowongan..."
            leftIcon={<Search size={16} />}
            value={filters.q}
            className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500"
            onChange={(e) => setFilters(p => ({ ...p, q: e.target.value, page: 1 }))}
          />
        </div>
        <div className="md:col-span-4">
          <Select value={filters.status} className="bg-slate-800/50 border-slate-700 text-slate-100"
            onChange={(e) => setFilters(p => ({ ...p, status: e.target.value, page: 1 }))}>
            <option value="">Semua Status</option>
            <option value="open">Buka</option>
            <option value="closed">Tutup</option>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-sq-xl border border-slate-800 overflow-hidden bg-slate-900/40 backdrop-blur-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              {['Lowongan', 'Tipe', 'Perusahaan', 'Pelamar', 'Status', 'Actions'].map((h) => (
                <th key={h} className="text-left px-5 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <tr key={i} className="border-b border-slate-800/50">
                  {Array(6).fill(0).map((_, j) => (
                    <td key={j} className="px-5 py-4"><Skeleton className="h-4 w-full rounded-sq-sm" /></td>
                  ))}
                </tr>
              ))
            ) : jobs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8">
                  <EmptyState icon={Search} title="Tidak ada lowongan" />
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <motion.tr
                  key={job.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-5 py-4">
                    <p className="font-bold text-sm text-slate-100">{job.title}</p>
                    <p className="text-xs text-slate-500">{formatRelativeTime(job.created_at, 'id')}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-400">{employmentTypeLabels[job.employment_type] ?? job.employment_type}</td>
                  <td className="px-5 py-4 text-sm text-slate-300">{job.professional?.company_name ?? job.professional?.name ?? '-'}</td>
                  <td className="px-5 py-4 text-sm text-slate-400">{job.total_applicants ?? 0}</td>
                  <td className="px-5 py-4">
                    <Badge variant={job.is_open ? 'success' : 'default'} dot={job.is_open}>
                      {job.is_open ? t('professional.openJob') : t('professional.closedJob')}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" leftIcon={<ToggleRight size={13} />}
                        className="text-slate-400 hover:text-slate-100"
                        loading={toggleMutation.isPending}
                        onClick={() => toggleMutation.mutate(job.id)}>
                        Toggle
                      </Button>
                      <Button variant="ghost" size="sm" leftIcon={<Trash2 size={13} />}
                        className="text-slate-400 hover:text-error"
                        onClick={() => setDeleteTarget(job)}>
                        Hapus
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {meta && <div className="mt-4"><Pagination meta={meta} onChange={(p) => setFilters(prev => ({ ...prev, page: p }))} /></div>}

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Hapus Lowongan" size="sm">
        <Modal.Body>
          <p className="text-sm text-on-surface-variant py-2">
            Yakin ingin menghapus lowongan <strong className="text-primary dark:text-dark-primary">{deleteTarget?.title}</strong>?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>{t('common.cancel')}</Button>
          <Button variant="danger" loading={deleteMutation.isPending} onClick={() => deleteMutation.mutate(deleteTarget?.id)}>
            Hapus
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
