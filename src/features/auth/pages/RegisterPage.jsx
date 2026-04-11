import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Sparkles, Loader2 } from 'lucide-react';
import { authApi } from '../../../services/api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'student'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Mock API call if server is not ready, else use real API
      if (import.meta.env.VITE_ENABLE_MOCK_AUTH === 'true') {
        setTimeout(() => {
          localStorage.setItem('token', 'mock_token_register_123');
          navigate(formData.role === 'professional' ? '/hr' : '/student/portfolio');
        }, 1000);
      } else {
        const response = await authApi.register(formData);
        localStorage.setItem('token', response.token);
        navigate(formData.role === 'professional' ? '/hr' : '/student/portfolio');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-heading font-extrabold text-primary text-center tracking-tight">
            Join KerjaIn.
          </h1>
          <p className="text-customText/70 font-body mt-2 text-center">
            Create your account to start your journey.
          </p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-heading text-center">Create an account</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md font-medium">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none text-primary" htmlFor="name">
                  Full Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none text-primary" htmlFor="email">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none text-primary" htmlFor="password">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none text-primary" htmlFor="password_confirmation">
                    Confirm
                  </label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    required
                    value={formData.password_confirmation}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none text-primary" htmlFor="role">
                  I want to...
                </label>
                <Select id="role" value={formData.role} onChange={handleChange} required>
                  <option value="student">Build my portfolio (Student)</option>
                  <option value="professional">Hire talent (Professional/HR)</option>
                </Select>
              </div>

              <Button type="submit" className="w-full py-6 mt-4" disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
              </Button>
              
              <div className="text-center mt-4 text-sm text-customText/70 font-body">
                Already have an account? <Link to="/auth/login" className="text-secondary font-bold hover:underline">Sign in</Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
