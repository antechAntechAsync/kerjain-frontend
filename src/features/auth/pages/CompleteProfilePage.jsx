import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GraduationCap, Briefcase, Phone, Building2, Link, Link2, Camera, User } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';

import { Input } from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { toast } from '@/components/ui/Toast';
import { useAuthStore } from '@/stores/authStore';
import client from '@/lib/api/client';
import { PROFILE } from '@/lib/api/endpoints';
import { cn } from '@/lib/utils';

const studentSchema = z.object({
  name: z.string().min(2, 'Min 2 characters').max(100),
  phone_number: z.string().min(10, 'Min 10 digits').max(15),
  school_name: z.string().min(2, 'Required'),
  industry: z.string().min(2, 'Required'),
  other_industry: z.string().optional(),
  bio: z.string().min(10, 'Bio must be at least 10 characters').max(1000),
  linkedin_url: z.string().url().optional().or(z.literal('')),
  instagram_url: z.string().url().optional().or(z.literal('')),
}).refine((data) => data.industry !== 'Lainnya' || (data.other_industry && data.other_industry.length > 2), {
  message: 'Harap isi bidang industri',
  path: ['other_industry'],
});

const professionalSchema = z.object({
  name: z.string().min(2, 'Min 2 characters').max(100),
  phone_number: z.string().min(10, 'Min 10 digits').max(15),
  company_name: z.string().min(2, 'Required'),
  industry: z.string().min(2, 'Required'),
  other_industry: z.string().optional(),
  bio: z.string().max(1000).optional(),
  linkedin_url: z.string().url().optional().or(z.literal('')),
}).refine((data) => data.industry !== 'Lainnya' || (data.other_industry && data.other_industry.length > 2), {
  message: 'Harap isi bidang industri',
  path: ['other_industry'],
});

const INDUSTRIES = [
  'Teknologi', 'Manufaktur', 'Ritel & E-commerce', 'Kesehatan', 'Pendidikan',
  'Keuangan', 'Logistik', 'Kreatif & Media', 'Perhotelan', 'Konstruksi', 'Lainnya',
];

