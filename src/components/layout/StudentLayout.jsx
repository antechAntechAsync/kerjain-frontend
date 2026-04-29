import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Briefcase, Map, FolderKanban, User, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { Toaster } from '@/components/ui/Toast';
import ThemeToggle from '@/components/ui/ThemeToggle';
import LangToggle from '@/components/ui/LangToggle';
import Avatar from '@/components/ui/Avatar';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';

/** Student layout — mobile-first with floating bottom nav + top bar */
export default function StudentLayout() {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  const navItems = [
    { to: '/student/dashboard', icon: Home, label: t('nav.home') },
    { to: '/student/jobs', icon: Briefcase, label: t('nav.jobs') },
    { to: '/student/roadmap', icon: Map, label: t('nav.roadmap') },
    { to: '/student/portfolio', icon: FolderKanban, label: t('nav.portfolio') },
    { to: '/student/profile', icon: User, label: t('nav.profile') },
  ];

  return (
    <div className="min-h-screen bg-surface dark:bg-dark-surface">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 glass ghost-border border-b">
        <div className="max-w-screen-lg mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-secondary rounded-xl flex items-center justify-center">
              <Flame size={16} className="text-white" />
            </div>
            <span className="font-heading text-lg font-extrabold text-primary dark:text-dark-primary tracking-tight">
              KerjaIn
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <LangToggle />
            <ThemeToggle />
            <NavLink to="/student/profile">
              <Avatar src={user?.avatar} name={user?.name} size="sm" />
            </NavLink>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-screen-lg mx-auto px-4 py-6 pb-28 md:pb-8">
        <Outlet />
      </main>

      {/* Bottom Nav (mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 p-3 md:hidden">
        <motion.div
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="glass ghost-border rounded-full px-2 py-2 flex justify-around items-center shadow-ambient"
        >
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-full transition-all duration-200',
                  isActive
                    ? 'bg-secondary text-white shadow-sm shadow-secondary/30'
                    : 'text-on-surface-variant dark:text-dark-on-surface-variant',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={isActive ? 20 : 18} />
                  <span className="text-[10px] font-bold">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </motion.div>
      </nav>

      {/* Desktop Sidebar Nav */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-20 flex-col items-center py-8 gap-6 glass ghost-border border-r z-40">
        <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center mb-4">
          <Flame size={18} className="text-white" />
        </div>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            title={label}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 p-3 rounded-sq-md transition-all duration-200 spring',
                isActive
                  ? 'bg-secondary text-white'
                  : 'text-on-surface-variant dark:text-dark-on-surface-variant hover:bg-surface-container-low dark:hover:bg-dark-surface-container',
              )
            }
          >
            <Icon size={20} />
            <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
          </NavLink>
        ))}
      </nav>

      <Toaster />
    </div>
  );
}
