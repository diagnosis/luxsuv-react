import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Send, CheckCircle } from 'lucide-react'

function SignIn() {
  const navigate = useNavigate()
  const { signIn, forgotPassword, resetPassword, isLoading } = useAuth()
  
  const [view, setView] = useState('signin') // 'signin', 'forgot', 'reset-sent'
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [forgotEmail, setForgotEmail] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Clear error when switching views
  useEffect(() => {
    setError('')
  }, [view])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError('')
  }

  const handleSignIn = async (e) => {
    e.preventDefault()
    if (isSubmitting) return

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
    if (isSubmitting) return

    setError('')
    setIsSubmitting(true)

    try {
      await forgotPassword(forgotEmail)
      setView('reset-sent')
    } catch (err) {
      setError(err.message || 'Failed to send reset email')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderSignInView = () => (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to your LUX SUV account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setView('forgot')}
              className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              Forgot your password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-600 disabled:opacity-50 text-black font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-700 text-center space-y-4">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <button
              onClick={() => navigate({ to: '/signup' })}
              className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
            >
              Sign up here
            </button>
          </p>
          
          <p className="text-gray-400">
            Or{' '}
            <button
              onClick={() => navigate({ to: '/book' })}
              className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
            >
              continue as guest
            </button>
          </p>
        </div>
      </div>
    </div>
  )

  const renderForgotPasswordView = () => (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-gray-400">Enter your email to receive a reset link</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleForgotPassword} className="space-y-6">
          <div>
            <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                id="forgot-email"
                value={forgotEmail}
                onChange={(e) => {
                  setForgotEmail(e.target.value)
                  if (error) setError('')
                }}
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                placeholder="Enter your email address"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-600 disabled:opacity-50 text-black font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Send Reset Link
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setView('signin')}
            className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors flex items-center justify-center mx-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  )

  const renderResetSentView = () => (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 shadow-xl text-center">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Check Your Email</h1>
          <p className="text-gray-400">
            We've sent a password reset link to{' '}
            <span className="text-white font-medium">{forgotEmail}</span>
          </p>
        </div>

        <div className="space-y-4 text-sm text-gray-400 mb-8">
          <p>• Click the link in the email to reset your password</p>
          <p>• The link will expire in 24 hours</p>
          <p>• Check your spam folder if you don't see it</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => {
              setView('forgot')
              setError('')
            }}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
          >
            Resend Email
          </button>
          
          <button
            onClick={() => setView('signin')}
            className="w-full text-yellow-400 hover:text-yellow-300 font-medium transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      {view === 'signin' && renderSignInView()}
      {view === 'forgot' && renderForgotPasswordView()}
      {view === 'reset-sent' && renderResetSentView()}
    </div>
  )
}

export const Route = createLazyFileRoute('/signin')({
  component: SignIn,
})