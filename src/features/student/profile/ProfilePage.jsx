import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { User, Lock, LogOut, ExternalLink, Edit3, Camera, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import Modal from '@/components/ui/Modal';
import { toast } from '@/components/ui/Toast';
import { useAuthStore } from '@/stores/authStore';
import client from '@/lib/api/client';
import { AUTH, PROFILE } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/queryKeys';

const profileSchema = z.object({
  name: z.string().min(2),
  phone_number: z.string().optional(),
  bio: z.string().max(500).optional(),
  linkedin_url: z.string().url().optional().or(z.literal('')),
  instagram_url: z.string().url().optional().or(z.literal('')),
});

const passwordSchema = z.object({
  current_password: z.string().min(8),
  password: z.string().min(8),
  password_confirmation: z.string().min(8),
}).refine(d => d.password === d.password_confirmation, {
  path: ['password_confirmation'], message: 'Passwords do not match',
});

export default function ProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user, setUser, logout } = useAuthStore();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: queryKeys.student.profile(),
    queryFn: () => client.get(PROFILE.ME),
    select: (r) => {
      const u = r.data?.user || r.data || {};
      const p = r.data?.profile || {};
      return { ...u, ...p };
    },
    initialData: user ? () => ({ data: { user } }) : undefined,
  });

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm({
    values: profile || {},
  });

  const { register: regPw, handleSubmit: handlePw, formState: { errors: pwErrors }, reset: resetPw } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  /* Update profile */
  const updateMutation = useMutation({
    mutationFn: (data) => client.put(PROFILE.UPDATE_STUDENT, data),
    onSuccess: (res) => {
      setUser(res.data?.user ?? res.data);
      toast.success(t('profile.profileUpdated'));
    },
    onError: (err) => toast.error(err.message),
  });

  /* Change password */
  const passwordMutation = useMutation({
    mutationFn: (data) => client.post(AUTH.CHANGE_PASSWORD, data),
    onSuccess: () => {
      toast.success('Password berhasil diubah');
      setShowPasswordModal(false);
      resetPw();
    },
    onError: (err) => toast.error(err.message),
  });

  /* Avatar upload */
  const avatarMutation = useMutation({
    mutationFn: (file) => {
      const form = new FormData();
      form.append('avatar', file);
      return client.post(PROFILE.UPLOAD_AVATAR, form, { headers: { 'Content-Type': 'multipart/form-data' } });
    },
    onSuccess: (res) => {
      setUser(res.data?.user ?? res.data);
      toast.success('Foto profil diperbarui');
      qc.invalidateQueries({ queryKey: queryKeys.student.profile() });
    },
    onError: (err) => toast.error(err.message),
  });

  /* Logout */
  const logoutMutation = useMutation({
    mutationFn: () => client.post(AUTH.LOGOUT),
    onSettled: () => { logout(); navigate('/auth/login', { replace: true }); },
  });

  if (isLoading) {
    return <div className="max-w-2xl mx-auto space-y-5"><Skeleton.Card /><Skeleton.Card /></div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-heading text-4xl font-extrabold text-primary dark:text-dark-primary tracking-tight">{t('nav.profile')}</h1>
      </motion.div>

      {/* Avatar + basic info */}
      <Card className="mb-5 p-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <Avatar src={profile?.avatar} name={profile?.name} size="xl" />
            <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center cursor-pointer shadow-sm hover:bg-secondary-hover transition-colors">
              <Camera size={14} className="text-white" />
              <input id="avatar-upload" type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) avatarMutation.mutate(f); }} />
            </label>
          </div>
          <div>
            <h2 className="font-heading text-2xl font-bold text-primary dark:text-dark-primary">{profile?.name}</h2>
            <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant">{profile?.email}</p>
            <div className="flex gap-2 mt-2">
              <Badge variant="info">{profile?.role === 'student' ? 'Student' : 'Professional'}</Badge>
              {profile?.google_id && <Badge variant="outline">Google Linked</Badge>}
            </div>
          </div>
        </div>
      </Card>

      {/* Edit form */}
      <Card className="mb-5">
        <Card.Header>
          <Card.Title><Edit3 size={16} className="inline mr-2" />Edit Profil</Card.Title>
        </Card.Header>
        <form onSubmit={handleSubmit((d) => updateMutation.mutate(d))} className="flex flex-col gap-5">
          <Input label={t('auth.name')} error={errors.name?.message} {...register('name', { required: true })} />
          <Input label={t('profile.phoneNumber')} type="tel" {...register('phone_number')} />
          <Textarea label={t('profile.bio')} rows={3} placeholder={t('profile.bioPlaceholder')} {...register('bio')} />
          <Input label={t('profile.linkedinUrl')} type="url" placeholder="https://linkedin.com/in/..." {...register('linkedin_url')} />
          {profile?.role === 'student' && (
            <Input label="Instagram" type="url" placeholder="https://instagram.com/..." {...register('instagram_url')} />
          )}
          <Button type="submit" loading={updateMutation.isPending} disabled={!isDirty} className="w-full">
            {t('profile.updateProfile')}
          </Button>
        </form>
      </Card>

      {/* Security */}
      <Card className="mb-5">
        <Card.Header>
          <Card.Title><Lock size={16} className="inline mr-2" />Keamanan</Card.Title>
        </Card.Header>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-sm text-primary dark:text-dark-primary">Password</p>
            <p className="text-xs text-on-surface-variant dark:text-dark-on-surface-variant">Ubah password akun kamu</p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setShowPasswordModal(true)} disabled={!!profile?.google_id}>
            {profile?.google_id ? 'Google Auth' : 'Ubah Password'}
          </Button>
        </div>
      </Card>

      {/* Logout */}
      <Button variant="danger" className="w-full" leftIcon={<LogOut size={16} />}
        loading={logoutMutation.isPending}
        onClick={() => logoutMutation.mutate()}>
        {t('nav.logout')}
      </Button>

      {/* Password modal */}
      <Modal open={showPasswordModal} onClose={() => setShowPasswordModal(false)} title="Ubah Password" size="sm">
        <Modal.Body>
          <form id="pw-form" onSubmit={handlePw((d) => passwordMutation.mutate(d))} className="flex flex-col gap-4 py-2">
            <Input label="Password Lama" type={showPw ? 'text' : 'password'} rightIcon={<button type="button" onClick={() => setShowPw(!showPw)}>{showPw ? <EyeOff size={14} /> : <Eye size={14} />}</button>} error={pwErrors.current_password?.message} {...regPw('current_password')} />
            <Input label="Password Baru" type="password" error={pwErrors.password?.message} {...regPw('password')} />
            <Input label="Konfirmasi Password Baru" type="password" error={pwErrors.password_confirmation?.message} {...regPw('password_confirmation')} />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="ghost" onClick={() => setShowPasswordModal(false)}>{t('common.cancel')}</Button>
          <Button type="submit" form="pw-form" loading={passwordMutation.isPending}>{t('common.save')}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
