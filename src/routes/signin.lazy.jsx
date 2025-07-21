import { createLazyFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export const Route = createLazyFileRoute('/signin')({
  component: SignIn,
})

function SignIn() {
  const navigate = useNavigate()
  const { signIn, isLoading } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      console.log('🔐 Attempting sign in with:', { email: formData.email });
      await signIn(formData)
      console.log('✅ Sign in successful, redirecting...');
      navigate({ to: '/' })
    } catch (err) {
      console.error('❌ Sign in failed:', err);
      setError(err.message || 'Failed to sign in. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleForgotPassword = () => {
    navigate({ to: '/forgot-password' })
  }

  if (isLoading) {
    return (
        <div className="h-full bg-dark text-light overflow-y-auto flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin text-yellow" />
            <span className="text-light">Loading...</span>
          </div>
        </div>
    )
  }

  return (
      <div className="h-full bg-dark text-light overflow-y-auto flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-gray-800 rounded-2xl shadow-2xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-light mb-2">Welcome Back</h1>
              <p className="text-light/70">Sign in to your LUX SUV account</p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-900/10 border border-red-700/50 rounded-lg">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
            )}

            {/* Sign In Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-light/80 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-light/80 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      className="w-full pl-10 pr-12 py-3 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow focus:border-transparent transition-colors"
                  />
                  <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                    ) : (
                        <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-yellow hover:text-yellow/80 font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Sign In Button */}
              <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-yellow hover:bg-yellow/90 text-dark font-bold py-3 px-4 rounded-lg border-2 border-yellow shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Signing In...</span>
                    </div>
                ) : (
                    'Sign In'
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-8 text-center space-y-3">
              <p className="text-light/70">
                Don't have an account?{' '}
                <Link
                    to="/signup"
                    className="text-yellow hover:text-yellow/80 font-semibold transition-colors"
                >
                  Sign up here
                </Link>
              </p>
              <p className="text-light/50">
                Or{' '}
                <Link
                    to="/"
                    className="text-yellow hover:text-yellow/80 font-medium transition-colors"
                >
                  continue as guest
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
  )
}