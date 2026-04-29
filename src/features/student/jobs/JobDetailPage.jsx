import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, Clock, Users, ArrowLeft, SendHorizontal, CheckCircle } from 'lucide-react';

import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { MatchScoreBadge, ProgressBar } from '@/components/ui/Progress';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import Avatar from '@/components/ui/Avatar';
import { toast } from '@/components/ui/Toast';
import client from '@/lib/api/client';
import { STUDENT } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/queryKeys';
import { employmentTypeLabels, siteTypeLabels } from '@/lib/utils';

/* ── Hooks ────────────────────────────────────────────── */
function useJobDetail(id) {
  return useQuery({
    queryKey: queryKeys.student.jobs.detail(id),
    queryFn: () => client.get(STUDENT.JOB_DETAIL(id)),
    select: (r) => r.data,
  });
}

/* ── Page ─────────────────────────────────────────────── */
export default function JobDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: job, isLoading } = useJobDetail(id);

  const applyMutation = useMutation({
    mutationFn: () => client.post(STUDENT.APPLY_JOB(id)),
    onSuccess: () => {
      toast.success(t('student.applySuccess'));
      qc.invalidateQueries({ queryKey: queryKeys.student.jobs.detail(id) });
    },
    onError: (err) => toast.error(err.message),
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <Skeleton className="h-10 w-64 rounded-sq-sm" />
        <Skeleton.Card />
        <Skeleton.Card />
      </div>
    );
  }

  if (!job) return null;

  const hasApplied = job.has_applied;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back */}
      <Button variant="ghost" size="sm" leftIcon={<ArrowLeft size={14} />} onClick={() => navigate(-1)} className="mb-5 -ml-2">
        Kembali
      </Button>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header card */}
        <Card className="mb-5 p-8">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="w-16 h-16 rounded-sq-xl bg-primary-fixed flex items-center justify-center font-black text-secondary text-2xl flex-shrink-0">
              {job.company_name?.[0] ?? '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-on-surface-variant dark:text-dark-on-surface-variant mb-1">{job.company_name}</p>
              <h1 className="font-heading text-3xl font-extrabold text-primary dark:text-dark-primary tracking-tight mb-3">{job.title}</h1>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Briefcase size={10} />{employmentTypeLabels[job.employment_type] ?? job.employment_type}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin size={10} />{siteTypeLabels[job.site_type] ?? job.site_type}
                </Badge>
                {job.location && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <MapPin size={10} />{job.location}
                  </Badge>
                )}
                <Badge variant="outline" className="flex items-center gap-1">
                  <Users size={10} />{job.total_applicants ?? 0} pelamar
                </Badge>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              {job.match_score != null && <MatchScoreBadge score={job.match_score} size="lg" />}
              <Button
                onClick={() => applyMutation.mutate()}
                loading={applyMutation.isPending}
                disabled={hasApplied}
                leftIcon={hasApplied ? <CheckCircle size={16} /> : <SendHorizontal size={16} />}
                variant={hasApplied ? 'ghost' : 'primary'}
              >
                {hasApplied ? t('student.alreadyApplied') : t('student.applyJob')}
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main: description */}
          <div className="lg:col-span-2 space-y-5">
            <Card>
              <Card.Header><Card.Title>Deskripsi Pekerjaan</Card.Title></Card.Header>
              <div className="prose prose-sm text-on-surface dark:text-dark-on-surface max-w-none">
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-on-surface-variant dark:text-dark-on-surface-variant">
                  {job.description}
                </p>
              </div>
            </Card>
          </div>

          {/* Sidebar: skills */}
          <div className="space-y-5">
            <Card>
              <Card.Header><Card.Title>{t('student.skillsRequired')}</Card.Title></Card.Header>
              <div className="space-y-3">
                {(job.required_skills_with_scores ?? job.required_skills ?? []).map((skill) => {
                  const name = typeof skill === 'string' ? skill : skill.name;
                  const score = typeof skill === 'object' ? skill.user_score : null;
                  return (
                    <div key={name}>
                      {score != null ? (
                        <ProgressBar label={name} value={score} max={100} showValue size="sm" color={score >= 70 ? 'success' : 'warning'} />
                      ) : (
                        <span className="inline-block px-3 py-1.5 rounded-full bg-primary-fixed text-secondary text-[11px] font-bold">{name}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Skill gaps */}
            {job.unmatched_skills?.length > 0 && (
              <Card>
                <Card.Header><Card.Title>{t('student.unmatchedSkills')}</Card.Title></Card.Header>
                <div className="flex flex-wrap gap-2">
                  {job.unmatched_skills.map((skill) => (
                    <Badge key={skill} variant="warning">{skill}</Badge>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
