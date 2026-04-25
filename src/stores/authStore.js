import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Auth Store (Zustand)
 *
 * Manages authentication state for both regular users (Laravel/Sanctum)
 * and admin users (Express/JWT). Persisted to localStorage.
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // ---- State ----
      user: null,
      token: null,
      isAuthenticated: false,
      isProfileCompleted: false,

      // Admin-specific (separate token for Express API)
      adminUser: null,
      adminToken: null,
      isAdminAuthenticated: false,

      // ---- Actions: Regular Auth ----
      setAuth: ({ user, token, isProfileCompleted = false }) => {
        set({
          user,
          token,
          isAuthenticated: true,
          isProfileCompleted: isProfileCompleted ?? user?.is_profile_completed ?? false,
        });
      },

      setUser: (user) => {
        set({
          user,
          isProfileCompleted: user?.is_profile_completed ?? get().isProfileCompleted,
        });
      },

      setProfileCompleted: (completed) => {
        set({ isProfileCompleted: completed });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isProfileCompleted: false,
        });
      },

      // ---- Actions: Admin Auth ----
      setAdminAuth: ({ user, token }) => {
        set({
          adminUser: user,
          adminToken: token,
          isAdminAuthenticated: true,
        });
      },

      logoutAdmin: () => {
        set({
          adminUser: null,
          adminToken: null,
          isAdminAuthenticated: false,
        });
      },

      // ---- Getters ----
      getRole: () => get().user?.role ?? null,
      isStudent: () => get().user?.role === 'student',
      isProfessional: () => get().user?.role === 'professional',
      isAdmin: () => get().isAdminAuthenticated,
    }),
    {
      name: 'kerjain-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isProfileCompleted: state.isProfileCompleted,
        adminUser: state.adminUser,
        adminToken: state.adminToken,
        isAdminAuthenticated: state.isAdminAuthenticated,
      }),
    },
  ),
);
