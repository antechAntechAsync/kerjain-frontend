import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Mail, Phone } from 'lucide-react';

import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import { ProgressBar, MatchScoreBadge } from '@/components/ui/Progress';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { toast } from '@/components/ui/Toast';
import client from '@/lib/api/client';
import { PROFESSIONAL } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/queryKeys';
import { formatDate } from '@/lib/utils';

export default function ApplicantProfilePage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: applicant, isLoading } = useQuery({
    queryKey: queryKeys.professional.applicants.profile(id),
    queryFn: () => client.get(PROFESSIONAL.APPLICANT_PROFILE(id)),
    select: (r) => r.data,
  });

  if (isLoading) {
    return <div className="space-y-4 max-w-3xl mx-auto"><Skeleton.Card /><Skeleton.Card /></div>;
  }

  const student = applicant?.student;
  const profile = student?.student_profile;
  const scores = applicant?.skill_scores ?? [];
  const portfolio = applicant?.portfolio ?? [];
  const matchScore = applicant?.match_score ?? 0;

  return (
    <div className="max-w-3xl mx-auto">
      <Button variant="ghost" size="sm" leftIcon={<ArrowLeft size={14} />} onClick={() => navigate(-1)} className="mb-5 -ml-2">
        Kembali
      </Button>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
        {/* Header */}
        <Card className="p-7">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex items-start gap-5 flex-1">
              <Avatar src={student?.avatar} name={student?.name} size="xl" ring="surface" ringSize={4} />
              <div>
                <h1 className="font-heading text-2xl font-extrabold text-primary dark:text-dark-primary tracking-tight">{student?.name}</h1>
                <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant">{profile?.school_name}</p>
                {profile?.bio && (
                  <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant mt-2 max-w-lg leading-relaxed">{profile.bio}</p>
                )}
                {/* Contact */}
                <div className="flex flex-wrap gap-3 mt-3">
                  {student?.email && (
                    <a href={`mailto:${student.email}`} className="flex items-center gap-1.5 text-xs text-secondary hover:underline font-semibold">
                      <Mail size={13} /> {student.email}
                    </a>
                  )}
                  {profile?.phone_number && (
                    <a href={`tel:${profile.phone_number}`} className="flex items-center gap-1.5 text-xs text-secondary hover:underline font-semibold">
                      <Phone size={13} /> {profile.phone_number}
                    </a>
                  )}
                  {profile?.linkedin_url && (
                    <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-secondary hover:underline font-semibold">
                      <ExternalLink size={13} /> LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>
            <MatchScoreBadge score={matchScore} size="lg" className="flex-shrink-0 self-start" />
          </div>
        </Card>

        {/* Skill Scores */}
        {scores.length > 0 && (
          <Card>
            <Card.Header><Card.Title>Skill & Skor Asesmen</Card.Title></Card.Header>
            <div className="space-y-3">
              {scores.map((skill) => (
                <ProgressBar
                  key={skill.name}
                  label={skill.name}
                  value={skill.score ?? 0}
                  max={100}
                  showValue
                  size="md"
                  color={skill.score >= 70 ? 'success' : skill.score >= 40 ? 'secondary' : 'warning'}
                />
              ))}
            </div>
          </Card>
        )}

        {/* Roadmap Progress */}
        {applicant?.roadmap && (
          <Card>
            <Card.Header>
              <Card.Title>{t('professional.roadmapProgress')}</Card.Title>
              <Badge variant="info">{applicant.roadmap.career_role_name}</Badge>
            </Card.Header>
            <ProgressBar
              value={applicant.roadmap.completed_nodes}
              max={applicant.roadmap.total_nodes || 1}
              showValue
              size="lg"
              label={`${applicant.roadmap.completed_nodes} / ${applicant.roadmap.total_nodes} skills`}
            />
          </Card>
        )}

        {/* Portfolio */}
        {portfolio.length > 0 && (
          <Card>
            <Card.Header><Card.Title>Portofolio</Card.Title></Card.Header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {portfolio.map((p) => (
                <div key={p.id} className="p-4 rounded-sq-md bg-surface-container-low dark:bg-dark-surface-container">
                  <p className="font-bold text-sm text-primary dark:text-dark-primary mb-1">{p.title}</p>
                  {p.description && (
                    <p className="text-xs text-on-surface-variant dark:text-dark-on-surface-variant line-clamp-2 mb-2">{p.description}</p>
                  )}
                  {p.url && (
                    <a href={p.url} target="_blank" rel="noreferrer" className="text-xs text-secondary flex items-center gap-1 hover:underline font-semibold">
                      <ExternalLink size={11} /> Lihat Proyek
                    </a>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
