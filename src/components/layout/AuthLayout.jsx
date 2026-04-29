import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThemeToggle from '@/components/ui/ThemeToggle';
import LangToggle from '@/components/ui/LangToggle';
import { Toaster } from '@/components/ui/Toast';

/**
 * AuthLayout — split layout matching auth_suite.html reference.
 * Left: branding + editorial content (7/12 cols)
 * Right: auth form card (5/12 cols)
 */
export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-surface dark:bg-dark-surface flex items-center justify-center relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Controls on top */}
      <div className="absolute top-5 right-5 z-10 flex gap-2">
        <LangToggle />
        <ThemeToggle />
      </div>

      <main className="w-full max-w-6xl px-6 py-12 relative z-10">
        {/* The auth form content — expects a grid from its children */}
        {children ?? <Outlet />}
      </main>

      <Toaster />
    </div>
  );
}
