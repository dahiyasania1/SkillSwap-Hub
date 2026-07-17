import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  MapPin,
  Sparkles,
  Send,
  ChevronDown,
  Zap,
  ArrowRight,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../api'
import { useApp } from '../context/AppContext'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Avatar from '../components/ui/Avatar'
import Card from '../components/ui/Card'

const filterOptions = [
  { label: 'All Matches', value: 0 },
  { label: '70%+', value: 70 },
  { label: '80%+', value: 80 },
  { label: '90%+', value: 90 },
]

const sortOptions = ['Compatibility', 'Name']

function getCompatibilityColor(score) {
  if (score >= 90) return { ring: 'text-emerald-500', bg: 'bg-emerald-500', stroke: '#10b981', label: 'text-emerald-600 dark:text-emerald-400' }
  if (score >= 80) return { ring: 'text-amber-500', bg: 'bg-amber-500', stroke: '#f59e0b', label: 'text-amber-600 dark:text-amber-400' }
  return { ring: 'text-blue-500', bg: 'bg-blue-500', stroke: '#3b82f6', label: 'text-blue-600 dark:text-blue-400' }
}

function CompatibilityCircle({ score }) {
  const colors = getCompatibilityColor(score)
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="relative flex items-center justify-center w-24 h-24 flex-shrink-0">
      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 80 80">
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          className="stroke-surface-100 dark:stroke-surface-800"
          strokeWidth="6"
        />
        <motion.circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        />
      </svg>
      <span className={`absolute text-xl font-bold ${colors.label}`}>
        {score}%
      </span>
    </div>
  )
}

