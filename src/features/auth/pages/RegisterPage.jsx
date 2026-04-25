import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User, Briefcase, GraduationCap, Eye, EyeOff } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';

import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Tabs from '@/components/ui/Tabs';
import { toast } from '@/components/ui/Toast';
import { useAuthStore } from '@/stores/authStore';
import client from '@/lib/api/client';
import { AUTH } from '@/lib/api/endpoints';
import { cn } from '@/lib/utils';

const schema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    password_confirmation: z.string().min(8),
    role: z.enum(['student', 'professional']),
  })
  .refine((d) => d.password === d.password_confirmation, {
    path: ['password_confirmation'],
    message: 'Passwords do not match',
  });

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: 'student' },
  });

  const selectedRole = watch('role');

  const registerMutation = useMutation({
    mutationFn: (data) => client.post(AUTH.REGISTER, data),
    onSuccess: (res) => {
      setAuth({
        user: res.data.user,
        token: res.data.token,
        isProfileCompleted: res.data.user?.is_profile_completed ?? false,
      });
      toast.success(t('auth.registerSuccess'));
      navigate('/complete-profile', { replace: true });
    },
    onError: (err) => {
      toast.error(err.message ?? t('errors.serverError'));
    },
  });

  const onSubmit = (data) => registerMutation.mutate(data);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[85vh]">
      {/* Left — Branding */}
      <div className="hidden lg:block lg:col-span-7 pr-8">
        <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-4">
          — Join KerjaIn
        </p>
        <h1 className="font-heading text-6xl font-extrabold text-primary dark:text-dark-primary tracking-tight leading-tight mb-6">
          Build Your <br />
          <span className="text-gradient">Future Career.</span>
        </h1>
        <p className="text-on-surface-variant dark:text-dark-on-surface-variant text-lg leading-relaxed max-w-md">
          {t('landing.heroSubtitle')}
        </p>
      </div>

      {/* Right — Form */}
      <div className="lg:col-span-5">
        <Card variant="default" className="p-8">
          {/* Tab switcher */}
          <div className="flex justify-center mb-7">
            <Tabs
              value="register"
              onChange={(v) => v === 'login' && navigate('/auth/login')}
              tabs={[
                { value: 'login', label: t('auth.login') },
                { value: 'register', label: t('auth.register') },
              ]}
            />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {/* Role selector */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant dark:text-dark-on-surface-variant mb-3 ml-1">
                {t('auth.chooseRole')}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'student', label: t('auth.student'), Icon: GraduationCap },
                  { value: 'professional', label: t('auth.professional'), Icon: Briefcase },
                ].map(({ value, label, Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setValue('role', value)}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-sq-md border transition-all duration-200 spring',
                      selectedRole === value
                        ? 'border-secondary bg-primary-fixed text-secondary shadow-sm'
                        : 'border-outline-variant dark:border-dark-outline-variant text-on-surface-variant dark:text-dark-on-surface-variant hover:border-secondary/40',
                    )}
                  >
                    <Icon size={22} />
                    <span className="text-sm font-bold">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <Input
              label={t('auth.name')}
              type="text"
              placeholder="Nama Lengkap"
              leftIcon={<User size={16} />}
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label={t('auth.email')}
              type="email"
              placeholder="you@email.com"
              leftIcon={<Mail size={16} />}
              error={errors.email?.message}
              {...register('email')}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label={t('auth.password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                leftIcon={<Lock size={16} />}
                error={errors.password?.message}
                {...register('password')}
              />
              <Input
                label={t('auth.passwordConfirm')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                leftIcon={<Lock size={16} />}
                rightIcon={
                  <button type="button" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                }
                error={errors.password_confirmation?.message}
                {...register('password_confirmation')}
              />
            </div>

            <Button type="submit" loading={registerMutation.isPending} className="w-full mt-1">
              {t('auth.register')}
            </Button>

            {/* Google */}
            <div className="flex items-center gap-3 my-1">
              <hr className="flex-1 border-outline-variant dark:border-dark-outline-variant" />
              <span className="text-xs text-on-surface-variant uppercase tracking-widest">{t('common.or')}</span>
              <hr className="flex-1 border-outline-variant dark:border-dark-outline-variant" />
            </div>
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
              {t('auth.hasAccount')}{' '}
              <Link to="/auth/login" className="text-secondary font-bold hover:underline">
                {t('auth.loginHere')}
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
