import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

import ProtectedRoute from '@/components/layout/ProtectedRoute';
import StudentLayout from '@/components/layout/StudentLayout';
import ProfessionalLayout from '@/components/layout/ProfessionalLayout';
import AdminLayout from '@/components/layout/AdminLayout';
import AuthLayout from '@/components/layout/AuthLayout';
import Skeleton from '@/components/ui/Skeleton';
import { Toaster } from '@/components/ui/Toast';

/* ── Page imports ──────────────────────────────────── */
// Auth
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/features/auth/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/features/auth/pages/ResetPasswordPage'));
const OAuthCallbackPage = lazy(() => import('@/features/auth/pages/OAuthCallbackPage'));
const CompleteProfilePage = lazy(() => import('@/features/auth/pages/CompleteProfilePage'));

// Landing
const LandingPage = lazy(() => import('@/features/landing/LandingPage'));

// Student
const StudentDashboard = lazy(() => import('@/features/student/dashboard/StudentDashboard'));
const InterestAssessmentPage = lazy(() => import('@/features/student/interest/InterestAssessmentPage'));
const RoadmapPage = lazy(() => import('@/features/student/roadmap/RoadmapPage'));
const AssessmentPage = lazy(() => import('@/features/student/assessment/AssessmentPage'));
const JobListPage = lazy(() => import('@/features/student/jobs/JobListPage'));
const JobDetailPage = lazy(() => import('@/features/student/jobs/JobDetailPage'));
const AppliedJobsPage = lazy(() => import('@/features/student/jobs/AppliedJobsPage'));
const PortfolioPage = lazy(() => import('@/features/student/portfolio/PortfolioPage'));
const StreakPage = lazy(() => import('@/features/student/streak/StreakPage'));
const StudentProfilePage = lazy(() => import('@/features/student/profile/ProfilePage'));

// Professional
const ProfessionalDashboard = lazy(() => import('@/features/professional/dashboard/ProfessionalDashboard'));
const ProJobListPage = lazy(() => import('@/features/professional/jobs/JobListPage'));
const ProJobDetailPage = lazy(() => import('@/features/professional/jobs/JobDetailPage'));
const CreateJobPage = lazy(() => import('@/features/professional/jobs/CreateJobPage'));
const ApplicantProfilePage = lazy(() => import('@/features/professional/applicants/ApplicantProfilePage'));

// Admin
const AdminLoginPage = lazy(() => import('@/features/admin/auth/AdminLoginPage'));
const AdminDashboard = lazy(() => import('@/features/admin/dashboard/AdminDashboard'));
const UserListPage = lazy(() => import('@/features/admin/users/UserListPage'));
const AdminJobListPage = lazy(() => import('@/features/admin/jobs/AdminJobListPage'));

/* ── Suspense wrapper ──────────────────────────────── */
const Loader = () => (
  <div className="p-8 space-y-4 animate-pulse">
    <div className="h-10 w-64 bg-surface-container-high dark:bg-dark-surface-container-high rounded-sq-sm" />
    <div className="grid grid-cols-3 gap-5">
      {[1, 2, 3].map((i) => <div key={i} className="h-40 bg-surface-container-high dark:bg-dark-surface-container-high rounded-sq-xl" />)}
    </div>
  </div>
);

const S = (Component) => (
  <Suspense fallback={<Loader />}>
    <Component />
  </Suspense>
);

/* ── Router ────────────────────────────────────────── */
const router = createBrowserRouter([
  /* ── Public ── */
  { path: '/', element: S(LandingPage) },
  { path: '/auth/callback', element: S(OAuthCallbackPage) },

  /* ── Auth pages (AuthLayout) ── */
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: S(LoginPage) },
      { path: 'register', element: S(RegisterPage) },
      { path: 'forgot-password', element: S(ForgotPasswordPage) },
      { path: 'reset-password', element: S(ResetPasswordPage) },
    ],
  },

  /* ── Complete profile (public but guarded) ── */
  {
    path: '/complete-profile',
    element: (
      <ProtectedRoute requireAuth>
        {S(CompleteProfilePage)}
      </ProtectedRoute>
    ),
  },

  /* ── Student ── */
  {
    path: '/student',
    element: (
      <ProtectedRoute requireAuth requireRole="student" requireProfile>
        <StudentLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: S(StudentDashboard) },
      { path: 'interest', element: S(InterestAssessmentPage) },
      { path: 'roadmap', element: S(RoadmapPage) },
      { path: 'assessment/:nodeId', element: S(AssessmentPage) },
      { path: 'jobs', element: S(JobListPage) },
      { path: 'jobs/applied', element: S(AppliedJobsPage) },
      { path: 'jobs/:id', element: S(JobDetailPage) },
      { path: 'portfolio', element: S(PortfolioPage) },
      { path: 'streak', element: S(StreakPage) },
      { path: 'profile', element: S(StudentProfilePage) },
    ],
  },

  /* ── Professional ── */
  {
    path: '/professional',
    element: (
      <ProtectedRoute requireAuth requireRole="professional" requireProfile>
        <ProfessionalLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: S(ProfessionalDashboard) },
      { path: 'jobs', element: S(ProJobListPage) },
      { path: 'jobs/create', element: S(CreateJobPage) },
      { path: 'jobs/:id', element: S(ProJobDetailPage) },
      { path: 'applicants/:id/profile', element: S(ApplicantProfilePage) },
      { path: 'profile', element: S(StudentProfilePage) }, // re-use profile page
    ],
  },

  /* ── Admin Auth (standalone, no admin layout) ── */
  { path: '/admin/login', element: S(AdminLoginPage) },

  /* ── Admin ── */
  {
    path: '/admin',
    element: (
      <ProtectedRoute requireAuth requireRole="admin">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: S(AdminDashboard) },
      { path: 'users', element: S(UserListPage) },
      { path: 'jobs', element: S(AdminJobListPage) },
    ],
  },

  /* ── Catch-all ── */
  { path: '*', element: <Navigate to="/" replace /> },
]);

export default function AppRouter() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}
