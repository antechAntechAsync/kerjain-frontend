/**
 * API Endpoint Constants
 * Matches backend API_SPECS.md exactly.
 */

// ============================================================
// Laravel API (Student + Professional)
// ============================================================
export const AUTH = {
  REGISTER: '/register',
  LOGIN: '/login',
  LOGOUT: '/logout',
  ME: '/me',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  CHANGE_PASSWORD: '/change-password',
  GOOGLE: '/auth/google',
  GOOGLE_CALLBACK: '/auth/google/callback',
};

export const PROFILE = {
  ME: '/profile',
  COMPLETE: '/complete-profile',
  UPDATE_STUDENT: '/profile/student',
  UPDATE_PROFESSIONAL: '/profile/professional',
  UPLOAD_AVATAR: '/profile/avatar',
};

export const STUDENT = {
  DASHBOARD: '/student/dashboard',

  // Interest Assessment
  INTEREST_START: '/student/interest/start',
  INTEREST_ANSWER: '/student/interest/answer',
  CAREER_RECOMMENDATIONS: '/student/career-recommendations',

  // Roadmap
  GENERATE_ROADMAP: '/student/roadmap/generate',
  ROADMAP: '/student/roadmap',

  // Self Assessment (per-node)
  ASSESSMENT_NODE: (nodeId) => `/student/assessment/${nodeId}`,
  ASSESSMENT_START: (nodeId) => `/student/assessment/${nodeId}/start`,
  ASSESSMENT_ANSWER: (nodeId) => `/student/assessment/${nodeId}/answer`,
  ASSESSMENT_HISTORY: '/student/assessment/history',

  // Progress
  PROGRESS: '/student/progress',
  PROGRESS_NODE: (nodeId) => `/student/progress/${nodeId}`,

  // Jobs
  JOBS: '/student/jobs',
  APPLIED_JOBS: '/student/jobs/applied',
  JOB_DETAIL: (id) => `/student/jobs/${id}`,
  APPLY_JOB: (id) => `/student/jobs/${id}/apply`,

  // Portfolio
  PORTFOLIO: '/student/portfolio',
  PORTFOLIO_ITEM: (id) => `/student/portfolio/${id}`,
  PORTFOLIO_TOGGLE: (id) => `/student/portfolio/${id}/toggle`,

  // Streak / Check-in
  STREAK: '/student/streak',
  CHECKIN: '/student/streak/checkin',
  STREAK_HISTORY: '/student/streak/history',
};

export const PROFESSIONAL = {
  DASHBOARD: '/professional/dashboard',

  // Jobs
  JOBS: '/professional/jobs',
  JOB_DETAIL: (id) => `/professional/jobs/${id}`,
  JOB_STATUS: (id) => `/professional/jobs/${id}/status`,
  JOB_APPLICANTS: (id) => `/professional/jobs/${id}/applicants`,

  // Applicants
  APPLICANTS: '/professional/applicants',
  APPLICANT_DETAIL: (id) => `/professional/applicants/${id}`,
  APPLICANT_PROFILE: (id) => `/professional/applicants/${id}/profile`,
};

// ============================================================
// Express Admin API
// ============================================================
export const ADMIN = {
  LOGIN: '/login',
  REGISTER: '/register',
  LOGOUT: '/logout',
  ME: '/me',
  DASHBOARD: '/dashboard',

  USERS: '/users',
  USER_DETAIL: (id) => `/users/${id}`,

  JOBS: '/jobs',
  JOB_DETAIL: (id) => `/jobs/${id}`,
  JOB_STATUS: (id) => `/jobs/${id}/status`,
};
