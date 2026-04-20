import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import {
  Brain, Map, Briefcase, Flame, Star, ArrowRight,
  GraduationCap, Building2, Users, CheckCircle, ChevronRight,
  Zap, TrendingUp, ShieldCheck,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Toaster } from '@/components/ui/Toast';
import ThemeToggle from '@/components/ui/ThemeToggle';
import LangToggle from '@/components/ui/LangToggle';
import { cn, formatCompactNumber } from '@/lib/utils';

/* ── Animation helpers ──────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (delay = 0) => ({ opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 30, delay } }),
};

function FadeIn({ children, delay = 0, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? fadeUp.show(delay) : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Landing Page ───────────────────────────────────────── */
export default function LandingPage() {
  const { t } = useTranslation();

  return (
    <div className="bg-surface dark:bg-dark-surface text-on-surface dark:text-dark-on-surface overflow-x-hidden">
      <Navbar />

      <HeroSection t={t} />
      <StatsSection t={t} />
      <HowItWorksSection t={t} />
      <ForStudentsSection t={t} />
      <ForProfessionalsSection t={t} />
      <TestimonialsSection t={t} />
      <CTASection t={t} />
      <Footer t={t} />

      <Toaster />
    </div>
  );
}

/* ── Navbar ─────────────────────────────────────────────── */
function Navbar() {
  const { t } = useTranslation();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass ghost-border border-b">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-secondary rounded-xl flex items-center justify-center">
            <Flame size={16} className="text-white" />
          </div>
          <span className="font-heading text-lg font-extrabold text-primary dark:text-dark-primary tracking-tight">
            KerjaIn
          </span>
          <span className="hidden sm:block text-[10px] uppercase tracking-widest font-bold text-on-surface-variant dark:text-dark-on-surface-variant ml-1 pb-px border-b border-secondary/30">
            Vocational Hub
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <a href="#how-it-works" className="text-sm font-semibold text-on-surface-variant dark:text-dark-on-surface-variant hover:text-primary dark:hover:text-dark-primary transition-colors">
            {t('landing.howItWorks')}
          </a>
          <a href="#for-students" className="text-sm font-semibold text-on-surface-variant dark:text-dark-on-surface-variant hover:text-primary dark:hover:text-dark-primary transition-colors">
            {t('landing.forStudents')}
          </a>
          <a href="#for-professionals" className="text-sm font-semibold text-on-surface-variant dark:text-dark-on-surface-variant hover:text-primary dark:hover:text-dark-primary transition-colors">
            {t('landing.forProfessionals')}
          </a>
        </div>

        <div className="flex items-center gap-2">
          <LangToggle />
          <ThemeToggle />
          <Link to="/auth/login">
            <Button variant="ghost" size="sm">{t('auth.login')}</Button>
          </Link>
          <Link to="/auth/register">
            <Button size="sm">{t('auth.register')}</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ── Hero Section ───────────────────────────────────────── */
function HeroSection({ t }) {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[45%] h-full pointer-events-none hidden lg:block">
        <img
          src="/hero-abstract.png"
          alt="Career network visualization"
          className="w-full h-full object-cover opacity-60 dark:opacity-80 mix-blend-luminosity dark:mix-blend-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-surface dark:to-dark-surface" />
      </div>
      <div className="absolute top-1/4 left-[-10%] w-80 h-80 bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-[15%] w-60 h-60 bg-accent/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-fixed text-secondary text-xs font-black uppercase tracking-widest mb-6">
              <Zap size={12} />
              AI-Powered Career Matching
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.08 }}
            className="font-heading text-6xl lg:text-7xl font-extrabold text-primary dark:text-dark-primary tracking-tight leading-[1.05] mb-6"
          >
            {t('landing.heroTitle')}{' '}
            <span className="text-gradient">{t('landing.heroHighlight')}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="text-lg text-on-surface-variant dark:text-dark-on-surface-variant leading-relaxed max-w-xl mb-10"
          >
            {t('landing.heroSubtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.4 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link to="/auth/register">
              <Button size="lg" rightIcon={<ArrowRight size={18} />}>
                {t('landing.heroCtaStudent')}
              </Button>
            </Link>
            <Link to="/auth/register">
              <Button variant="secondary" size="lg">
                {t('landing.heroCtaProfessional')}
              </Button>
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-12 flex items-center gap-5"
          >
            <div className="flex -space-x-3">
              {['#3c83f6', '#20d3ee', '#6366f1', '#f59e0b'].map((bg, i) => (
                <div key={i} className="w-10 h-10 rounded-full ring-2 ring-surface dark:ring-dark-surface flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: bg }}>
                  {['A', 'B', 'C', 'D'][i]}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 mb-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#f59e0b" className="text-warning" />)}
                <span className="text-xs font-bold text-primary dark:text-dark-primary ml-1">4.9/5</span>
              </div>
              <p className="text-xs text-on-surface-variant dark:text-dark-on-surface-variant">
                {t('landing.joinedBy')} <strong className="text-primary dark:text-dark-primary">48,200+</strong> {t('landing.expertsThisMonth')}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ── Stats Section ──────────────────────────────────────── */
const STATS = [
  { value: 48200, label: 'Total Students', suffix: '+', icon: GraduationCap },
  { value: 1204, label: 'Active Jobs', suffix: '', icon: Briefcase },
  { value: 94, label: 'Match Rate', suffix: '%', icon: TrendingUp },
  { value: 284, label: 'Partner Companies', suffix: '+', icon: Building2 },
];

function StatsSection({ t }) {
  return (
    <section className="py-20 bg-surface-container-low dark:bg-dark-surface-container-low">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map(({ value, label, suffix, icon: Icon }, i) => (
            <FadeIn key={label} delay={i * 0.08}>
              <div className="flex flex-col items-center text-center p-6 rounded-sq-xl bg-surface-container-lowest dark:bg-dark-surface-container-high shadow-card">
                <div className="w-12 h-12 rounded-sq-md bg-primary-fixed flex items-center justify-center mb-4">
                  <Icon size={22} className="text-secondary" />
                </div>
                <p className="font-heading text-4xl font-extrabold text-primary dark:text-dark-primary tracking-tight">
                  {formatCompactNumber(value)}{suffix}
                </p>
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant dark:text-dark-on-surface-variant mt-2">
                  {label}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── How It Works ───────────────────────────────────────── */
const STEPS = [
  { step: '01', icon: Brain, titleKey: 'landing.step1Title', descKey: 'landing.step1Desc', color: 'bg-secondary text-white' },
  { step: '02', icon: Map, titleKey: 'landing.step2Title', descKey: 'landing.step2Desc', color: 'bg-accent text-primary' },
  { step: '03', icon: Briefcase, titleKey: 'landing.step3Title', descKey: 'landing.step3Desc', color: 'bg-success text-white' },
];

function HowItWorksSection({ t }) {
  return (
    <section id="how-it-works" className="py-28">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <div className="text-center mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-secondary">— {t('landing.howItWorks')}</span>
            <h2 className="font-heading text-5xl font-extrabold text-primary dark:text-dark-primary tracking-tight mt-3">
              {t('landing.howItWorksSubtitle')}
            </h2>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-16 left-[calc(33%+2rem)] right-[calc(33%+2rem)] h-px bg-outline-variant dark:bg-dark-outline-variant" />

          {STEPS.map(({ step, icon: Icon, titleKey, descKey, color }, i) => (
            <FadeIn key={step} delay={i * 0.12}>
              <div className="flex flex-col items-center text-center">
                <div className={cn('w-16 h-16 rounded-sq-xl flex items-center justify-center mb-6 shadow-ambient relative', color)}>
                  <Icon size={28} />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary-container text-white text-[10px] font-black flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-heading text-xl font-bold text-primary dark:text-dark-primary mb-3">{t(titleKey)}</h3>
                <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant leading-relaxed">{t(descKey)}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── For Students ───────────────────────────────────────── */
function ForStudentsSection({ t }) {
  const features = [
    { icon: Brain, title: 'AI Interest Assessment', desc: 'Answer 10 questions, get a personalized career direction in minutes.' },
    { icon: Map, title: 'Career Roadmap', desc: 'Visual skill tree tailored to your career goal — node by node.' },
    { icon: Flame, title: 'Daily Streak', desc: 'Build consistency. Check in daily and watch your streak grow.' },
    { icon: ShieldCheck, title: 'Skill Verification', desc: 'AI-proctored quizzes that verify — not just claim — your skills.' },
  ];

  return (
    <section id="for-students" className="py-28 bg-surface-container-low dark:bg-dark-surface-container-low">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left content */}
          <div className="lg:col-span-5">
            <FadeIn>
              <span className="text-xs font-black uppercase tracking-widest text-secondary">— {t('landing.forStudents')}</span>
              <h2 className="font-heading text-5xl font-extrabold text-primary dark:text-dark-primary tracking-tight mt-3 mb-6 leading-tight">
                Your Career.<br />Your Path.<br />
                <span className="text-gradient">Your Rules.</span>
              </h2>
              <p className="text-on-surface-variant dark:text-dark-on-surface-variant leading-relaxed mb-8">
                KerjaIn doesn't just list jobs. It builds you a verified skill profile that employers can trust — from vocational school to your first career.
              </p>
              <Link to="/auth/register">
                <Button rightIcon={<ChevronRight size={16} />}>
                  {t('landing.heroCtaStudent')}
                </Button>
              </Link>
            </FadeIn>
          </div>

          {/* Right bento grid */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-4">
              {features.map(({ icon: Icon, title, desc }, i) => (
                <FadeIn key={title} delay={i * 0.08}>
                  <div className={cn(
                    'p-6 rounded-sq-xl transition-all duration-200 spring hover:shadow-ambient',
                    i === 0
                      ? 'bg-primary-container col-span-2'
                      : 'bg-surface-container-lowest dark:bg-dark-surface-container-high shadow-card',
                  )}>
                    <div className={cn(
                      'w-10 h-10 rounded-sq-md flex items-center justify-center mb-4',
                      i === 0 ? 'bg-white/10 text-white' : 'bg-primary-fixed text-secondary',
                    )}>
                      <Icon size={20} />
                    </div>
                    <h3 className={cn(
                      'font-heading text-lg font-bold mb-2',
                      i === 0 ? 'text-white' : 'text-primary dark:text-dark-primary',
                    )}>{title}</h3>
                    <p className={cn(
                      'text-sm leading-relaxed',
                      i === 0 ? 'text-white/70' : 'text-on-surface-variant dark:text-dark-on-surface-variant',
                    )}>{desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── For Professionals ──────────────────────────────────── */
function ForProfessionalsSection({ t }) {
  const features = [
    { icon: Users, title: 'Skill-Matched Candidates', desc: 'Filter applicants by verified skill scores — not just self-reported experience.' },
    { icon: TrendingUp, title: 'Match Analytics', desc: 'See exactly which required skills each candidate covers and where the gaps are.' },
    { icon: CheckCircle, title: 'One-Click Posting', desc: 'Create a job posting in minutes. Tag required skills, set the type, go live.' },
  ];

  return (
    <section id="for-professionals" className="py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: bento tiles */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="grid grid-cols-1 gap-4">
              {features.map(({ icon: Icon, title, desc }, i) => (
                <FadeIn key={title} delay={i * 0.1}>
                  <div className="flex items-start gap-5 p-6 rounded-sq-xl bg-surface-container-lowest dark:bg-dark-surface-container-high shadow-card spring hover:shadow-ambient">
                    <div className="w-12 h-12 flex-shrink-0 rounded-sq-md bg-secondary flex items-center justify-center shadow-sm shadow-secondary/30">
                      <Icon size={22} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-bold text-primary dark:text-dark-primary mb-1">{title}</h3>
                      <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

          {/* Right: content */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <FadeIn>
              <span className="text-xs font-black uppercase tracking-widest text-secondary">— {t('landing.forProfessionals')}</span>
              <h2 className="font-heading text-5xl font-extrabold text-primary dark:text-dark-primary tracking-tight mt-3 mb-6 leading-tight">
                Hire Smarter.<br />
                <span className="text-gradient">Not Harder.</span>
              </h2>
              <p className="text-on-surface-variant dark:text-dark-on-surface-variant leading-relaxed mb-8">
                Stop sorting through hundreds of unqualified applications. KerjaIn surfaces candidates who can actually do the job — verified by AI assessments.
              </p>
              <Link to="/auth/register">
                <Button variant="secondary" rightIcon={<ChevronRight size={16} />}>
                  {t('landing.heroCtaProfessional')}
                </Button>
              </Link>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Testimonials ───────────────────────────────────────── */
const TESTIMONIALS = [
  {
    quote: 'KerjaIn helped me land my first internship straight out of SMK. The AI roadmap told me exactly which skills to build, and companies could see my verified scores.',
    name: 'Rizky Fadillah',
    role: 'Frontend Developer Intern',
    school: 'SMK Negeri 2 Bandung',
    accent: 'bg-secondary text-white',
  },
  {
    quote: 'As an HR, I used to spend 3 hours screening 50 CVs. With KerjaIn\'s match scores, I can shortlist 5 genuinely qualified candidates in under 20 minutes.',
    name: 'Sinta Dewi',
    role: 'HR Manager',
    school: 'PT. TechFlow Solutions',
    accent: 'bg-primary-container text-white',
  },
  {
    quote: 'Fitur roadmap-nya luar biasa! Saya bisa lihat step-by-step skill yang harus dipelajari, dan langsung apply ke lowongan yang cocok ketika sudah lulus asesmen.',
    name: 'Muhammad Fauzi',
    role: 'Siswa Teknik Informatika',
    school: 'SMK Islam 1 Jakarta',
    accent: 'bg-accent text-primary-container',
  },
];

function TestimonialsSection({ t }) {
  return (
    <section className="py-28 bg-surface-container-low dark:bg-dark-surface-container-low">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <div className="text-center mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-secondary">— {t('landing.testimonials')}</span>
            <h2 className="font-heading text-4xl font-extrabold text-primary dark:text-dark-primary tracking-tight mt-3">
              {t('landing.testimonials')}
            </h2>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ quote, name, role, school, accent }, i) => (
            <FadeIn key={name} delay={i * 0.1}>
              <div className="p-6 rounded-sq-xl bg-surface-container-lowest dark:bg-dark-surface-container-high shadow-card flex flex-col h-full">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="#f59e0b" className="text-warning" />)}
                </div>
                <p className="text-sm text-on-surface dark:text-dark-on-surface leading-relaxed flex-1 mb-6">
                  "{quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className={cn('w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0', accent)}>
                    {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-primary dark:text-dark-primary">{name}</p>
                    <p className="text-xs text-on-surface-variant dark:text-dark-on-surface-variant">{role} · {school}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CTA Section ────────────────────────────────────────── */
function CTASection({ t }) {
  return (
    <section className="py-28">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <FadeIn>
          <div className="p-12 rounded-sq-xl bg-primary-container relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-[-30%] left-1/2 -translate-x-1/2 w-96 h-96 bg-secondary/20 rounded-full blur-[80px] pointer-events-none" />
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/80 text-xs font-black uppercase tracking-widest mb-6">
                <Zap size={12} />
                {t('landing.ctaTitle')}
              </span>
              <h2 className="font-heading text-5xl font-extrabold text-white tracking-tight mb-4">
                {t('landing.ctaTitle')}
              </h2>
              <p className="text-white/70 text-lg leading-relaxed mb-10 max-w-lg mx-auto">
                {t('landing.ctaSubtitle')}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/auth/register">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-ambient">
                    {t('landing.heroCtaStudent')}
                  </Button>
                </Link>
                <Link to="/auth/register">
                  <Button variant="secondary" size="lg" className="border-white/20 text-white glass hover:bg-white/10">
                    {t('landing.heroCtaProfessional')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ── Footer ─────────────────────────────────────────────── */
function Footer({ t }) {
  return (
    <footer className="border-t border-outline-variant dark:border-dark-outline-variant py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-secondary rounded-lg flex items-center justify-center">
                <Flame size={14} className="text-white" />
              </div>
              <span className="font-heading font-extrabold text-primary dark:text-dark-primary">KerjaIn</span>
            </div>
            <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant leading-relaxed">
              Bridging vocational talent with Indonesia's growing industry.
            </p>
          </div>

          {[
            { title: 'Platform', links: ['For Students', 'For Professionals', 'Job Marketplace', 'AI Assessment'] },
            { title: 'Company', links: ['About Us', 'Blog', 'Careers', 'Contact'] },
            { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'] },
          ].map(({ title, links }) => (
            <div key={title}>
              <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant dark:text-dark-on-surface-variant mb-4">{title}</p>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant hover:text-primary dark:hover:text-dark-primary transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-outline-variant dark:border-dark-outline-variant">
          <p className="text-xs text-on-surface-variant dark:text-dark-on-surface-variant">
            © 2026 KerjaIn. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <LangToggle />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
