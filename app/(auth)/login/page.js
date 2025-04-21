'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../context/AuthContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [phoneError, setPhoneError] = useState('')
  const router = useRouter()
  const { login } = useAuth()

  const validatePhone = (phone) => {
    const bdPhoneRegex = /^01[3-9][0-9]{8}$/;
    return bdPhoneRegex.test(phone);
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'phone') {
      const numberOnly = value.replace(/[^\d]/g, '')
      if (numberOnly.length <= 11) {
        setPhoneError('')
        setFormData(prev => ({ ...prev, phone: numberOnly }))
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validatePhone(formData.phone)) {
      setPhoneError('Please enter a valid Bangladesh phone number starting with 01')
      return
    }

    setLoading(true)
    try {
      const phoneWithCountryCode = '+88' + formData.phone
      const result = await login(phoneWithCountryCode, formData.password)
      
      if (result.success) {
        toast.success('Login successful!')
        // Get the callback URL from the query parameters
        const params = new URLSearchParams(window.location.search);
        const callbackUrl = params.get('callbackUrl');
        
        // Redirect based on user role and callback URL
        if (result.isAdmin) {
          router.push(callbackUrl || '/admin/dashboard');
        } else {
          router.push('/profile');
        }
      } else {
        toast.error(result.error || 'Login failed')
      }
    } catch (error) {
      toast.error('An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-background min-h-screen flex items-center justify-center p-4 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-effect rounded-lg p-8 w-full max-w-md relative z-10"
      >
        <h2 className="text-3xl font-bold text-white text-center mb-8">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-white/90 block mb-2 text-sm font-medium">Phone Number</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/90 font-medium">+88</span>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="01XXXXXXXXX"
                className="w-full pl-12 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                required
                maxLength="11"
              />
            </div>
            {phoneError && (
              <p className="mt-1 text-red-300 text-sm">{phoneError}</p>
            )}
          </div>
          <div>
            <label className="text-white/90 block mb-2 text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-white text-blue-900 hover:bg-blue-50 font-medium rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <div className="text-center">
            <a href="#" className="text-white/90 hover:text-white text-sm">Forgot Password?</a>
          </div>
          <p className="text-center text-white/90">
            Don't have an account?{' '}
            <a href="/register" className="text-white hover:text-blue-200 font-medium">
              Register Now
            </a>
          </p>
        </form>
      </motion.div>
    </div>
  )
}
