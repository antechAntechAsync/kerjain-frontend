import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Building2, LogOut, ChevronDown, User } from 'lucide-react';
import kerjainLogo from '../../../assets/KerjaIn.png';

export default function HrDashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navLinks = [
    { name: 'Dashboard', path: '/hr', icon: LayoutDashboard },
    { name: 'Jobs', path: '/hr/jobs', icon: Briefcase },
    { name: 'Company', path: '/hr/company', icon: Building2 },
  ];

  const handleLogout = () => {
    localStorage.removeItem('kerjain_token');
    navigate('/auth/login');
  };

  return (
    <div className="flex h-screen bg-customBg">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="flex items-center h-16 px-4 border-b shrink-0">
          <img src={kerjainLogo} alt="KerjaIn Logo" className="h-14 w-auto object-contain" />
        </div>
        <nav className="flex flex-col p-4 space-y-1 flex-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              location.pathname === link.path ||
              (link.path !== '/hr' && location.pathname.startsWith(link.path));
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary/5 text-primary'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TopNav */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 shrink-0 z-10 relative">
          <h1 className="text-xl font-heading font-semibold text-primary">HR Portal</h1>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3 focus:outline-none hover:bg-slate-50 p-1.5 rounded-md transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white">
                HR
              </div>
              <span className="text-sm font-medium font-body text-slate-700 hidden sm:block">
                Jane Doe
              </span>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <>
                {/* Backdrop */}
                <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>

                {/* Menu Panel */}
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-slate-100 py-1 z-20 origin-top-right transition-all duration-200 transform opacity-100 scale-100">
                  <div className="px-4 py-3 border-b border-slate-50">
                    <p className="text-sm font-medium font-body text-primary leading-none">
                      Jane Doe
                    </p>
                    <p className="text-xs text-slate-500 font-body mt-1">HR Manager</p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/hr/company"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors font-body"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Company Profile
                    </Link>
                  </div>
                  <div className="border-t border-slate-50 py-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-body"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-customBg p-6 relative z-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
