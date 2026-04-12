import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Sparkles, Loader2 } from 'lucide-react';
import { authApi } from '../../../services/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Mock authentication establishing local session token
      if (import.meta.env.VITE_ENABLE_MOCK_AUTH === 'true') {
        setTimeout(() => {
          localStorage.setItem('token', 'mock_token_12345');
          // Mock routing based on email for testing
          navigate(email.includes('hr') ? '/hr' : '/student/portfolio');
        }, 1000);
      } else {
        const response = await authApi.login({ email, password });
        localStorage.setItem('token', response.token);
        
        // Fetch user data to redirect correctly
        const user = await authApi.getMe();
        navigate(user.role === 'professional' ? '/hr' : '/student/portfolio');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-heading font-extrabold text-primary text-center tracking-tight">
            KerjaIn.
          </h1>
          <p className="text-customText/70 font-body mt-2 text-center">
            Sign in to continue your journey.
          </p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-heading text-center">Welcome back</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md font-medium">
                {error}
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label
                  className="text-sm font-medium leading-none text-primary"
                  htmlFor="email"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    className="text-sm font-medium leading-none text-primary"
                    htmlFor="password"
                  >
                    Password
                  </label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full py-6 mt-4" disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
              </Button>

              <div className="text-center mt-4 text-sm text-customText/70 font-body">
                Don't have an account? <Link to="/auth/register" className="text-secondary font-bold hover:underline">Create one</Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-customText/40 mt-8 font-body">
          &copy; {new Date().getFullYear()} KerjaIn. The Kinetic Atelier.
        </p>
      </div>
    </div>
  );
}
