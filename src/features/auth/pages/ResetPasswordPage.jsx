import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';

import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { toast } from '@/components/ui/Toast';
import client from '@/lib/api/client';
import { AUTH } from '@/lib/api/endpoints';

const schema = z.object({
  password: z.string().min(8),
  password_confirmation: z.string().min(8),
}).refine((d) => d.password === d.password_confirmation, {
  path: ['password_confirmation'],
  message: 'Passwords do not match',
});

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: (data) => client.post(AUTH.RESET_PASSWORD, { ...data, token, email }),
    onSuccess: () => {
      toast.success(t('auth.resetSuccess'));
      navigate('/auth/login');
    },
    onError: (err) => toast.error(err.message ?? t('errors.serverError')),
  });

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Card className="p-8 text-center max-w-sm">
          <p className="text-error font-semibold">Invalid reset link. Please request a new one.</p>
          <Link to="/auth/forgot-password" className="mt-4 block text-secondary hover:underline text-sm font-bold">
            Request Reset Link
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md">
        <Card className="p-8">
          <div className="mb-7">
            <h1 className="font-heading text-2xl font-extrabold text-primary dark:text-dark-primary tracking-tight mb-1.5">
              {t('auth.resetPassword')}
            </h1>
            <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant">
              {t('auth.resetPasswordDesc')}
            </p>
          </div>
          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="flex flex-col gap-5">
            <Input
              label={t('auth.password')}
              type="password" placeholder="••••••••"
              leftIcon={<Lock size={16} />}
              error={errors.password?.message}
              {...register('password')}
            />
            <Input
              label={t('auth.passwordConfirm')}
              type="password" placeholder="••••••••"
              leftIcon={<Lock size={16} />}
              error={errors.password_confirmation?.message}
              {...register('password_confirmation')}
            />
            <Button type="submit" loading={mutation.isPending} className="w-full">
              {t('auth.resetPassword')}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
