import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search,
  Star,
  Users,
  Grid3x3,
  List,
  FilterX,
  ChevronDown,
  SlidersHorizontal
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../api'
import { useApp } from '../context/AppContext'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'

const levelOptions = ['All Levels', 'Beginner', 'Intermediate', 'Advanced', 'Expert']
const sortOptions = ['Popularity', 'Rating', 'Most Learners', 'Name']

const categoryColors = {
  Technology: 'bg-blue-500',
  Design: 'bg-pink-500',
  Business: 'bg-amber-500',
  Mathematics: 'bg-purple-500',
  Languages: 'bg-emerald-500',
  Music: 'bg-rose-500',
  Marketing: 'bg-orange-500',
  'Personal Development': 'bg-teal-500'
}

function SkillCardGrid({ skill, onLearn }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.25 }}
    >
      <Card className="p-5 flex flex-col gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer h-full">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg leading-tight">{skill.name}</h3>
          <Badge className={`${categoryColors[skill.category] || 'bg-surface-400'} text-white text-xs whitespace-nowrap`}>
            {skill.category}
          </Badge>
        </div>

        <span className="text-sm text-surface-500">{skill.level}</span>

        <div className="w-full h-2 rounded-full bg-surface-100 dark:bg-surface-800 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-primary-500"
            initial={{ width: 0 }}
            animate={{ width: `${skill.popularity || 0}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>

        <div className="flex items-center gap-4 text-sm text-surface-500">
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            {skill.rating}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {skill.learners}
          </span>
        </div>

        <Button className="w-full mt-auto rounded-xl" onClick={() => onLearn(skill)}>
          Learn This Skill
        </Button>
      </Card>
    </motion.div>
  )
}

function SkillCardList({ skill, onLearn }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 p-4 border-b border-surface-100 dark:border-surface-800 last:border-b-0 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-lg truncate">{skill.name}</h3>
            <Badge className={`${categoryColors[skill.category] || 'bg-surface-400'} text-white text-xs`}>
              {skill.category}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-surface-500 flex-shrink-0">
          <span>{skill.level}</span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {skill.learners}
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            {skill.rating}
          </span>
        </div>

        <Button size="sm" className="rounded-xl whitespace-nowrap flex-shrink-0" onClick={() => onLearn(skill)}>
          Learn This Skill
        </Button>
      </Card>
    </motion.div>
  )
}

export default function ExploreSkills() {
  const [skills, setSkills] = useState([])
  const [skillCategories, setSkillCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedLevel, setSelectedLevel] = useState('All Levels')
  const [sortBy, setSortBy] = useState('Popularity')
  const [viewMode, setViewMode] = useState('grid')

  const { isAuthenticated, addToast } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchData() {
      try {
        const [skillsRes, categoriesRes] = await Promise.all([
          api.skills.list(),
          api.skills.categories()
        ])
        setSkills(skillsRes)
          setSkillCategories(categoriesRes.map(c => c.name || c))
      } catch (err) {
        console.error('Failed to fetch skills:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const isFiltered = searchQuery || selectedCategory !== 'All' || selectedLevel !== 'All Levels'

  const filteredSkills = useMemo(() => {
    let result = [...skills]

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
      )
    }

    if (selectedCategory !== 'All') {
      result = result.filter(s => s.category === selectedCategory)
    }

    if (selectedLevel !== 'All Levels') {
      result = result.filter(s => s.level === selectedLevel)
    }

    switch (sortBy) {
      case 'Popularity':
        result.sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
        break
      case 'Rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'Most Learners':
        result.sort((a, b) => (b.learners || 0) - (a.learners || 0))
        break
      case 'Name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        break
    }

    return result
  }, [skills, searchQuery, selectedCategory, selectedLevel, sortBy])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('All')
    setSelectedLevel('All Levels')
  }

  const handleLearn = async (skill) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    try {
      await api.skills.addLearn({
        skillName: skill.name,
        category: skill.category,
        goal: 'Learning ' + skill.name
      })
      addToast('Added to your learning list!', 'success')
    } catch (err) {
      addToast(err.message || 'Failed to add skill', 'error')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-surface-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Explore Skills</h1>
            <p className="text-surface-500">Discover new skills and start learning today</p>
          </div>
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-surface-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Explore Skills</h1>
          <p className="text-surface-500">Discover new skills and start learning today</p>
        </div>

        {/* Search & Filter Bar */}
        <Card className="p-6 mb-8">
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            {['All', ...skillCategories].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Dropdowns & View Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <select
                value={selectedLevel}
                onChange={e => setSelectedLevel(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 border-none text-sm font-medium focus:ring-2 focus:ring-primary-500 cursor-pointer"
              >
                {levelOptions.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 border-none text-sm font-medium focus:ring-2 focus:ring-primary-500 cursor-pointer"
              >
                {sortOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
            </div>

            <div className="flex items-center bg-surface-100 dark:bg-surface-800 rounded-xl p-1 ml-auto">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-surface-700 shadow-sm text-primary-500' : 'text-surface-400 hover:text-surface-600'}`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-surface-700 shadow-sm text-primary-500' : 'text-surface-400 hover:text-surface-600'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {isFiltered && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-sm gap-1.5"
              >
                <FilterX className="w-4 h-4" />
                Clear Filters
              </Button>
            )}
          </div>
        </Card>

        {/* Results Section */}
        <div className="mb-6">
          <p className="text-sm text-surface-500">Showing {filteredSkills.length} skills</p>
        </div>

        {filteredSkills.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <FilterX className="w-16 h-16 text-surface-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No skills found</h2>
            <p className="text-surface-500 mb-6">Try adjusting your filters</p>
            <Button onClick={clearFilters} className="gap-2">
              <FilterX className="w-4 h-4" />
              Clear Filters
            </Button>
          </motion.div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {filteredSkills.map(skill => (
                <SkillCardGrid key={skill.id} skill={skill} onLearn={handleLearn} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <Card className="divide-y divide-surface-100 dark:divide-surface-800">
            <AnimatePresence mode="popLayout">
              {filteredSkills.map(skill => (
                <SkillCardList key={skill.id} skill={skill} onLearn={handleLearn} />
              ))}
            </AnimatePresence>
          </Card>
        )}
      </div>
    </div>
  )
}
