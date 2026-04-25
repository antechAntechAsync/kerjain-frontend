import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ExternalLink, Lock, Globe, Edit3, X } from 'lucide-react';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import TagInput from '@/components/ui/TagInput';
import { toast } from '@/components/ui/Toast';
import client from '@/lib/api/client';
import { STUDENT } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/queryKeys';

const schema = z.object({
  description: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  url: z.string().url().optional().or(z.literal('')),
  visibility: z.enum(['public', 'private']),
  skills: z.array(z.string()).min(1, 'Tambahkan minimal 1 skill'),
});

export default function PortfolioPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.student.portfolio(),
    queryFn: () => client.get(STUDENT.PORTFOLIO),
    select: (r) => r.data,
  });

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { visibility: 'public', skills: [] },
  });

  const openCreate = () => { setEditing(null); reset({ visibility: 'public', skills: [], url: '', description: '' }); setModalOpen(true); };
  const openEdit = (item) => { 
    setEditing(item); 
    reset({
      description: item.description,
      url: item.external_link || '',
      visibility: item.is_public ? 'public' : 'private',
      skills: item.skills || [],
    }); 
    setModalOpen(true); 
  };

  const mutate = useMutation({
    mutationFn: (data) => {
      const payload = {
        description: data.description,
        external_link: data.url,
        is_public: data.visibility === 'public',
        skills: data.skills,
      };
      return editing
        ? client.put(STUDENT.PORTFOLIO_ITEM(editing.id), payload)
        : client.post(STUDENT.PORTFOLIO, payload);
    },
    onSuccess: () => {
      toast.success(editing ? 'Portofolio diperbarui' : 'Portofolio ditambahkan');
      qc.invalidateQueries({ queryKey: queryKeys.student.portfolio() });
      setModalOpen(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutate = useMutation({
    mutationFn: (id) => client.delete(STUDENT.PORTFOLIO_ITEM(id)),
    onSuccess: () => {
      toast.success('Portofolio dihapus');
      qc.invalidateQueries({ queryKey: queryKeys.student.portfolio() });
    },
    onError: (err) => toast.error(err.message),
  });

  const items = data?.data ?? data ?? [];

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-4xl font-extrabold text-primary dark:text-dark-primary tracking-tight">{t('student.portfolio')}</h1>
          <p className="mt-1 text-on-surface-variant dark:text-dark-on-surface-variant">{items.length} proyek</p>
        </div>
        <Button onClick={openCreate} leftIcon={<Plus size={16} />}>{t('student.addPortfolio')}</Button>
      </motion.div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array(3).fill(0).map((_, i) => <Skeleton.Card key={i} />)}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title={t('student.noPortfolio')}
          description="Tambahkan proyek pertamamu untuk membangun portofolio yang kuat."
          action={<Button onClick={openCreate} leftIcon={<Plus size={14} />}>{t('student.addPortfolio')}</Button>}
        />
      ) : (
        <motion.div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <AnimatePresence>
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.04 }}
              >
                <PortfolioCard item={item} onEdit={openEdit} onDelete={(id) => deleteMutate.mutate(id)} t={t} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Portofolio' : t('student.addPortfolio')}
        size="md"
      >
        <Modal.Body>
          <form id="portfolio-form" onSubmit={handleSubmit((d) => mutate.mutate(d))} className="flex flex-col gap-5 py-2">
            <Controller
              control={control}
              name="skills"
              render={({ field }) => (
                <TagInput
                  label="Skills / Teknologi Terkait"
                  placeholder="Misal: React, Node.js"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.skills?.message}
                />
              )}
            />
            <Textarea label="Deskripsi Proyek" placeholder="Jelaskan proyekmu secara detail..." rows={4} error={errors.description?.message} {...register('description')} />
            <Input label="URL Proyek" type="url" placeholder="https://github.com/..." error={errors.url?.message} {...register('url')} />
            <Select label="Visibilitas" {...register('visibility')}>
              <option value="public">🌎 {t('student.portfolioPublic')}</option>
              <option value="private">🔒 {t('student.portfolioPrivate')}</option>
            </Select>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="ghost" onClick={() => setModalOpen(false)}>{t('common.cancel')}</Button>
          <Button type="submit" form="portfolio-form" loading={mutate.isPending}>{t('common.save')}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

/* ── Portfolio Card ───────────────────────────────────── */
function PortfolioCard({ item, onEdit, onDelete, t }) {
  return (
    <Card className="h-full spring hover:shadow-ambient group">
      {/* Top */}
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="w-10 h-10 rounded-sq-md bg-primary-fixed flex items-center justify-center text-secondary font-black text-base flex-shrink-0">
          {item.title?.[0]?.toUpperCase() ?? 'P'}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(item)} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-surface-container-low dark:hover:bg-dark-surface-container text-on-surface-variant transition-colors">
            <Edit3 size={13} />
          </button>
          <button onClick={() => onDelete(item.id)} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-error-container text-on-surface-variant hover:text-error transition-colors">
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <h3 className="font-heading font-bold text-primary dark:text-dark-primary mb-2 line-clamp-2">
        {item.skills?.length > 0 ? item.skills.slice(0, 3).join(' • ') : 'Proyek Portofolio'}
      </h3>
      {item.description && (
        <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant leading-relaxed mb-4 line-clamp-3">{item.description}</p>
      )}

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-outline-variant dark:border-dark-outline-variant">
        <Badge variant={item.is_public ? 'success' : 'outline'} dot={item.is_public}>
          {item.is_public ? t('student.portfolioPublic') : t('student.portfolioPrivate')}
        </Badge>
        {item.external_link && (
          <a href={item.external_link} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-secondary hover:opacity-80 transition-opacity">
            <ExternalLink size={15} />
          </a>
        )}
      </div>
    </Card>
  );
}
