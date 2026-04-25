import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import TagInput from '@/components/ui/TagInput';
import { toast } from '@/components/ui/Toast';
import client from '@/lib/api/client';
import { PROFESSIONAL } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/queryKeys';
import { useState } from 'react';

const schema = z.object({
  title: z.string().min(3, 'Minimal 3 karakter'),
  description: z.string().min(20, 'Deskripsi terlalu pendek'),
  employment_type: z.enum(['internship', 'part_time', 'full_time', 'contract', 'daily_worker']),
  site_type: z.enum(['wfo', 'wfh', 'hybrid']),
  location: z.string().optional(),
});

export default function CreateJobPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [skills, setSkills] = useState([]);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { employment_type: 'internship', site_type: 'wfo' },
  });

  const mutation = useMutation({
    mutationFn: (data) => client.post(PROFESSIONAL.JOBS, { ...data, required_skills: skills }),
    onSuccess: (res) => {
      toast.success('Lowongan berhasil dibuat!');
      qc.invalidateQueries({ queryKey: queryKeys.professional.jobs.all() });
      navigate(`/professional/jobs/${res.data?.id ?? ''}`, { replace: true });
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" leftIcon={<ArrowLeft size={14} />} onClick={() => navigate(-1)} className="-ml-2">
          Kembali
        </Button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <Card.Header>
            <Card.Title>{t('professional.createJob')}</Card.Title>
          </Card.Header>

          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="flex flex-col gap-6">
            <Input
              label={t('professional.jobTitle')}
              placeholder="Frontend Developer Intern"
              error={errors.title?.message}
              {...register('title')}
            />

            <Textarea
              label={t('professional.jobDescription')}
              placeholder="Describe the role, responsibilities, and what makes this opportunity special..."
              rows={6}
              error={errors.description?.message}
              {...register('description')}
            />

            <div className="grid grid-cols-2 gap-4">
              <Select label={t('professional.employmentType')} error={errors.employment_type?.message} {...register('employment_type')}>
                <option value="internship">Internship</option>
                <option value="part_time">Part Time</option>
                <option value="full_time">Full Time</option>
                <option value="contract">Contract</option>
                <option value="daily_worker">Daily Worker</option>
              </Select>

              <Select label={t('professional.siteType')} error={errors.site_type?.message} {...register('site_type')}>
                <option value="wfo">WFO</option>
                <option value="wfh">WFH</option>
                <option value="hybrid">Hybrid</option>
              </Select>
            </div>

            <Input
              label={`${t('professional.location')} (opsional)`}
              placeholder="Jakarta, DKI Jakarta"
              {...register('location')}
            />

            <TagInput
              label={t('professional.requiredSkills')}
              value={skills}
              onChange={setSkills}
              placeholder="Tambah skill (Enter atau koma)..."
              max={15}
            />

            <div className="flex gap-3 pt-2">
              <Button variant="ghost" type="button" onClick={() => navigate(-1)} className="flex-1">
                {t('common.cancel')}
              </Button>
              <Button type="submit" loading={mutation.isPending} className="flex-1">
                Posting Lowongan
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
