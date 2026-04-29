/**
 * TanStack Query Key Factory
 * Factory pattern for consistent, hierarchical cache keys.
 * Enables precise invalidation at any level.
 */
export const queryKeys = {
  // ---- Auth ----
  auth: {
    me: () => ['auth', 'me'],
  },

  // ---- Student ----
  student: {
    all: () => ['student'],

    dashboard: () => ['student', 'dashboard'],

    interest: {
      all: () => ['student', 'interest'],
      recommendations: () => ['student', 'interest', 'recommendations'],
    },

    roadmap: () => ['student', 'roadmap'],

    assessment: {
      all: () => ['student', 'assessment'],
      node: (nodeId) => ['student', 'assessment', nodeId],
    },

    jobs: {
      all: () => ['student', 'jobs'],
      list: (filters) => ['student', 'jobs', 'list', filters],
      detail: (id) => ['student', 'jobs', 'detail', id],
      applied: (params) => ['student', 'jobs', 'applied', params],
    },

    portfolio: () => ['student', 'portfolio'],

    streak: () => ['student', 'streak'],

    profile: () => ['student', 'profile'],
  },

  // ---- Professional ----
  professional: {
    all: () => ['professional'],

    dashboard: () => ['professional', 'dashboard'],

    jobs: {
      all: () => ['professional', 'jobs'],
      list: (filters) => ['professional', 'jobs', 'list', filters],
      detail: (id) => ['professional', 'jobs', 'detail', id],
    },

    applicants: {
      all: () => ['professional', 'applicants'],
      list: (jobId, filters) => ['professional', 'applicants', jobId, filters],
      detail: (id) => ['professional', 'applicants', id],
      profile: (id) => ['professional', 'applicants', id, 'profile'],
    },
  },

  // ---- Admin ----
  admin: {
    all: () => ['admin'],

    dashboard: () => ['admin', 'dashboard'],

    users: {
      all: () => ['admin', 'users'],
      list: (filters) => ['admin', 'users', 'list', filters],
      detail: (id) => ['admin', 'users', id],
    },

    jobs: {
      all: () => ['admin', 'jobs'],
      list: (filters) => ['admin', 'jobs', 'list', filters],
      detail: (id) => ['admin', 'jobs', id],
    },
  },
};
