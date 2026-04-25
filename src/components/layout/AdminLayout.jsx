import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Users, Briefcase, LogOut, Shield } from 'lucide-react';
import { Toaster } from '@/components/ui/Toast';
import ThemeToggle from '@/components/ui/ThemeToggle';
import LangToggle from '@/components/ui/LangToggle';
import Avatar from '@/components/ui/Avatar';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';
import client from '@/lib/api/adminClient';
import { ADMIN } from '@/lib/api/endpoints';
import { toast } from '@/components/ui/Toast';

/** Admin layout — dark sidebar matching global_dashboard.html reference */
export default function AdminLayout() {
  const { t } = useTranslation();
  const { adminUser, logoutAdmin } = useAuthStore();
  const navigate = useNavigate();

  const navItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
    { to: '/admin/users', icon: Users, label: t('nav.users') },
    { to: '/admin/jobs', icon: Briefcase, label: t('admin.jobModeration') },
  ];

  const handleLogout = async () => {
    try {
      await client.post(ADMIN.LOGOUT);
    } catch {
      // Ignore logout errors
    } finally {
      logoutAdmin();
      navigate('/admin/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Dark Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-72 flex-col p-6 z-40 bg-slate-900/60 backdrop-blur-xl rounded-r-sq-xl shadow-2xl shadow-slate-950/20">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
            <Shield size={18} className="text-white" />
          </div>
          <div>
            <p className="font-heading text-xl font-extrabold text-slate-100 tracking-tight">KerjaIn</p>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Admin Console</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-1.5">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-4 px-4 py-3 rounded-full font-semibold text-sm transition-all duration-200 tracking-tight',
                  isActive
                    ? 'bg-secondary text-white shadow-lg shadow-secondary/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50',
                )
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="pt-6 space-y-4">
          <div className="flex gap-2">
            <LangToggle className="flex-1 justify-center bg-slate-800 hover:bg-slate-700" />
            <ThemeToggle />
          </div>
          <div className="flex items-center gap-3 px-2">
            <Avatar name={adminUser?.name} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-100 truncate">{adminUser?.name}</p>
              <p className="text-xs text-slate-400 truncate">Global Admin</p>
            </div>
            <button onClick={handleLogout} title={t('nav.logout')} className="text-slate-400 hover:text-error transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 md:ml-72 min-h-screen p-8 lg:p-12">
        <Outlet />
      </main>

      {/* Mobile top bar (admin usually desktop only, but ensure mobile works) */}
      <header className="fixed top-0 left-0 right-0 z-40 md:hidden h-14 bg-slate-900/80 backdrop-blur-xl flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Shield size={18} className="text-secondary" />
          <span className="font-heading font-bold text-slate-100">KerjaIn Admin</span>
        </div>
        <div className="flex gap-2">
          <LangToggle />
          <ThemeToggle />
        </div>
      </header>

      <Toaster />
    </div>
  );
}