function MatchCard({ match, index }) {
  const { addToast } = useApp()
  const navigate = useNavigate()
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const colors = getCompatibilityColor(match.compatibility)

  const handleConnect = async () => {
    setSending(true)
    try {
      await api.connections.create(match.user.id)
      addToast(`Connection request sent to ${match.user.name}!`)
      setSent(true)
    } catch (err) {
      addToast(err.message || 'Failed to send request', 'error')
    } finally {
      setSending(false)
    }
  }

  const handleSendMessage = async () => {
    try {
      await api.messages.create(match.user.id)
      navigate('/app/messages')
    } catch (err) {
      addToast(err.message || 'Failed to start conversation', 'error')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
    >
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Avatar + Info */}
          <div className="flex items-start gap-4 flex-shrink-0 lg:w-56">
            <div className="relative">
              <Avatar
                name={match.user.name}
                size="xl"
                online={match.user.online}
                ring
              />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-lg text-surface-900 dark:text-white truncate">
                {match.user.name}
              </h3>
              <p className="flex items-center gap-1 text-sm text-surface-500 mt-0.5">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                {match.user.location}
              </p>
              <span className="inline-flex items-center gap-1.5 mt-2">
                <span className={`w-2 h-2 rounded-full ${match.user.online ? 'bg-emerald-500' : 'bg-surface-300'}`} />
                <span className="text-xs text-surface-500">
                  {match.user.online ? 'Online now' : 'Offline'}
                </span>
              </span>
            </div>
          </div>

          {/* Center: Compatibility + Skills */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-6 mb-5">
              <CompatibilityCircle score={match.compatibility} />
              <div className="flex-1 min-w-0">
                <div className="mb-3">
                  <p className="text-xs font-medium text-surface-400 uppercase tracking-wider mb-1.5">
                    Skills They Can Teach
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(match.matchedSkills?.teach || []).map(skill => (
                      <Badge key={skill} variant="primary">{skill}</Badge>
                    ))}
                  </div>
                </div>
                <div className="mb-3">
                  <p className="text-xs font-medium text-surface-400 uppercase tracking-wider mb-1.5">
                    Skills They Want to Learn
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(match.matchedSkills?.learn || []).map(skill => (
                      <Badge key={skill} variant="default">{skill}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-surface-400 uppercase tracking-wider mb-1.5">
                    Shared Interests
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(match.sharedInterests || []).map(interest => (
                      <span
                        key={interest}
                        className="text-xs text-surface-500 bg-surface-50 dark:bg-surface-800 rounded-full px-2.5 py-0.5"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Explanation */}
            <p className="text-sm text-surface-500 italic mb-5 leading-relaxed">
              {match.explanation}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="primary"
                size="sm"
                icon={sent ? Zap : ArrowRight}
                disabled={sent || sending}
                onClick={handleConnect}
                className={`rounded-xl ${sent ? 'bg-emerald-500 hover:bg-emerald-500 shadow-none' : ''}`}
              >
                {sent ? 'Request Sent' : sending ? 'Sending...' : 'Connect'}
              </Button>
              <Link to={`/app/profile/${match.user.id}`}>
                <Button variant="outline" size="sm" className="rounded-xl">
                  View Profile
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                icon={Send}
                className="rounded-xl"
                onClick={handleSendMessage}
              >
                Send Message
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default function SkillMatch() {
  const [minCompatibility, setMinCompatibility] = useState(0)
  const [sortBy, setSortBy] = useState('Compatibility')
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    api.matches.list()
      .then(data => {
        if (!cancelled) setMatches(data)
      })
      .catch(err => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const filteredMatches = useMemo(() => {
    let result = matches.filter(m => m.compatibility >= minCompatibility)

    switch (sortBy) {
      case 'Compatibility':
        result.sort((a, b) => b.compatibility - a.compatibility)
        break
      case 'Name':
        result.sort((a, b) => a.user.name.localeCompare(b.user.name))
        break
      default:
        break
    }

    return result
  }, [minCompatibility, sortBy, matches])

  return (
    <div className="min-h-screen bg-white dark:bg-surface-900 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-surface-900 dark:text-white">
            Your Best Skill Matches
          </h1>
          <p className="text-surface-500">
            We found people who complement your skills perfectly
          </p>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-surface-400" />
              <span className="text-sm font-medium text-surface-600 dark:text-surface-300">
                Min Compatibility:
              </span>
              <div className="relative">
                <select
                  value={minCompatibility}
                  onChange={e => setMinCompatibility(Number(e.target.value))}
                  className="appearance-none pl-4 pr-10 py-2 rounded-xl bg-surface-100 dark:bg-surface-800 border-none text-sm font-medium focus:ring-2 focus:ring-primary-500 cursor-pointer"
                >
                  {filterOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-surface-600 dark:text-surface-300">
                Sort by:
              </span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 rounded-xl bg-surface-100 dark:bg-surface-800 border-none text-sm font-medium focus:ring-2 focus:ring-primary-500 cursor-pointer"
                >
                  {sortOptions.map(opt => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
              </div>
            </div>

            {!loading && (
              <p className="text-sm text-surface-400 ml-auto">
                {filteredMatches.length} match{filteredMatches.length !== 1 ? 'es' : ''} found
              </p>
            )}
          </div>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-surface-500">Finding your best matches...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <Sparkles className="w-16 h-16 text-surface-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-surface-900 dark:text-white">
              Something went wrong
            </h2>
            <p className="text-surface-500 mb-6">{error}</p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="gap-2 rounded-xl"
            >
              Try Again
            </Button>
          </motion.div>
        )}

        {/* Match Cards */}
        {!loading && !error && (
          <AnimatePresence mode="popLayout">
            {filteredMatches.length > 0 ? (
              <div className="flex flex-col gap-4">
                {filteredMatches.map((match, i) => (
                  <MatchCard key={match.user?.id || index} match={match} index={i} />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-24"
              >
                <Sparkles className="w-16 h-16 text-surface-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2 text-surface-900 dark:text-white">
                  No matches found at this level
                </h2>
                <p className="text-surface-500 mb-6">
                  Try lowering the compatibility filter to discover more skill partners
                </p>
                <Button
                  variant="outline"
                  onClick={() => setMinCompatibility(0)}
                  className="gap-2 rounded-xl"
                >
                  <Sparkles className="w-4 h-4" />
                  Show All Matches
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
