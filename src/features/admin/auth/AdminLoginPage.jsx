import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Lock, Mail, Shield } from 'lucide-react';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from '@/components/ui/Toast';
import { Toaster } from '@/components/ui/Toast';
import ThemeToggle from '@/components/ui/ThemeToggle';
import LangToggle from '@/components/ui/LangToggle';
import { useAuthStore } from '@/stores/authStore';
import adminClient from '@/lib/api/adminClient';
import { ADMIN } from '@/lib/api/endpoints';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function AdminLoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setAdminAuth } = useAuthStore();

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: (data) => adminClient.post(ADMIN.LOGIN, data),
    onSuccess: (res) => {
      setAdminAuth({ user: res.data.admin, token: res.data.token });
      toast.success('Welcome, Admin!');
      navigate('/admin/dashboard', { replace: true });
    },
    onError: (err) => toast.error(err.message ?? t('errors.serverError')),
  });

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-accent/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Controls */}
      <div className="absolute top-5 right-5 flex gap-2">
        <LangToggle className="bg-slate-800 hover:bg-slate-700" />
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-sq-xl bg-secondary mx-auto flex items-center justify-center mb-4 shadow-lg shadow-secondary/30">
            <Shield size={28} className="text-white" />
          </div>
          <h1 className="font-heading text-3xl font-extrabold text-slate-100 tracking-tight">Admin Console</h1>
          <p className="mt-1 text-slate-400 text-sm">KerjaIn Platform Management</p>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-xl rounded-sq-xl border border-slate-800 p-8">
          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="flex flex-col gap-5">
            <div>
              <Input
                label="Email"
                type="email"
                placeholder="admin@kerjain.id"
                leftIcon={<Mail size={16} />}
                error={errors.email?.message}
                className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-secondary/60"
                {...register('email')}
              />
            </div>
            <div>
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock size={16} />}
                error={errors.password?.message}
                className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-secondary/60"
                {...register('password')}
              />
            </div>
            <Button type="submit" loading={mutation.isPending} className="w-full mt-2">
              Masuk ke Admin
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Belum punya akun?{' '}
            <Link to="/admin/register" className="text-secondary hover:underline font-semibold">
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>

      <Toaster />
    </div>
  );
}
