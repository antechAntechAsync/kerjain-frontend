import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Flame, Calendar, Trophy, CheckCircle, ArrowRight, BookOpen } from 'lucide-react';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import { toast } from '@/components/ui/Toast';
import { useAuthStore } from '@/stores/authStore';
import client from '@/lib/api/client';
import { STUDENT } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/queryKeys';
import { cn, formatDate } from '@/lib/utils';

const schema = z.object({
  description: z.string().min(10, 'Tulis minimal 10 karakter').max(500),
});

export default function StreakPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.student.streak(),
    queryFn: () => client.get(STUDENT.STREAK),
    select: (r) => r.data,
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const checkinMutation = useMutation({
    mutationFn: (d) => client.post(STUDENT.CHECKIN, d),
    onSuccess: () => {
      toast.success(t('student.checkinSuccess'));
      qc.invalidateQueries({ queryKey: queryKeys.student.streak() });
      qc.invalidateQueries({ queryKey: queryKeys.student.dashboard() });
      reset();
    },
    onError: (err) => toast.error(err.message),
  });

  if (isLoading) {
    return <div className="space-y-5"><Skeleton.Card /><Skeleton.Card /></div>;
  }

  const streak = data?.streak ?? {};
  const history = data?.history ?? data?.data ?? []; // Handle paginated response
  const checkedInToday = streak.checked_in_today ?? false;

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-heading text-4xl font-extrabold text-primary dark:text-dark-primary tracking-tight">{t('student.streak')}</h1>
      </motion.div>

      {/* Streak card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card variant="dark" className="p-8 text-center mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <motion.div
              animate={checkedInToday ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5 }}
              className="text-7xl mb-4"
            >
              {checkedInToday ? '🔥' : '❄️'}
            </motion.div>
            <p className="font-heading text-8xl font-extrabold text-white tracking-tight">
              {streak.current_streak ?? 0}
            </p>
            <p className="text-white/60 font-semibold mb-2">{t('student.streakDay')}</p>

            <div className="flex justify-center gap-6 mt-4">
              <div className="text-center">
                <p className="font-heading text-2xl font-bold text-white">{streak.longest_streak ?? 0}</p>
                <p className="text-xs text-white/60">Terpanjang</p>
              </div>
              <div className="w-px bg-white/10" />
              <div className="text-center">
                <p className="font-heading text-2xl font-bold text-white">{streak.total_checkins ?? 0}</p>
                <p className="text-xs text-white/60">Total Check-in</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Check-in form */}
      {!checkedInToday ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="mb-6">
            <Card.Header>
              <Card.Title>{t('student.checkin')}</Card.Title>
            </Card.Header>
            <form onSubmit={handleSubmit((d) => checkinMutation.mutate(d))} className="flex flex-col gap-4">
              <Textarea
                label={t('student.checkinDesc')}
                placeholder="Hari ini saya belajar tentang... (ceritakan progresmu)"
                rows={3}
                error={errors.description?.message}
                {...register('description')}
              />
              <Button type="submit" loading={checkinMutation.isPending} leftIcon={<Flame size={16} />} className="w-full">
                Check In Sekarang
              </Button>
            </form>
          </Card>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
          <div className="flex items-center gap-3 px-5 py-4 rounded-sq-md bg-success-container text-success font-semibold text-sm">
            <CheckCircle size={18} />
            {t('student.checkinDone')} — Keep it up! 🎉
          </div>
        </motion.div>
      )}

      {/* History */}
      <Card>
        <Card.Header>
          <Card.Title>Riwayat Check-in</Card.Title>
        </Card.Header>
        {history.length === 0 ? (
          <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant">Belum ada riwayat.</p>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {history.map((h, i) => (
              <motion.div
                key={h.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-start gap-3 p-3 rounded-sq-md bg-surface-container-low dark:bg-dark-surface-container"
              >
                <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                  <Flame size={14} className="text-success" />
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface-variant dark:text-dark-on-surface-variant mb-0.5">
                    {formatDate(h.checkin_date || h.created_at, 'id')}
                  </p>
                  {h.description && (
                    <p className="text-sm text-primary dark:text-dark-primary leading-relaxed">{h.description}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
