import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';

import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Tabs from '@/components/ui/Tabs';
import { toast } from '@/components/ui/Toast';
import { useAuthStore } from '@/stores/authStore';
import client from '@/lib/api/client';
import { AUTH } from '@/lib/api/endpoints';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const loginMutation = useMutation({
    mutationFn: (data) => client.post(AUTH.LOGIN, data),
    onSuccess: (res) => {
      setAuth({
        user: res.data.user,
        token: res.data.token,
        isProfileCompleted: res.data.user?.is_profile_completed,
      });
      toast.success(t('auth.loginSuccess'));

      const role = res.data.user?.role;
      const dest = from ?? (role === 'student' ? '/student/dashboard' : '/professional/dashboard');
      navigate(dest, { replace: true });
    },
    onError: (err) => {
      toast.error(err.message ?? t('errors.serverError'));
    },
  });

  const onSubmit = (data) => loginMutation.mutate(data);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[80vh]">
      {/* Left — Branding */}
      <div className="hidden lg:block lg:col-span-7 pr-8">
        <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-4">
          — The Vocational Hub
        </p>
        <h1 className="font-heading text-6xl font-extrabold text-primary dark:text-dark-primary tracking-tight leading-tight mb-6">
          Your Career <br />
          <span className="text-gradient">Starts Here.</span>
        </h1>
        <p className="text-on-surface-variant dark:text-dark-on-surface-variant text-lg leading-relaxed max-w-md">
          {t('landing.heroSubtitle')}
        </p>

        {/* Social proof */}
        <div className="mt-10 flex items-center gap-4">
          <div className="flex -space-x-3">
            {['A', 'B', 'C', 'D'].map((l) => (
              <div key={l} className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-sm font-bold text-secondary ring-2 ring-surface dark:ring-dark-surface">
                {l}
              </div>
            ))}
          </div>
          <div>
            <p className="font-bold text-sm text-primary dark:text-dark-primary">48.2K+ Students</p>
            <p className="text-xs text-on-surface-variant dark:text-dark-on-surface-variant">Joined this month</p>
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="lg:col-span-5">
        <Card variant="default" className="p-8">
          {/* Tab switcher */}
          <div className="flex justify-center mb-8">
            <Tabs
              value="login"
              onChange={(v) => v === 'register' && navigate('/auth/register')}
              tabs={[
                { value: 'login', label: t('auth.login') },
                { value: 'register', label: t('auth.register') },
              ]}
            />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <Input
              label={t('auth.email')}
              type="email"
              placeholder="you@email.com"
              leftIcon={<Mail size={16} />}
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label={t('auth.password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              leftIcon={<Lock size={16} />}
              rightIcon={
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="flex justify-end">
              <Link to="/auth/forgot-password" className="text-xs text-secondary hover:underline font-semibold">
                {t('auth.forgotPassword')}
              </Link>
            </div>

            <Button type="submit" loading={loginMutation.isPending} className="w-full mt-2">
              {t('auth.login')}
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-1">
              <hr className="flex-1 border-outline-variant dark:border-dark-outline-variant" />
              <span className="text-xs text-on-surface-variant uppercase tracking-widest">{t('common.or')}</span>
              <hr className="flex-1 border-outline-variant dark:border-dark-outline-variant" />
            </div>

            {/* Google login */}
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => { window.location.href = import.meta.env.VITE_GOOGLE_AUTH_URL; }}
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4" />
              {t('auth.googleLogin')}
            </Button>

            <p className="text-center text-sm text-on-surface-variant dark:text-dark-on-surface-variant">
              {t('auth.noAccount')}{' '}
              <Link to="/auth/register" className="text-secondary font-bold hover:underline">
                {t('auth.registerHere')}
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
