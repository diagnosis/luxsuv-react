import { createLazyFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, Loader2, ArrowLeft, CheckCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { authApi } from '../api/authApi'

export const Route = createLazyFileRoute('/signin')({
  component: SignIn,
})

function SignIn() {
  const navigate = useNavigate()
  const { signIn, isLoading } = useAuth()
  const [currentView, setCurrentView] = useState('signin') // 'signin', 'forgot', 'reset-sent'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [forgotEmail, setForgotEmail] = useState('')
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
      await signIn(formData)
      navigate({ to: '/' })
    } catch (err) {
      setError(err.message || 'Sign in failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await authApi.forgotPassword(forgotEmail)
      setCurrentView('reset-sent')
    } catch (err) {
      setError(err.message || 'Failed to send reset email')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetToSignIn = () => {
    setCurrentView('signin')
    setError('')
    setForgotEmail('')
  }

  if (isLoading) {
    return (
      <div className="w-full h-full bg-dark text-light flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-yellow animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-dark text-light overflow-y-auto">
      <div className="max-w-screen-xl mx-auto px-4 py-4 md:py-8 flex items-center justify-center min-h-full">
        <div className="w-full max-w-md">
          {/* Sign In View */}
          {currentView === 'signin' && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-light mb-2 md:text-4xl">
                  Welcome Back
                </h1>
                <p className="text-light/80">
                  Sign in to your LUX SUV account
                </p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-600/20 text-red-400 p-3 rounded-lg text-sm border border-red-400/30">
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
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow transition-colors"
                        placeholder="Enter your email"
                        disabled={isSubmitting}
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
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-10 pr-10 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow transition-colors"
                        placeholder="Enter your password"
                        disabled={isSubmitting}
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

                  {/* Forgot Password Link */}
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => setCurrentView('forgot')}
                      className="text-yellow hover:text-yellow/80 text-sm transition-colors"
                    >
                      Forgot your password?
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-yellow hover:bg-yellow/90 text-dark font-semibold py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
                  </button>
                </form>

                {/* Sign Up Link */}
                <div className="text-center mt-6 pt-6 border-t border-gray-600">
                  <p className="text-light/80 text-sm">
                    Don't have an account?{' '}
                    <Link
                      to="/signup"
                      className="text-yellow hover:text-yellow/80 font-medium transition-colors"
                    >
                      Create Account
                    </Link>
                  </p>
                </div>

                {/* Guest Booking Option */}
                <div className="text-center mt-4">
                  <Link
                    to="/book"
                    search={{ guest: true }}
                    className="text-gray-400 hover:text-light text-sm transition-colors underline"
                  >
                    Continue as Guest
                  </Link>
                </div>
              </div>
            </>
          )}

          {/* Forgot Password View */}
          {currentView === 'forgot' && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-light mb-2 md:text-4xl">
                  Reset Password
                </h1>
                <p className="text-light/80">
                  Enter your email address and we'll send you a reset link
                </p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-600/20 text-red-400 p-3 rounded-lg text-sm border border-red-400/30">
                      {error}
                    </div>
                  )}

                  {/* Email Field */}
                  <div>
                    <label htmlFor="forgotEmail" className="block text-sm font-medium text-light mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        id="forgotEmail"
                        name="forgotEmail"
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => {
                          setForgotEmail(e.target.value)
                          if (error) setError('')
                        }}
                        className="w-full pl-10 pr-4 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow transition-colors"
                        placeholder="Enter your email address"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !forgotEmail.includes('@')}
                    className="w-full bg-yellow hover:bg-yellow/90 text-dark font-semibold py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>{isSubmitting ? 'Sending Reset Link...' : 'Send Reset Link'}</span>
                  </button>
                </form>

                {/* Back to Sign In */}
                <div className="text-center mt-6 pt-6 border-t border-gray-600">
                  <button
                    onClick={resetToSignIn}
                    className="inline-flex items-center text-gray-400 hover:text-light text-sm transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Sign In
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Reset Link Sent View */}
          {currentView === 'reset-sent' && (
            <>
              <div className="text-center mb-8">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <CheckCircle className="w-16 h-16 text-green-400" />
                    <div className="absolute inset-0 bg-green-400/20 rounded-full animate-ping"></div>
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-light mb-2 md:text-4xl">
                  Check Your Email
                </h1>
                <p className="text-light/80">
                  We've sent a password reset link to
                </p>
                <p className="text-yellow font-medium mt-1">
                  {forgotEmail}
                </p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
                <div className="space-y-4 text-center">
                  <div className="bg-yellow/10 rounded-lg p-4 border border-yellow/30">
                    <h3 className="text-yellow font-semibold mb-2">What's next?</h3>
                    <div className="space-y-2 text-light/80 text-sm">
                      <p>1. Check your email inbox (and spam folder)</p>
                      <p>2. Click the reset link in the email</p>
                      <p>3. Create your new password</p>
                    </div>
                  </div>

                  <p className="text-light/60 text-sm">
                    Didn't receive the email? Check your spam folder or try again.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setCurrentView('forgot')}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-light font-semibold py-2 rounded-lg transition-colors"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={resetToSignIn}
                      className="flex-1 bg-yellow hover:bg-yellow/90 text-dark font-semibold py-2 rounded-lg transition-colors"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}