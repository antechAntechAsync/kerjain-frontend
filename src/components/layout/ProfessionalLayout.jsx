import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Briefcase, Users, User, Zap } from 'lucide-react';
import { Toaster } from '@/components/ui/Toast';
import ThemeToggle from '@/components/ui/ThemeToggle';
import LangToggle from '@/components/ui/LangToggle';
import Avatar from '@/components/ui/Avatar';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';

/** Professional layout — desktop sidebar + mobile bottom nav */
export default function ProfessionalLayout() {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  const navItems = [
    { to: '/professional/dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
    { to: '/professional/jobs', icon: Briefcase, label: t('professional.myJobs') },
    { to: '/professional/applicants', icon: Users, label: t('nav.applicants') },
    { to: '/professional/profile', icon: User, label: t('nav.profile') },
  ];

  return (
    <div className="min-h-screen bg-surface dark:bg-dark-surface flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col p-6 z-40 glass ghost-border border-r">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <p className="font-heading text-base font-extrabold text-primary dark:text-dark-primary tracking-tight">KerjaIn</p>
            <p className="text-[9px] uppercase tracking-widest text-on-surface-variant dark:text-dark-on-surface-variant font-bold">
              Professional
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-200 font-semibold text-sm spring',
                  isActive
                    ? 'bg-secondary text-white shadow-sm shadow-secondary/30'
                    : 'text-on-surface-variant dark:text-dark-on-surface-variant hover:bg-surface-container-low dark:hover:bg-dark-surface-container hover:text-primary dark:hover:text-dark-primary',
                )
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="flex flex-col gap-4 pt-4 border-t border-outline-variant dark:border-dark-outline-variant">
          <div className="flex gap-2">
            <LangToggle />
            <ThemeToggle />
          </div>
          <div className="flex items-center gap-3">
            <Avatar src={user?.avatar} name={user?.name} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-primary dark:text-dark-primary truncate">{user?.name}</p>
              <p className="text-xs text-on-surface-variant dark:text-dark-on-surface-variant truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 md:ml-64 min-h-screen p-6 lg:p-10 pb-28 md:pb-10">
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 p-3 md:hidden">
        <div className="glass ghost-border rounded-full px-2 py-2 flex justify-around items-center shadow-ambient">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-0.5 px-3 py-2 rounded-full transition-all duration-200',
                  isActive ? 'bg-secondary text-white' : 'text-on-surface-variant dark:text-dark-on-surface-variant',
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
        </div>
      </nav>

      <Toaster />
    </div>
  );
}
