import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Trash2, Eye, UserPlus } from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Avatar from '@/components/ui/Avatar';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';
import Modal from '@/components/ui/Modal';
import { toast } from '@/components/ui/Toast';
import adminClient from '@/lib/api/adminClient';
import { ADMIN } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/queryKeys';
import { buildQueryString, formatRelativeTime } from '@/lib/utils';

const roleVariant = { student: 'info', professional: 'success', admin: 'error' };

export default function UserListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [filters, setFilters] = useState({ page: 1, q: '', role: '' });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.admin.users.list(filters),
    queryFn: () => adminClient.get(`${ADMIN.USERS}?${buildQueryString(filters)}`),
    select: (r) => r.data,
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminClient.delete(ADMIN.USER_DETAIL(id)),
    onSuccess: () => {
      toast.success('User berhasil dihapus');
      setDeleteTarget(null);
      qc.invalidateQueries({ queryKey: queryKeys.admin.users.all() });
    },
    onError: (err) => toast.error(err.message),
  });

  const users = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-4xl font-extrabold text-slate-100 tracking-tight">{t('admin.userManagement')}</h1>
      </motion.div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-6">
        <div className="md:col-span-8">
          <Input
            placeholder="Cari nama atau email..."
            leftIcon={<Search size={16} />}
            value={filters.q}
            className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500"
            onChange={(e) => setFilters(p => ({ ...p, q: e.target.value, page: 1 }))}
          />
        </div>
        <div className="md:col-span-4">
          <Select value={filters.role} className="bg-slate-800/50 border-slate-700 text-slate-100"
            onChange={(e) => setFilters(p => ({ ...p, role: e.target.value, page: 1 }))}>
            <option value="">Semua Role</option>
            <option value="student">Student</option>
            <option value="professional">Professional</option>
            <option value="admin">Admin</option>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-sq-xl border border-slate-800 overflow-hidden bg-slate-900/40 backdrop-blur-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              {['User', 'Role', 'Bergabung', 'Actions'].map((h) => (
                <th key={h} className="text-left px-5 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <tr key={i} className="border-b border-slate-800/50">
                  {Array(4).fill(0).map((_, j) => (
                    <td key={j} className="px-5 py-4"><Skeleton className="h-4 w-full rounded-sq-sm" /></td>
                  ))}
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-8">
                  <EmptyState icon={Search} title="Tidak ada user" />
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar src={user.avatar} name={user.name} size="sm" />
                      <div>
                        <p className="font-bold text-sm text-slate-100">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={roleVariant[user.role] ?? 'default'} className="capitalize">{user.role}</Badge>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-400">{formatRelativeTime(user.created_at, 'id')}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" leftIcon={<Eye size={13} />}
                        className="text-slate-400 hover:text-slate-100"
                        onClick={() => navigate(`/admin/users/${user.id}`)}>
                        Lihat
                      </Button>
                      <Button variant="ghost" size="sm" leftIcon={<Trash2 size={13} />}
                        className="text-slate-400 hover:text-error"
                        onClick={() => setDeleteTarget(user)}>
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

      {meta && (
        <div className="mt-4">
          <Pagination meta={meta} onChange={(p) => setFilters(prev => ({ ...prev, page: p }))} />
        </div>
      )}

      {/* Delete confirm modal */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title={t('admin.deleteUser')} size="sm">
        <Modal.Body>
          <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant py-2">
            {t('admin.deleteUserConfirm')}
            <strong className="block text-primary dark:text-dark-primary mt-1">{deleteTarget?.name} ({deleteTarget?.email})</strong>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>{t('common.cancel')}</Button>
          <Button variant="danger" loading={deleteMutation.isPending} onClick={() => deleteMutation.mutate(deleteTarget?.id)}>
            {t('admin.deleteUser')}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
