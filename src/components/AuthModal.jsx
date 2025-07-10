import { useState } from 'react';
import { X, Eye, EyeOff, User, Mail, Phone, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AuthModal = ({ isOpen, onClose, initialMode = 'signin', showGuestOption = false, onContinueAsGuest }) => {
  const [mode, setMode] = useState(initialMode); // 'signin' or 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const { signIn, signUp } = useAuth();

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    });
    setError('');
    setShowPassword(false);
  };

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleContinueAsGuest = () => {
    if (onContinueAsGuest) {
      onContinueAsGuest();
    }
    handleClose();
  };

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

    if (mode === 'signup') {
      if (!formData.name.trim()) {
        setError('Name is required');
        return false;
      }

      if (!formData.phone.trim()) {
        setError('Phone number is required');
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      if (mode === 'signin') {
        await signIn({
          email: formData.email,
          password: formData.password,
        });
      } else {
        await signUp({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        });
      }
      
      handleClose();
    } catch (err) {
      setError(err.message || `${mode === 'signin' ? 'Sign in' : 'Sign up'} failed`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-md border border-gray-600">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-600">
          <h2 className="text-xl font-semibold text-light">
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-light transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-600/20 text-red-400 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Name Field (Sign Up Only) */}
          {mode === 'signup' && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-light mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow transition-colors"
                  placeholder="Enter your full name"
                  disabled={isLoading}
                />
              </div>
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
                className="w-full pl-10 pr-4 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow transition-colors"
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Phone Field (Sign Up Only) */}
          {mode === 'signup' && (
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-light mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow transition-colors"
                  placeholder="Enter your phone number"
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

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
                className="w-full pl-10 pr-10 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow transition-colors"
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

          {/* Confirm Password Field (Sign Up Only) */}
          {mode === 'signup' && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-light mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow transition-colors"
                  placeholder="Confirm your password"
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-yellow hover:bg-yellow/90 text-dark font-semibold py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
          </button>

          {/* Mode Switch */}
          <div className="text-center pt-4 border-t border-gray-600">
            <p className="text-light/80 text-sm">
              {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
              <button
                type="button"
                onClick={() => handleModeSwitch(mode === 'signin' ? 'signup' : 'signin')}
                className="text-yellow hover:text-yellow/80 ml-1 font-medium transition-colors"
                disabled={isLoading}
              >
                {mode === 'signin' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
            
            {/* Continue as Guest Option */}
            {showGuestOption && (
              <div className="mt-4 pt-4 border-t border-gray-600">
                <button
                  type="button"
                  onClick={handleContinueAsGuest}
                  className="text-gray-400 hover:text-light text-sm transition-colors underline"
                  disabled={isLoading}
                >
                  Continue as Guest
                </button>
                <p className="text-xs text-gray-500 mt-1">
                  You can book without an account, but you'll need to enter your email to manage bookings later.
                </p>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;