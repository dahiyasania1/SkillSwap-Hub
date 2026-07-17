import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Code2,
  Briefcase,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, addToast, darkMode, toggleDarkMode } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      addToast('Welcome back!', 'success');
      navigate('/app');
    } catch (error) {
      addToast(error.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-surface-950">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500">
        {/* Floating decorative shapes */}
        <div className="absolute top-20 left-16 w-20 h-20 bg-white/10 rounded-full" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute bottom-32 left-24 w-24 h-24 bg-white/10 rounded-full" />
        <div className="absolute bottom-20 right-32 w-16 h-16 bg-white/10 rounded-full" />
        <div className="absolute top-1/2 left-10 w-12 h-12 bg-white/10 rounded-full" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 w-fit">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Zap size={22} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-white">SkillSwap Hub</span>
          </Link>

          {/* Center content */}
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
              Learn. Teach.
              <br />
              Connect. Grow
              <br />
              Together.
            </h1>
            <p className="text-lg text-white/80 max-w-sm leading-relaxed">
              Join thousands of learners and teachers exchanging skills and knowledge every day.
            </p>
          </div>

          {/* Bottom link */}
          <div>
            <p className="text-white/70 text-sm">
              New here?{' '}
              <Link
                to="/signup"
                className="text-white font-semibold hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col relative">
        {/* Dark mode toggle */}
        <div className="absolute top-5 right-5 z-10">
          <button
            onClick={toggleDarkMode}
            className="w-10 h-10 rounded-xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center justify-center pt-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center">
              <Zap size={22} className="text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">SkillSwap Hub</span>
          </Link>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="w-full max-w-md"
          >
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-surface-900 dark:text-white">
                Welcome back
              </h2>
              <p className="mt-2 text-surface-500 dark:text-surface-400">
                Sign in to continue learning
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-white placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400"
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-11 pr-12 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-white placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember me + Forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-surface-300 dark:border-surface-600 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-sm text-surface-600 dark:text-surface-400">
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => addToast('Password reset coming soon!', 'info')}
                  className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold shadow-lg shadow-primary-500/25 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-surface-200 dark:border-surface-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white dark:bg-surface-950 text-surface-400">
                  or continue with
                </span>
              </div>
            </div>

            {/* Social logins */}
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => addToast('Social login coming soon!', 'info')}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors text-sm font-medium"
              >
                <span className="w-5 h-5 rounded bg-surface-200 dark:bg-surface-600 flex items-center justify-center text-xs font-bold text-surface-700 dark:text-white">
                  G
                </span>
                Google
              </button>
              <button
                type="button"
                onClick={() => addToast('Social login coming soon!', 'info')}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors text-sm font-medium"
              >
                <Code2 size={18} />
                GitHub
              </button>
              <button
                type="button"
                onClick={() => addToast('Social login coming soon!', 'info')}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors text-sm font-medium"
              >
                <Briefcase size={18} />
                LinkedIn
              </button>
            </div>

            {/* Bottom link */}
            <p className="mt-8 text-center text-sm text-surface-500 dark:text-surface-400">
              Don&apos;t have an account?{' '}
              <Link
                to="/signup"
                className="font-semibold text-primary-500 hover:text-primary-600 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
