import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, GraduationCap, Sparkles, Users, Clock, CheckCircle, UserPlus, ArrowUp, Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, AreaChart, Area } from 'recharts';
import { useApp } from '../context/AppContext';
import { api } from '../api';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

const activityIcons = {
  CheckCircle: <CheckCircle size={16} className="text-emerald-500" />,
  UserPlus: <UserPlus size={16} className="text-blue-500" />,
  ArrowUp: <ArrowUp size={16} className="text-purple-500" />,
  Star: <Star size={16} className="text-amber-500" />,
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: 'easeOut' },
  }),
};

function SkeletonBlock({ className }) {
  return <div className={`animate-pulse bg-surface-200 dark:bg-surface-700 rounded ${className}`} />;
}

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 shadow-sm p-5 space-y-4">
      <SkeletonBlock className="h-5 w-40" />
      <SkeletonBlock className="h-48 w-full" />
    </div>
  );
}

function SkeletonStatCard() {
  return (
    <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 shadow-sm p-4">
      <SkeletonBlock className="w-9 h-9 rounded-lg mb-2" />
      <SkeletonBlock className="h-5 w-16 mb-1" />
      <SkeletonBlock className="h-3 w-24" />
    </div>
  );
}

export default function Dashboard() {
  const { user, addToast } = useApp();

  const [mySkills, setMySkills] = useState(null);
  const [matches, setMatches] = useState(null);
  const [connections, setConnections] = useState(null);
  const [progressOverview, setProgressOverview] = useState(null);
  const [weeklyActivity, setWeeklyActivity] = useState(null);
  const [skillProgressData, setSkillProgressData] = useState(null);
  const [monthlyProgress, setMonthlyProgress] = useState(null);
  const [upcomingSessions, setUpcomingSessions] = useState(null);
  const [recommendedPeople, setRecommendedPeople] = useState(null);
  const [recommendedSkills, setRecommendedSkills] = useState(null);

  const [loadingMySkills, setLoadingMySkills] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [loadingConnections, setLoadingConnections] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [loadingWeekly, setLoadingWeekly] = useState(true);
  const [loadingSkillProgress, setLoadingSkillProgress] = useState(true);
  const [loadingMonthly, setLoadingMonthly] = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingPeople, setLoadingPeople] = useState(true);
  const [loadingSkills, setLoadingSkills] = useState(true);

  const [connectingUserId, setConnectingUserId] = useState(null);

  useEffect(() => {
    if (!user) return;

    setLoadingMySkills(true);
    api.skills.my()
      .then(setMySkills)
      .catch(() => {})
      .finally(() => setLoadingMySkills(false));

    setLoadingMatches(true);
    api.matches.list()
      .then(setMatches)
      .catch(() => {})
      .finally(() => setLoadingMatches(false));

    setLoadingConnections(true);
    api.connections.list()
      .then(setConnections)
      .catch(() => {})
      .finally(() => setLoadingConnections(false));

    setLoadingProgress(true);
    api.progress.overview()
      .then(setProgressOverview)
      .catch(() => {})
      .finally(() => setLoadingProgress(false));

    setLoadingWeekly(true);
    api.progress.weeklyActivity()
      .then(setWeeklyActivity)
      .catch(() => {})
      .finally(() => setLoadingWeekly(false));

    setLoadingSkillProgress(true);
    api.progress.skillProgress()
      .then(setSkillProgressData)
      .catch(() => {})
      .finally(() => setLoadingSkillProgress(false));

    setLoadingMonthly(true);
    api.progress.monthly()
      .then(setMonthlyProgress)
      .catch(() => {})
      .finally(() => setLoadingMonthly(false));

    setLoadingSessions(true);
    api.messages.conversations()
      .then((data) => setUpcomingSessions(Array.isArray(data) ? data.slice(0, 3) : []))
      .catch(() => {})
      .finally(() => setLoadingSessions(false));

    setLoadingPeople(true);
    api.users.list()
      .then((data) => setRecommendedPeople(Array.isArray(data) ? data.slice(0, 2) : []))
      .catch(() => {})
      .finally(() => setLoadingPeople(false));

    setLoadingSkills(true);
    api.skills.list()
      .then((data) => setRecommendedSkills(Array.isArray(data) ? data.slice(0, 3) : []))
      .catch(() => {})
      .finally(() => setLoadingSkills(false));
  }, [user]);

  async function handleConnect(userId) {
    setConnectingUserId(userId);
    try {
      await api.connections.create(userId);
      addToast('Connection request sent!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to send connection request', 'error');
    } finally {
      setConnectingUserId(null);
    }
  }

  function handleLearn() {
    addToast('Skill exploration coming soon!', 'info');
  }

  const teachCount = mySkills?.teach?.length ?? user?.skillsTeach?.length ?? 0;
  const learnCount = mySkills?.learn?.length ?? user?.skillsLearn?.length ?? 0;
  const matchPercent = matches?.length ? `${Math.round((matches.length / 5) * 100)}%` : '87%';
  const connectionsCount = connections?.length ?? '12';
  const learningHours = progressOverview?.weeklyHours ? `${progressOverview.weeklyHours}h` : '124h';

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center justify-between"
            >
              <div>
                <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
                  {getGreeting()}, {user?.name?.split(' ')[0] || 'there'} 👋
                </h1>
                <p className="text-surface-500 dark:text-surface-400 mt-1">
                  Here's what's happening with your learning journey today
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {user?.initials || 'U'}
              </div>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {(loadingProgress || loadingMySkills || loadingConnections || loadingMatches)
                ? Array.from({ length: 5 }).map((_, i) => <SkeletonStatCard key={i} />)
                : [
                    { label: 'Skills You Teach', value: teachCount, icon: <BookOpen size={18} />, accent: 'blue' },
                    { label: 'Skills Learning', value: learnCount, icon: <GraduationCap size={18} />, accent: 'purple' },
                    { label: 'Skill Match', value: matchPercent, icon: <Sparkles size={18} />, accent: 'green' },
                    { label: 'Connections', value: connectionsCount, icon: <Users size={18} />, accent: 'amber' },
                    { label: 'Learning Hours', value: learningHours, icon: <Clock size={18} />, accent: 'rose' },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      custom={i}
                      initial="hidden"
                      animate="visible"
                      variants={fadeUp}
                      className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 shadow-sm p-4"
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center bg-${stat.accent}-50 dark:bg-${stat.accent}-500/10 text-${stat.accent}-600 dark:text-${stat.accent}-400 mb-2`}>
                        {stat.icon}
                      </div>
                      <div className="text-xl font-bold text-surface-900 dark:text-white">{stat.value}</div>
                      <div className="text-xs text-surface-500 dark:text-surface-400">{stat.label}</div>
                    </motion.div>
                  ))
              }
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Weekly Activity */}
              <motion.div
                custom={5}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 shadow-sm p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-surface-900 dark:text-white">Weekly Learning Activity</h3>
                  <button className="text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10 px-3 py-1 rounded-full">
                    This Week
                  </button>
                </div>
                <div className="h-52">
                  {loadingWeekly ? (
                    <SkeletonBlock className="h-full w-full" />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={weeklyActivity || []}>
                        <defs>
                          <linearGradient id="gradArea" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgb(99,102,241)" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="rgb(99,102,241)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
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
                          fill="url(#gradArea)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </motion.div>

              {/* Skill Progress Radar */}
              <motion.div
                custom={6}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 shadow-sm p-5"
              >
                <h3 className="font-semibold text-surface-900 dark:text-white mb-4">Skill Progress Overview</h3>
                <div className="h-52">
                  {loadingSkillProgress ? (
                    <SkeletonBlock className="h-full w-full" />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={skillProgressData || []}>
                        <PolarGrid stroke="#334155" />
                        <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                        <PolarRadiusAxis tick={{ fontSize: 10, fill: '#94a3b8' }} domain={[0, 100]} />
                        <Radar name="Taught" dataKey="taught" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                        <Radar name="Learned" dataKey="learned" stroke="#a855f7" fill="#a855f7" fillOpacity={0.2} />
                        <Tooltip
                          contentStyle={{
                            background: '#1e293b',
                            border: 'none',
                            borderRadius: '12px',
                            color: '#f8fafc',
                            fontSize: 13,
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-surface-500">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Taught</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Learned</span>
                </div>
              </motion.div>
            </div>

            {/* Learning Streak / Monthly Progress */}
            <motion.div
              custom={7}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 shadow-sm p-5"
            >
              <h3 className="font-semibold text-surface-900 dark:text-white mb-4">Monthly Progress</h3>
              <div className="h-48">
                {loadingMonthly ? (
                  <SkeletonBlock className="h-full w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyProgress || []}>
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
                      <Bar dataKey="hours" fill="rgb(99,102,241)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </motion.div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Upcoming Sessions */}
              <motion.div
                custom={8}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 shadow-sm p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-surface-900 dark:text-white">Upcoming Sessions</h3>
                  <Link to="/app/messages" className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
                    View All <ArrowRight size={12} />
                  </Link>
                </div>
                <div className="space-y-3">
                  {loadingSessions ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-700">
                        <SkeletonBlock className="w-10 h-10 rounded-full flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <SkeletonBlock className="h-4 w-32" />
                          <SkeletonBlock className="h-3 w-24" />
                        </div>
                      </div>
                    ))
                  ) : upcomingSessions && upcomingSessions.length > 0 ? (
                    upcomingSessions.map((session) => {
                      const partnerName = session.user?.name || session.partner?.name || 'Unknown';
                      const initials = session.user?.initials || session.partner?.initials || partnerName.split(' ').map(n => n[0]).join('');
                      return (
                        <div
                          key={session.id}
                          className="flex items-center gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-700"
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-surface-900 dark:text-white truncate">{session.skill || session.lastMessage || 'Session'}</div>
                            <div className="text-xs text-surface-500 dark:text-surface-400">
                              {session.date || session.timestamp || ''} {session.duration ? `· ${session.duration}` : ''}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-sm text-surface-400 dark:text-surface-500 text-center py-4">No upcoming sessions</div>
                  )}
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                custom={9}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 shadow-sm p-5"
              >
                <h3 className="font-semibold text-surface-900 dark:text-white mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {progressOverview?.recentActivity?.length > 0 ? (
                    progressOverview.recentActivity.map((activity, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                          {activityIcons[activity.icon] || <CheckCircle size={16} className="text-surface-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-surface-900 dark:text-white">{activity.action}</div>
                          <div className="text-xs text-surface-500 dark:text-surface-400 truncate">{activity.detail}</div>
                        </div>
                        <span className="text-xs text-surface-400 dark:text-surface-500 whitespace-nowrap flex-shrink-0">{activity.time}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-surface-400 dark:text-surface-500 text-center py-4">No recent activity</div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block space-y-6">
            {/* Recommended Skills */}
            <motion.div
              custom={10}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 shadow-sm p-5"
            >
              <h3 className="font-semibold text-surface-900 dark:text-white mb-4">Recommended Skills</h3>
              <div className="space-y-3">
                {loadingSkills ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-700">
                      <div className="space-y-2">
                        <SkeletonBlock className="h-4 w-24" />
                        <SkeletonBlock className="h-3 w-20" />
                      </div>
                      <SkeletonBlock className="h-6 w-16 rounded-full" />
                    </div>
                  ))
                ) : (
                  (recommendedSkills || []).map((skill) => (
                    <div key={skill.id || skill.name} className="flex items-center justify-between p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-700">
                      <div>
                        <div className="text-sm font-medium text-surface-900 dark:text-white">{skill.name}</div>
                        <div className="text-xs text-surface-500 dark:text-surface-400">{skill.category}</div>
                      </div>
                      <button
                        onClick={handleLearn}
                        className="text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10 px-3 py-1.5 rounded-full hover:bg-primary-100 dark:hover:bg-primary-500/20 transition-colors"
                      >
                        Learn
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>

            {/* Recommended People */}
            <motion.div
              custom={11}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 shadow-sm p-5"
            >
              <h3 className="font-semibold text-surface-900 dark:text-white mb-4">Recommended People</h3>
              <div className="space-y-3">
                {loadingPeople ? (
                  Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-700">
                      <div className="flex items-center gap-3 mb-2">
                        <SkeletonBlock className="w-9 h-9 rounded-full flex-shrink-0" />
                        <div className="space-y-2 flex-1">
                          <SkeletonBlock className="h-4 w-28" />
                          <SkeletonBlock className="h-3 w-36" />
                        </div>
                      </div>
                      <SkeletonBlock className="h-8 w-full rounded-full" />
                    </div>
                  ))
                ) : (
                  (recommendedPeople || []).map((person) => {
                    const initials = person.initials || person.name?.split(' ').map(n => n[0]).join('') || '??';
                    const skillsTeach = person.skillsTeach?.map(s => s.name).join(', ') || '';
                    return (
                      <div key={person.id} className="p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-700">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-surface-900 dark:text-white truncate">{person.name}</div>
                            <div className="text-xs text-surface-500 dark:text-surface-400 truncate">
                              {skillsTeach}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleConnect(person.id)}
                          disabled={connectingUserId === person.id}
                          className="w-full text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10 px-3 py-1.5 rounded-full hover:bg-primary-100 dark:hover:bg-primary-500/20 transition-colors text-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {connectingUserId === person.id ? 'Sending...' : 'Connect'}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
