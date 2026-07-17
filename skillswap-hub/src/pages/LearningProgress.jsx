import { useState, useEffect } from 'react';
import { Clock, ArrowRightLeft, Flame, BookOpen, CheckCircle, Star, Award, Compass, Users, Crown, Network, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { useApp } from '../context/AppContext';
import { api } from '../api';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';

const achievementIcons = {
  Star, Flame, Award, Compass, Users, Crown, Network,
};

const achievementColors = {
  ach1: { bg: 'bg-amber-500/15', text: 'text-amber-500' },
  ach2: { bg: 'bg-orange-500/15', text: 'text-orange-500' },
  ach3: { bg: 'bg-blue-500/15', text: 'text-blue-500' },
  ach4: { bg: 'bg-emerald-500/15', text: 'text-emerald-500' },
  ach5: { bg: 'bg-purple-500/15', text: 'text-purple-500' },
  ach6: { bg: 'bg-rose-500/15', text: 'text-rose-500' },
  ach7: { bg: 'bg-orange-500/15', text: 'text-orange-500' },
  ach8: { bg: 'bg-indigo-500/15', text: 'text-indigo-500' },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: 'easeOut' },
  }),
};

const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' },
  }),
};

const goalColors = [
  'from-primary-500 to-purple-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
];

export default function LearningProgress() {
  const { user } = useApp();
  const [period, setPeriod] = useState('This Week');
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [weeklyActivity, setWeeklyActivity] = useState([]);
  const [monthlyProgress, setMonthlyProgress] = useState([]);
  const [skillProgressData, setSkillProgressData] = useState([]);
  const [achievementsList, setAchievementsList] = useState([]);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [overviewData, weeklyData, monthlyData, skillData, achData] = await Promise.all([
          api.progress.overview(),
          api.progress.weeklyActivity(),
          api.progress.monthly(),
          api.progress.skillProgress(),
          api.progress.achievements(),
        ]);
        setOverview(overviewData);
        setWeeklyActivity(weeklyData);
        setMonthlyProgress(monthlyData);
        setSkillProgressData(skillData);
        setAchievementsList(achData);
      } catch (err) {
        console.error('Failed to load progress data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  const streak = overview?.streak ?? 0;
  const weeklyHours = overview?.weeklyHours ?? 0;
  const monthlyExchanges = overview?.monthlyExchanges ?? 0;
  const skillsInProgress = overview?.skillsInProgress ?? 0;
  const completedSkills = overview?.completedSkills ?? 0;
  const activeDays = overview?.activeDays ?? 0;
  const restDays = overview?.restDays ?? 0;

  const consistencyData = [
    { name: 'Active Days', value: activeDays },
    { name: 'Rest Days', value: restDays },
  ];

  const goalProgressMap = overview?.goals ?? {};

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Learning Progress</h1>
            <p className="text-surface-500 dark:text-surface-400 mt-1">Track your learning journey and achievements</p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-5 py-3 rounded-2xl shadow-lg shadow-orange-500/25"
          >
            <Flame size={22} className="text-amber-300" />
            <span className="font-bold text-lg">{streak} Day Streak</span>
          </motion.div>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { label: 'Weekly Hours', value: `${weeklyHours}h`, icon: <Clock size={18} />, accent: 'blue' },
            { label: 'Monthly Exchanges', value: `${monthlyExchanges}`, icon: <ArrowRightLeft size={18} />, accent: 'purple' },
            { label: 'Current Streak', value: `${streak} days`, icon: <Flame size={18} />, accent: 'orange', glow: true },
            { label: 'Skills in Progress', value: `${skillsInProgress}`, icon: <BookOpen size={18} />, accent: 'teal' },
            { label: 'Completed Skills', value: `${completedSkills}`, icon: <CheckCircle size={18} />, accent: 'emerald' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className={`bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 shadow-sm p-4 ${stat.glow ? 'ring-2 ring-orange-400/30 shadow-orange-500/10' : ''}`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center bg-${stat.accent}-50 dark:bg-${stat.accent}-500/10 text-${stat.accent}-600 dark:text-${stat.accent}-400 mb-2`}>
                {stat.icon}
              </div>
              <div className="text-xl font-bold text-surface-900 dark:text-white">{stat.value}</div>
              <div className="text-xs text-surface-500 dark:text-surface-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Weekly Activity Chart - Full Width */}
        <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp}>
          <Card padding="md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-surface-900 dark:text-white">Weekly Learning Activity</h3>
              <div className="flex items-center gap-1 bg-surface-100 dark:bg-surface-800 rounded-full p-0.5">
                <button
                  onClick={() => setPeriod('This Week')}
                  className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${
                    period === 'This Week'
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'text-surface-500 hover:text-surface-700 dark:text-surface-400'
                  }`}
                >
                  This Week
                </button>
                <button
                  onClick={() => setPeriod('Last Week')}
                  className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${
                    period === 'Last Week'
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'text-surface-500 hover:text-surface-700 dark:text-surface-400'
                  }`}
                >
                  Last Week
                </button>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyActivity}>
                  <defs>
                    <linearGradient id="gradWeekly" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgb(99,102,241)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="rgb(99,102,241)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} width={30} />
                  <Tooltip
                    contentStyle={{
                      background: '#1e293b',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: 13,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="hours"
                    stroke="rgb(99,102,241)"
                    strokeWidth={2.5}
                    fill="url(#gradWeekly)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Skill Progress + Monthly Consistency */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skill Progress Chart */}
          <motion.div custom={6} initial="hidden" animate="visible" variants={fadeUp}>
            <Card padding="md">
              <h3 className="font-semibold text-surface-900 dark:text-white mb-4">Skill Progress by Skill</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={skillProgressData} layout="vertical" barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} domain={[0, 100]} />
                    <YAxis type="category" dataKey="skill" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} width={100} />
                    <Tooltip
                      contentStyle={{
                        background: '#1e293b',
                        border: 'none',
                        borderRadius: '12px',
                        color: '#f8fafc',
                        fontSize: 13,
                      }}
                    />
                    <Bar dataKey="taught" fill="rgb(59,130,246)" radius={[0, 4, 4, 0]} barSize={10} />
                    <Bar dataKey="learned" fill="rgb(168,85,247)" radius={[0, 4, 4, 0]} barSize={10} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-surface-500">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Taught</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Learned</span>
              </div>
            </Card>
          </motion.div>

          {/* Monthly Consistency Pie */}
          <motion.div custom={7} initial="hidden" animate="visible" variants={fadeUp}>
            <Card padding="md">
              <h3 className="font-semibold text-surface-900 dark:text-white mb-4">Monthly Consistency</h3>
              <div className="flex flex-col items-center">
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={consistencyData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        <Cell fill="rgb(99,102,241)" />
                        <Cell fill="#e2e8f0" />
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: '#1e293b',
                          border: 'none',
                          borderRadius: '12px',
                          color: '#f8fafc',
                          fontSize: 13,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center gap-6 mt-2">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-500">{activeDays}</div>
                    <div className="text-xs text-surface-500">Active Days</div>
                  </div>
                  <div className="w-px h-8 bg-surface-200 dark:bg-surface-700" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-surface-400">{restDays}</div>
                    <div className="text-xs text-surface-500">Rest Days</div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Monthly Trend - Full Width */}
        <motion.div custom={8} initial="hidden" animate="visible" variants={fadeUp}>
          <Card padding="md">
            <h3 className="font-semibold text-surface-900 dark:text-white mb-4">Monthly Learning Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} width={30} />
                  <Tooltip
                    contentStyle={{
                      background: '#1e293b',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: 13,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="exchanges"
                    stroke="rgb(99,102,241)"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: 'rgb(99,102,241)' }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="hours"
                    stroke="rgb(236,72,153)"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: 'rgb(236,72,153)' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-surface-500">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary-500" /> Exchanges</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-pink-500" /> Hours</span>
            </div>
          </Card>
        </motion.div>

        {/* Learning Goals */}
        <motion.div custom={9} initial="hidden" animate="visible" variants={fadeUp}>
          <Card padding="md">
            <h3 className="font-semibold text-surface-900 dark:text-white mb-4">Learning Goals</h3>
            <div className="space-y-4">
              {(user?.learningGoals || []).map((goal, i) => (
                <div key={goal} className="p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-surface-900 dark:text-white">{goal}</span>
                    <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">{goalProgressMap[goal] || 0}%</span>
                  </div>
                  <ProgressBar
                    value={goalProgressMap[goal] || 0}
                    size="md"
                    color={`bg-gradient-to-r ${goalColors[i] || goalColors[0]}`}
                  />
                </div>
              ))}
              {(!user?.learningGoals || user?.learningGoals.length === 0) && (
                <p className="text-sm text-surface-500 dark:text-surface-400">No learning goals set yet.</p>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Achievements Section */}
        <motion.div custom={10} initial="hidden" animate="visible" variants={fadeUp}>
          <Card padding="md">
            <h3 className="font-semibold text-surface-900 dark:text-white mb-4">Achievements & Badges</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {achievementsList.map((ach, i) => {
                const Icon = achievementIcons[ach.icon] || Award;
                const colors = achievementColors[ach.id] || { bg: 'bg-primary-500/15', text: 'text-primary-500' };

                return (
                  <motion.div
                    key={ach.id}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={staggerItem}
                    className={`relative flex flex-col items-center text-center p-4 rounded-2xl border transition-all ${
                      ach.unlocked
                        ? 'bg-white dark:bg-surface-900 border-surface-200 dark:border-surface-700 shadow-sm hover:shadow-md'
                        : 'bg-surface-50 dark:bg-surface-900/50 border-surface-100 dark:border-surface-800 opacity-60'
                    }`}
                  >
                    {ach.unlocked && (
                      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-primary-500/10 pointer-events-none" />
                    )}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                      ach.unlocked
                        ? colors.bg
                        : 'bg-surface-200 dark:bg-surface-800'
                    }`}>
                      <Icon size={22} className={`${ach.unlocked ? colors.text : 'text-surface-400 dark:text-surface-500'}`} />
                    </div>
                    <div className={`text-sm font-medium mb-1 ${ach.unlocked ? 'text-surface-900 dark:text-white' : 'text-surface-500 dark:text-surface-400'}`}>
                      {ach.name}
                    </div>
                    <div className="text-xs text-surface-400 dark:text-surface-500 leading-tight">{ach.description}</div>
                    {!ach.unlocked && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center">
                        <Lock size={12} className="text-surface-400 dark:text-surface-500" />
                      </div>
                    )}
                    {ach.unlocked && (
                      <Badge variant="success" className="mt-2">Unlocked</Badge>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
