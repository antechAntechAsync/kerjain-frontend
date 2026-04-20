import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';

import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { toast } from '@/components/ui/Toast';
import client from '@/lib/api/client';
import { AUTH } from '@/lib/api/endpoints';

const schema = z.object({ email: z.string().email() });

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: (data) => client.post(AUTH.FORGOT_PASSWORD, data),
    onSuccess: () => { setSent(true); },
    onError: (err) => toast.error(err.message ?? t('errors.serverError')),
  });

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md">
        <Card className="p-8">
          {sent ? (
            <div className="flex flex-col items-center gap-5 text-center py-4">
              <div className="w-14 h-14 rounded-sq-xl bg-success-container flex items-center justify-center">
                <CheckCircle size={28} className="text-success" />
              </div>
              <div>
                <h2 className="font-heading text-xl font-bold text-primary dark:text-dark-primary mb-2">
                  Check Your Email
                </h2>
                <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant">
                  {t('auth.checkEmail')}
                </p>
              </div>
              <Link to="/auth/login">
                <Button variant="secondary" size="sm" leftIcon={<ArrowLeft size={14} />}>
                  {t('common.back')}
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-7">
                <h1 className="font-heading text-2xl font-extrabold text-primary dark:text-dark-primary tracking-tight mb-1.5">
                  {t('auth.forgotPassword')}
                </h1>
                <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant">
                  {t('auth.forgotPasswordDesc')}
                </p>
              </div>

              <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="flex flex-col gap-5">
                <Input
                  label={t('auth.email')}
                  type="email"
                  placeholder="you@email.com"
                  leftIcon={<Mail size={16} />}
                  error={errors.email?.message}
                  {...register('email')}
                />
                <Button type="submit" loading={mutation.isPending} className="w-full">
                  {t('auth.sendResetLink')}
                </Button>
                <Link to="/auth/login" className="flex items-center justify-center gap-1.5 text-sm text-on-surface-variant dark:text-dark-on-surface-variant hover:text-primary dark:hover:text-dark-primary">
                  <ArrowLeft size={14} />
                  {t('common.back')} to Login
                </Link>
              </form>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
