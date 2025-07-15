import { createLazyFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Route = createLazyFileRoute('/signin')({
  component: SignIn,
});

function SignIn() {
  const navigate = useNavigate();
  const { signIn, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/book' });
    }
  }, [isAuthenticated, navigate]);

  // Return null if authenticated to prevent rendering
  if (isAuthenticated) {
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return false;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      await signIn({
        email: formData.email,
        password: formData.password,
      });
      
      // Redirect to book page after successful sign in
      navigate({ to: '/book' });
    } catch (err) {
      setError(err.message || 'Sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-dark text-light overflow-y-auto">
      <div className="max-w-screen-xl mx-auto px-4 py-4 md:py-8">
        <div className="max-w-md mx-auto">
          {/* Back Button */}
          <Link
            to="/book"
            className="inline-flex items-center space-x-2 text-yellow hover:text-yellow/80 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Booking</span>
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-light mb-2">Welcome Back</h1>
            <p className="text-light/80">Sign in to your LUX SUV account</p>
          </div>

          {/* Sign In Form */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Message */}
              {error && (
                <div className="bg-red-600/20 text-red-400 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-light mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow transition-colors"
                    placeholder="Enter your email"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-light mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-10 py-3 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow transition-colors"
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-light transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-yellow hover:bg-yellow/90 text-dark font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Sign In</span>
              </button>
            </form>

            {/* Links */}
            <div className="mt-6 text-center space-y-3">
              <p className="text-light/80 text-sm">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="text-yellow hover:text-yellow/80 font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </p>
              
              <div className="border-t border-gray-600 pt-3">
                <Link
                  to="/book"
                  search={{ guest: true }}
                  className="text-gray-400 hover:text-light text-sm transition-colors underline"
                >
                  Continue as Guest
                </Link>
                <p className="text-xs text-gray-500 mt-1">
                  You can book without an account, but you'll need to enter your email to manage bookings later.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}