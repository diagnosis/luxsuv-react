import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export const Route = createLazyFileRoute('/signup')({
  component: SignUp,
})

function SignUp() {
  const navigate = useNavigate()
  const { signUp, isLoading } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
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

  const validateForm = () => {
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters long')
      return false
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address')
      return false
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }

    return true
  }

  const isFormValid = formData.username.length >= 3 &&
      formData.email.includes('@') &&
      formData.password.length >= 6 &&
      formData.password === formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      console.log('🔐 Attempting sign up with:', {
        username: formData.username,
        email: formData.email
      });
      await signUp({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      })
      console.log('✅ Sign up successful, redirecting...');
      navigate({ to: '/' })
    } catch (err) {
      console.error('❌ Sign up failed:', err);
      setError(err.message || 'Registration failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
        <div className=" h-full bg-dark text-light overflow-y-auto">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow"></div>
        </div>
    )
  }

  return (
      <div className="h-full bg-dark text-light overflow-y-auto flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-gray-800 rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-light mb-2">
                Create your account
              </h2>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                  <div className="mb-6 p-4 bg-red-900/10 border border-red-700/50 rounded-lg">
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-light/80 mb-2">
                    Username
                  </label>
                  <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow focus:border-transparent transition-colors"
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-light/80 mb-2">
                    Email address
                  </label>
                  <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow focus:border-transparent transition-colors"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-light/80 mb-2">
                    Password
                  </label>
                  <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow focus:border-transparent transition-colors"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-light/80 mb-2">
                    Confirm Password
                  </label>
                  <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow focus:border-transparent transition-colors"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <button
                    type="submit"
                    disabled={isSubmitting || !isFormValid}
                    className="w-full bg-yellow hover:bg-yellow/90 text-dark font-bold py-3 px-4 rounded-lg border-2 border-yellow shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating account...' : 'Sign up'}
                </button>
              </div>

              <div className="text-center">
                <button
                    type="button"
                    onClick={() => navigate({ to: '/signin' })}
                    className="text-yellow hover:text-yellow/80 text-sm font-medium transition-colors"
                >
                  Already have an account? Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  )
}