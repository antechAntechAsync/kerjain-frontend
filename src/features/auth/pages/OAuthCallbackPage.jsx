import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { toast } from '@/components/ui/Toast';
import client from '@/lib/api/client';
import { AUTH } from '@/lib/api/endpoints';

/**
 * OAuthCallbackPage — handles Google OAuth redirect.
 * Laravel redirects to: /auth/callback?token=xxx&is_profile_completed=0
 */
export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get('token');
    const isProfileCompleted = searchParams.get('is_profile_completed') === '1';

    if (!token) {
      toast.error('Authentication failed. Please try again.');
      navigate('/auth/login', { replace: true });
      return;
    }

    // Temporarily store token then fetch user
    const fetchUser = async () => {
      try {
        // Manually set token in store so client interceptor picks it up
        useAuthStore.setState({ token });
        const res = await client.get(AUTH.ME);
        setAuth({ user: res.data, token, isProfileCompleted });

        if (!isProfileCompleted) {
          navigate('/complete-profile', { replace: true });
        } else {
          const role = res.data?.role;
          navigate(role === 'student' ? '/student/dashboard' : '/professional/dashboard', { replace: true });
        }
      } catch {
        toast.error('Failed to authenticate. Please try again.');
        navigate('/auth/login', { replace: true });
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5 bg-surface dark:bg-dark-surface">
      <div className="w-10 h-10 rounded-xl bg-secondary animate-pulse" />
      <p className="text-sm font-semibold text-on-surface-variant dark:text-dark-on-surface-variant">
        Signing you in...
      </p>
    </div>
  );
}
