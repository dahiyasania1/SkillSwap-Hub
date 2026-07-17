import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Calendar, Star, Zap, Flame, ArrowLeft, Edit3, UserPlus, MessageCircle, Repeat, Award, Users, BookOpen, Timer, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../api';
import { useApp } from '../context/AppContext';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import Card from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';

const categoryColors = {
  Technology: 'from-blue-500 to-cyan-500',
  Design: 'from-purple-500 to-pink-500',
  Mathematics: 'from-emerald-500 to-teal-500',
  Languages: 'from-rose-500 to-orange-500',
  Music: 'from-indigo-500 to-violet-500',
  Marketing: 'from-orange-500 to-yellow-500',
  Business: 'from-amber-500 to-orange-500',
  'Personal Development': 'from-pink-500 to-rose-500',
};

const achievementIcons = {
  'First Skill Exchange': { icon: Star, color: 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400' },
  '7-Day Learning Streak': { icon: Flame, color: 'bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400' },
  'Helpful Mentor': { icon: Award, color: 'bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400' },
  'Skill Explorer': { icon: TrendingUp, color: 'bg-purple-100 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400' },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: 'easeOut' },
  }),
};

export default function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUserData, addToast, refreshUser } = useApp();

  const isOwnProfile = !userId || userId === currentUserData?.id;

  const [profileUser, setProfileUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('teach');
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [connectSent, setConnectSent] = useState(false);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (isOwnProfile) {
      setProfileUser(currentUserData);
      setUserStats(currentUserData?.stats || null);
      setLoading(false);
      return () => { cancelled = true };
    }

    setLoading(true);
    setError(null);
    Promise.all([
      api.users.get(userId),
      api.users.getReviews(userId),
    ])
      .then(([userData, reviewsData]) => {
        if (!cancelled) {
          setProfileUser(userData);
          setReviews(Array.isArray(reviewsData) ? reviewsData : reviewsData.reviews || []);
        }
      })
      .catch(err => {
        if (!cancelled) setError(err.message || 'Failed to load profile');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true };
  }, [userId, isOwnProfile, currentUserData]);

  useEffect(() => {
    if (!isOwnProfile || !currentUserData?.id) return;
    let cancelled = false;
    api.users.getStats()
      .then(data => {
        if (!cancelled) setUserStats(data);
      })
      .catch(() => {})
      .finally(() => {});
    return () => { cancelled = true };
  }, [isOwnProfile, currentUserData?.id]);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      await api.connections.create(profileUser.id);
      addToast('Connection request sent!', 'success');
      setConnectSent(true);
    } catch (err) {
      addToast(err.message || 'Failed to send request', 'error');
    } finally {
      setConnecting(false);
    }
  };

  const handleMessage = async () => {
    try {
      await api.messages.create(profileUser.id);
      navigate('/app/messages');
    } catch (err) {
      addToast(err.message || 'Failed to start conversation', 'error');
    }
  };

  const handleRequestExchange = () => {
    addToast('Skill exchange request sent!', 'success');
  };

  const startEditing = () => {
    setEditData({
      name: profileUser.name || '',
      bio: profileUser.bio || '',
      location: profileUser.location || '',
      availability: profileUser.availability || '',
    });
    setEditing(true);
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      await api.users.updateProfile(editData);
      addToast('Profile updated!', 'success');
      setEditing(false);
      if (isOwnProfile) await refreshUser();
    } catch (err) {
      addToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-surface-500 dark:text-surface-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">
            {error || 'User not found'}
          </h2>
          <p className="text-surface-500 dark:text-surface-400 mb-4">
            The profile you're looking for doesn't exist.
          </p>
          <Link to="/app/dashboard">
            <Button variant="primary">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const effectiveStats = isOwnProfile
    ? (userStats || currentUserData?.stats)
    : userStats || { totalExchanges: profileUser.totalExchanges || 0, learningHours: 0, streak: profileUser.streak || 0, rating: profileUser.rating || 0 };

  const skillsTeach = isOwnProfile ? currentUserData?.skillsTeach : profileUser.skillsTeach || [];
  const skillsLearn = isOwnProfile ? currentUserData?.skillsLearn : profileUser.skillsLearn || [];
  const achievementsList = isOwnProfile ? currentUserData?.achievements || [] : [];
  const joinDate = isOwnProfile ? currentUserData?.joinDate : profileUser.joinDate || '2024-01-15';

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-4"
        >
          <Link
            to={isOwnProfile ? '/app/dashboard' : '/app/explore'}
            className="inline-flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <ArrowLeft size={16} />
            {isOwnProfile ? 'Back to Dashboard' : 'Back to Explore'}
          </Link>
        </motion.div>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8"
        >
          {/* Banner */}
          <div className="h-48 sm:h-56 rounded-b-3xl bg-gradient-to-r from-primary-500 to-accent-500" />

          {/* Profile Info */}
          <div className="relative px-4 sm:px-8 -mt-16 sm:-mt-20">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
              {/* Avatar */}
              <div className="relative">
                <Avatar
                  name={profileUser.name}
                  src={profileUser.avatar}
                  size="xl"
                  ring
                  online={profileUser.online}
                  className="w-24 h-24 sm:w-32 sm:h-32"
                />
                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-surface-900" />
              </div>

              {/* Name & Details */}
              <div className="flex-1 pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    {editing ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editData.name}
                          onChange={e => setEditData(d => ({ ...d, name: e.target.value }))}
                          className="text-2xl sm:text-3xl font-bold bg-transparent border-b-2 border-primary-500 text-surface-900 dark:text-white outline-none w-full"
                          placeholder="Name"
                        />
                        <textarea
                          value={editData.bio}
                          onChange={e => setEditData(d => ({ ...d, bio: e.target.value }))}
                          className="w-full bg-surface-100 dark:bg-surface-800 rounded-lg p-2 text-sm text-surface-600 dark:text-surface-400 outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Bio"
                          rows={2}
                        />
                        <input
                          type="text"
                          value={editData.location}
                          onChange={e => setEditData(d => ({ ...d, location: e.target.value }))}
                          className="w-full bg-surface-100 dark:bg-surface-800 rounded-lg p-2 text-sm text-surface-600 dark:text-surface-400 outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Location"
                        />
                        <input
                          type="text"
                          value={editData.availability}
                          onChange={e => setEditData(d => ({ ...d, availability: e.target.value }))}
                          className="w-full bg-surface-100 dark:bg-surface-800 rounded-lg p-2 text-sm text-surface-600 dark:text-surface-400 outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Availability"
                        />
                      </div>
                    ) : (
                      <>
                        <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">
                          {profileUser.name}
                        </h1>
                        <p className="text-surface-600 dark:text-surface-400 mt-1 max-w-xl">
                          {profileUser.bio}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-surface-500 dark:text-surface-400">
                          <span className="flex items-center gap-1.5">
                            <MapPin size={14} />
                            {profileUser.location}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock size={14} />
                            {profileUser.availability}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar size={14} />
                            Joined {new Date(joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          <Badge variant="primary" dot>
                            {isOwnProfile ? currentUserData?.experienceLevel : 'Intermediate'}
                          </Badge>
                          <Badge variant={profileUser.online ? 'success' : 'default'} dot={profileUser.online}>
                            {profileUser.online ? 'Online' : 'Offline'}
                          </Badge>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {isOwnProfile ? (
                      editing ? (
                        <>
                          <Button
                            variant="primary"
                            onClick={saveProfile}
                            disabled={saving}
                            icon={Edit3}
                          >
                            {saving ? 'Saving...' : 'Save Changes'}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setEditing(false)}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button variant="primary" icon={Edit3} onClick={startEditing}>
                          Edit Profile
                        </Button>
                      )
                    ) : (
                      <>
                        <Button
                          variant="primary"
                          icon={UserPlus}
                          disabled={connectSent || connecting}
                          onClick={handleConnect}
                        >
                          {connectSent ? 'Request Sent' : connecting ? 'Sending...' : 'Connect'}
                        </Button>
                        <Button variant="secondary" icon={MessageCircle} onClick={handleMessage}>
                          Message
                        </Button>
                        <Button
                          variant="outline"
                          icon={Repeat}
                          onClick={handleRequestExchange}
                        >
                          Request Skill Exchange
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'Total Exchanges', value: effectiveStats?.totalExchanges ?? 0, icon: <Repeat size={20} />, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-500/15' },
            { label: 'Learning Hours', value: effectiveStats?.learningHours || '—', icon: <Timer size={20} />, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-500/15' },
            { label: 'Current Streak', value: `${effectiveStats?.streak ?? 0} days`, icon: <Flame size={20} />, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-500/15' },
            { label: 'Rating', value: effectiveStats?.rating ? `${effectiveStats.rating} ★` : '—', icon: <Star size={20} />, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-500/15' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 shadow-sm p-5"
            >
              <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-3`}>
                {stat.icon}
              </div>
              <div className="text-xl font-bold text-surface-900 dark:text-white">{stat.value}</div>
              <div className="text-sm text-surface-500 dark:text-surface-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Skills Section Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-6"
        >
          <div className="flex gap-2 bg-surface-100 dark:bg-surface-800 p-1 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab('teach')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'teach'
                  ? 'bg-white dark:bg-surface-900 text-surface-900 dark:text-white shadow-sm'
                  : 'text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300'
              }`}
            >
              Skills I Teach ({skillsTeach.length})
            </button>
            <button
              onClick={() => setActiveTab('learn')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'learn'
                  ? 'bg-white dark:bg-surface-900 text-surface-900 dark:text-white shadow-sm'
                  : 'text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300'
              }`}
            >
              Skills I'm Learning ({skillsLearn.length})
            </button>
          </div>
        </motion.div>

        {/* Skills I Teach */}
        {activeTab === 'teach' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {skillsTeach.map((skill, i) => (
                <motion.div
                  key={skill.id || skill.name}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                >
                  <Card hover className="relative overflow-hidden h-full">
                    <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${categoryColors[skill.category] || 'from-primary-500 to-accent-500'}`} />
                    <div className="pl-3">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-surface-900 dark:text-white">{skill.name}</h4>
                          <p className="text-sm text-surface-500 dark:text-surface-400">{skill.category}</p>
                        </div>
                        <Badge variant="primary">{skill.level}</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between text-surface-600 dark:text-surface-400">
                          <span className="flex items-center gap-1.5">
                            <Clock size={14} />
                            Experience
                          </span>
                          <span className="font-medium">{skill.experience || '2+ years'}</span>
                        </div>
                        <div className="flex items-center justify-between text-surface-600 dark:text-surface-400">
                          <span className="flex items-center gap-1.5">
                            <Users size={14} />
                            Learners Helped
                          </span>
                          <span className="font-medium">{skill.learnersHelped || 12}</span>
                        </div>
                        <div className="flex items-center justify-between text-surface-600 dark:text-surface-400">
                          <span className="flex items-center gap-1.5">
                            <Star size={14} />
                            Rating
                          </span>
                          <span className="font-medium text-amber-500">{skill.rating || 4.5} ★</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Skills I'm Learning */}
        {activeTab === 'learn' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {skillsLearn.map((skill, i) => (
                <motion.div
                  key={skill.id || skill.name}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                >
                  <Card hover className="h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-surface-900 dark:text-white">{skill.name}</h4>
                        <p className="text-sm text-surface-500 dark:text-surface-400">{skill.category}</p>
                      </div>
                      <Badge variant="accent">{skill.progress}%</Badge>
                    </div>
                    <ProgressBar
                      value={skill.progress}
                      size="md"
                      color={`bg-gradient-to-r ${categoryColors[skill.category] || 'from-primary-500 to-accent-500'}`}
                      showPercentage
                    />
                    {skill.goal && (
                      <p className="mt-3 text-sm text-surface-600 dark:text-surface-400">
                        <span className="font-medium">Goal:</span> {skill.goal}
                      </p>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="lg:col-span-1"
          >
            <Card>
              <h3 className="font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
                <Award size={20} className="text-primary-500" />
                Achievements
              </h3>
              <div className="space-y-3">
                {isOwnProfile ? (
                  achievementsList.map((achievement, i) => {
                    const config = achievementIcons[achievement] || { icon: Award, color: 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400' };
                    const Icon = config.icon;
                    return (
                      <motion.div
                        key={achievement}
                        custom={i}
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        className="flex items-center gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-700"
                      >
                        <div className={`w-10 h-10 rounded-full ${config.color} flex items-center justify-center flex-shrink-0`}>
                          <Icon size={18} />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-surface-900 dark:text-white">{achievement}</div>
                          <div className="text-xs text-emerald-600 dark:text-emerald-400">Earned</div>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <>
                    {['Skill Explorer', 'Helpful Mentor'].map((achievement, i) => {
                      const config = achievementIcons[achievement] || { icon: Award, color: 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400' };
                      const Icon = config.icon;
                      return (
                        <motion.div
                          key={achievement}
                          custom={i}
                          initial="hidden"
                          animate="visible"
                          variants={fadeUp}
                          className="flex items-center gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-700"
                        >
                          <div className={`w-10 h-10 rounded-full ${config.color} flex items-center justify-center flex-shrink-0`}>
                            <Icon size={18} />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-surface-900 dark:text-white">{achievement}</div>
                            <div className="text-xs text-emerald-600 dark:text-emerald-400">Earned</div>
                          </div>
                        </motion.div>
                      );
                    })}
                    {['30-Day Streak', 'Master Teacher'].map((achievement, i) => {
                      return (
                        <motion.div
                          key={achievement}
                          custom={i + 2}
                          initial="hidden"
                          animate="visible"
                          variants={fadeUp}
                          className="flex items-center gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-700 opacity-50"
                        >
                          <div className="w-10 h-10 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center flex-shrink-0">
                            <Award size={18} className="text-surface-400" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-surface-500 dark:text-surface-400">{achievement}</div>
                            <div className="text-xs text-surface-400 dark:text-surface-500">Locked</div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Recent Reviews */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card>
              <h3 className="font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
                <Star size={20} className="text-amber-500" />
                Recent Reviews
              </h3>
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((review, i) => (
                    <motion.div
                      key={review.id || i}
                      custom={i}
                      initial="hidden"
                      animate="visible"
                      variants={fadeUp}
                      className="p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-700"
                    >
                      <div className="flex items-start gap-3">
                        <Avatar name={review.user || review.reviewer?.name || 'User'} size="md" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-surface-900 dark:text-white">
                              {review.user || review.reviewer?.name || 'Anonymous'}
                            </span>
                            <span className="text-xs text-surface-400 dark:text-surface-500">
                              {review.date || 'Recently'}
                            </span>
                          </div>
                          <div className="flex items-center gap-0.5 mb-2">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <Star
                                key={idx}
                                size={14}
                                className={idx < (review.rating || 5) ? 'text-amber-400 fill-amber-400' : 'text-surface-300 dark:text-surface-600'}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-surface-600 dark:text-surface-400">
                            {review.text || review.content || ''}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-sm text-surface-400 dark:text-surface-500 text-center py-8">
                    No reviews yet
                  </p>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
