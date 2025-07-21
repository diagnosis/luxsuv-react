import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export const Route = createLazyFileRoute('/forgot-password')({
  component: ForgotPassword,
})

function ForgotPassword() {
  const navigate = useNavigate()
  const { forgotPassword } = useAuth()

  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email.trim()) {
      setError('Email address is required')
      return
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      await forgotPassword(email.trim())
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Failed to send reset email. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e) => {
    setEmail(e.target.value)
    if (error) setError('')
  }

  // Success view
  if (success) {
    return (
        <div className="h-full bg-dark text-light overflow-y-auto flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="bg-gray-800 rounded-2xl shadow-2xl p-8">
              <div className="text-center mb-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-light mb-2">Check Your Email</h1>
                <p className="text-light/70 mb-6">
                  If an account with that email exists, we've sent you a password reset link.
                </p>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4 mb-6 text-left">
                <h3 className="text-yellow font-medium mb-2">What's next?</h3>
                <ul className="text-light/70 text-sm space-y-1">
                  <li>• Check your email inbox (and spam folder)</li>
                  <li>• Click the reset link in the email</li>
                  <li>• Create your new password</li>
                  <li>• Sign in with your new password</li>
                </ul>
              </div>

              <div className="space-y-3">
                <button
                    onClick={() => navigate({ to: '/signin' })}
                    className="w-full bg-yellow hover:bg-yellow/90 text-dark font-bold py-3 px-4 rounded-lg border-2 border-yellow shadow-lg transition-all duration-200"
                >
                  Back to Sign In
                </button>

                <button
                    onClick={() => {
                      setSuccess(false)
                      setEmail('')
                    }}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-light font-bold py-3 px-4 rounded-lg border-2 border-gray-600 shadow-lg transition-all duration-200"
                >
                  Send Another Email
                </button>
              </div>
            </div>
          </div>
        </div>
    )
  }

  // Forgot password form
  return (
      <div className="h-full bg-dark text-light overflow-y-auto flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-gray-800 rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-light mb-2">Forgot Password?</h1>
              <p className="text-light/70">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-900/10 border border-red-700/50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-300" />
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-light/80 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow focus:border-transparent transition-colors"
                      placeholder="Enter your email address"
                      required
                      disabled={isSubmitting}
                  />
                </div>
              </div>

              <button
                  type="submit"
                  disabled={isSubmitting || !email.trim()}
                  className="w-full bg-yellow hover:bg-yellow/90 text-dark font-bold py-3 px-4 rounded-lg border-2 border-yellow shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Sending Reset Link...
                    </>
                ) : (
                    'Send Reset Link'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                  onClick={() => navigate({ to: '/signin' })}
                  className="text-yellow hover:text-yellow/80 font-medium transition-colors flex items-center justify-center mx-auto"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-600">
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-light/80 font-semibold mb-2">Having trouble?</h3>
                <ul className="text-light/70 text-sm space-y-1">
                  <li>• Make sure you're using the email you registered with</li>
                  <li>• Check your spam/junk folder</li>
                  <li>• The reset link expires after 1 hour</li>
                  <li>• Contact support if you need help</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}