export default function CompleteProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, setUser, setProfileCompleted } = useAuthStore();
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const isStudent = user?.role === 'student';
  const schema = isStudent ? studentSchema : professionalSchema;

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name || '',
      phone_number: user?.phone_number || '',
      industry: user?.industry || '',
      bio: '',
    }
  });

  const selectedIndustry = watch('industry');

  const mutation = useMutation({
    mutationFn: async (data) => {
      // Merge other_industry if 'Lainnya' is selected
      const payload = {
        ...data,
        industry: data.industry === 'Lainnya' ? data.other_industry : data.industry,
      };
      delete payload.other_industry;

      const res = await client.post(PROFILE.COMPLETE, payload);
      // Upload avatar if selected
      if (avatarFile) {
        const form = new FormData();
        form.append('avatar', avatarFile);
        await client.post(PROFILE.UPLOAD_AVATAR, form, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      return res;
    },
    onSuccess: (res) => {
      setUser(res.data?.data?.user ?? { ...user, is_profile_completed: true });
      setProfileCompleted(true);
      toast.success(t('profile.profileUpdated'));
      navigate(isStudent ? '/student/dashboard' : '/professional/dashboard', { replace: true });
    },
    onError: (err) => {
      console.error('Complete Profile Error:', err);
      toast.error(err.message ?? t('errors.serverError'));
    },
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error(t('errors.fileTooLarge')); return; }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-dark-surface flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-fixed text-secondary text-xs font-bold uppercase tracking-widest mb-4">
            {isStudent ? <GraduationCap size={14} /> : <Briefcase size={14} />}
            {isStudent ? 'Student Profile' : 'Professional Profile'}
          </div>
          <h1 className="font-heading text-4xl font-extrabold text-primary dark:text-dark-primary tracking-tight">
            {t('profile.completeProfile')}
          </h1>
          <p className="mt-2 text-on-surface-variant dark:text-dark-on-surface-variant">
            {t('profile.completeProfileDesc')}
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="flex flex-col gap-6">
            {/* Avatar upload */}
            <div className="flex flex-col items-center gap-3">
              <label htmlFor="avatar-upload" className="cursor-pointer group relative">
                <div className={cn(
                  'w-24 h-24 rounded-full border-2 border-dashed border-outline-variant dark:border-dark-outline-variant',
                  'flex items-center justify-center overflow-hidden transition-all duration-200',
                  'group-hover:border-secondary',
                  avatarPreview ? 'border-solid' : '',
                )}>
                  {avatarPreview
                    ? <img src={avatarPreview} className="w-full h-full object-cover" alt="preview" />
                    : <Camera size={28} className="text-on-surface-variant dark:text-dark-on-surface-variant group-hover:text-secondary transition-colors" />
                  }
                </div>
                <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-secondary flex items-center justify-center shadow-sm">
                  <Camera size={12} className="text-white" />
                </div>
              </label>
              <input id="avatar-upload" type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleAvatarChange} />
              <p className="text-xs text-on-surface-variant dark:text-dark-on-surface-variant">{t('profile.avatarHint')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Full Name"
                placeholder="John Doe"
                leftIcon={<User size={16} />}
                error={errors.name?.message}
                {...register('name')}
              />

              <Input
                label={t('profile.phoneNumber')}
                type="tel"
                placeholder="+62 8xx"
                leftIcon={<Phone size={16} />}
                error={errors.phone_number?.message}
                {...register('phone_number')}
              />

              {isStudent ? (
                <Input
                  label={t('profile.schoolName')}
                  placeholder="SMK Negeri 1 Jakarta"
                  leftIcon={<Building2 size={16} />}
                  error={errors.school_name?.message}
                  {...register('school_name')}
                />
              ) : (
                <Input
                  label={t('profile.companyName')}
                  placeholder="PT. Teknologi Maju"
                  leftIcon={<Building2 size={16} />}
                  error={errors.company_name?.message}
                  {...register('company_name')}
                />
              )}
            </div>

            {/* Industry */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant dark:text-dark-on-surface-variant ml-1">
                {t('profile.industry')}
              </label>
              <div className="flex flex-wrap gap-2">
                {INDUSTRIES.map((industry) => {
                  const isSelected = selectedIndustry === industry;
                  return (
                    <label key={industry} className="cursor-pointer">
                      <input type="radio" value={industry} {...register('industry')} className="sr-only" />
                      <span className={cn(
                        'inline-block px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 spring cursor-pointer',
                        'border',
                        isSelected 
                          ? 'bg-secondary text-white border-secondary shadow-sm shadow-secondary/20' 
                          : 'border-outline-variant dark:border-dark-outline-variant hover:border-secondary hover:text-secondary text-on-surface-variant dark:text-dark-on-surface-variant'
                      )}>
                        {industry}
                      </span>
                    </label>
                  );
                })}
              </div>
              {errors.industry && <p className="text-xs text-error ml-1">{errors.industry.message}</p>}

              <AnimatePresence>
                {selectedIndustry === 'Lainnya' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="overflow-hidden"
                  >
                    <Input
                      label="Sebutkan Industri"
                      placeholder="Contoh: Pertanian, Energi Terbarukan, dll"
                      error={errors.other_industry?.message}
                      {...register('other_industry')}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Textarea
              label={t('profile.bio')}
              placeholder={t('profile.bioPlaceholder')}
              rows={3}
              error={errors.bio?.message}
              {...register('bio')}
            />

            {/* Social links */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant dark:text-dark-on-surface-variant ml-1 mb-3">
                {t('profile.socialMedia')}
              </p>
              <div className="flex flex-col gap-4">
                <Input label="LinkedIn" placeholder="https://linkedin.com/in/..." leftIcon={<Link size={16} />} {...register('linkedin_url')} />
                {isStudent && (
                  <Input label="Instagram" placeholder="https://instagram.com/..." leftIcon={<Link2 size={16} />} {...register('instagram_url')} />
                )}
              </div>
            </div>

            <Button type="submit" loading={mutation.isPending} size="lg" className="w-full mt-2">
              {t('common.save')} & Continue
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
