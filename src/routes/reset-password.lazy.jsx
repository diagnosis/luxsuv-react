import { createLazyFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react'

export const Route = createLazyFileRoute('/reset-password')({
  validateSearch: (search) => ({
    token: search.token || '',
  }),
  component: ResetPassword,
})

function ResetPassword() {
  const navigate = useNavigate()
  const { resetPassword } = useAuth()
  const { token } = useSearch({ from: '/reset-password' })

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tokenValid, setTokenValid] = useState(true)

  // Check if token exists
  useEffect(() => {
    if (!token) {
      setTokenValid(false)
      setError('Invalid or missing reset token')
    }
  }, [token])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError('')
  }

  const validateForm = () => {
    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long')
      return false
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }

    return true
  }

  const isFormValid = formData.newPassword.length >= 6 &&
      formData.newPassword === formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return

    setError('')

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      await resetPassword({
        token: token,
        newPassword: formData.newPassword
      })
      setSuccess(true)

      // Redirect to sign in after 3 seconds
      setTimeout(() => {
        navigate({ to: '/signin' })
      }, 3000)
    } catch (err) {
      setError(err.message || 'Failed to reset password')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Invalid token view
  if (!tokenValid) {
    return (
        <div className="h-full bg-dark text-light overflow-y-auto flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="bg-gray-800 rounded-2xl shadow-2xl p-8">
              <div className="text-center mb-8">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-light mb-2">Invalid Reset Link</h1>
                <p className="text-light/70 mb-6">
                  This password reset link is invalid or has expired.
                </p>
              </div>

              <div className="space-y-3">
                <button
                    onClick={() => navigate({ to: '/signin' })}
                    className="w-full bg-yellow hover:bg-yellow/90 text-dark font-bold py-3 px-4 rounded-lg border-2 border-yellow shadow-lg transition-all duration-200"
                >
                  Back to Sign In
                </button>

                <p className="text-center text-light/70 text-sm">
                  Need a new reset link?{' '}
                  <button
                      onClick={() => navigate({ to: '/forgot-password' })}
                      className="text-yellow hover:text-yellow/80 transition-colors font-medium"
                  >
                    Request another one
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
    )
  }

  // Success view
  if (success) {
    return (
        <div className="h-full bg-dark text-light overflow-y-auto flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="bg-gray-800 rounded-2xl shadow-2xl p-8">
              <div className="text-center mb-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-light mb-2">Password Reset Successful</h1>
                <p className="text-light/70 mb-6">
                  Your password has been successfully updated. You can now sign in with your new password.
                </p>
              </div>

              <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 mb-6">
                <p className="text-green-300 text-sm">
                  Redirecting to sign in page in 3 seconds...
                </p>
              </div>

              <button
                  onClick={() => navigate({ to: '/signin' })}
                  className="w-full bg-yellow hover:bg-yellow/90 text-dark font-bold py-3 px-4 rounded-lg border-2 border-yellow shadow-lg transition-all duration-200"
              >
                Sign In Now
              </button>
            </div>
          </div>
        </div>
    )
  }

  // Reset password form
  return (
      <div className="h-full bg-dark text-light overflow-y-auto flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-gray-800 rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-light mb-2">Reset Your Password</h1>
              <p className="text-light/70">Enter your new password below</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-900/10 border border-red-700/50 rounded-lg">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-semibold text-light/80 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                      type={showPassword ? 'text' : 'password'}
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow focus:border-transparent transition-colors"
                      placeholder="Enter your new password"
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

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-light/80 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow focus:border-transparent transition-colors"
                      placeholder="Confirm your new password"
                      required
                  />
                  <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-light/80 font-semibold mb-2">Password Requirements:</h3>
                <ul className="text-light/70 text-sm space-y-1">
                  <li>• At least 6 characters long</li>
                  <li>• Must match confirmation password</li>
                </ul>
              </div>

              <button
                  type="submit"
                  disabled={isSubmitting || !isFormValid}
                  className="w-full bg-yellow hover:bg-yellow/90 text-dark font-bold py-3 px-4 rounded-lg border-2 border-yellow shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Resetting Password...
                    </>
                ) : (
                    'Reset Password'
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
          </div>
        </div>
      </div>
  )
}