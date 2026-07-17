import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, UserPlus, Search, MessageCircle, Eye, Trash2, Check, X, Sparkles, UserX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { api } from '../api';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import Card from '../components/ui/Card';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: 'easeOut' },
  }),
};

const slideIn = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.08, duration: 0.3, ease: 'easeOut' },
  }),
};

export default function Connections() {
  const { user, addToast } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [connections, setConnections] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [suggestedConnections, setSuggestedConnections] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [removingId, setRemovingId] = useState(null);
  const [loadingConnections, setLoadingConnections] = useState(true);
  const [loadingPending, setLoadingPending] = useState(true);
  const [loadingSuggested, setLoadingSuggested] = useState(true);

  const tabs = [
    { label: 'All Connections', count: connections.length },
    { label: 'Pending Requests', count: pendingRequests.length },
    { label: 'Suggested Connections', count: suggestedConnections.length },
  ];

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    await Promise.all([fetchConnections(), fetchPending(), fetchSuggested()]);
  };

  const fetchConnections = async () => {
    try {
      setLoadingConnections(true);
      const data = await api.connections.list('accepted');
      setConnections(Array.isArray(data) ? data : data.connections || []);
    } catch (err) {
      addToast(err.message || 'Failed to load connections', 'error');
    } finally {
      setLoadingConnections(false);
    }
  };

  const fetchPending = async () => {
    try {
      setLoadingPending(true);
      const data = await api.connections.pending();
      setPendingRequests(Array.isArray(data) ? data : data.connections || []);
    } catch (err) {
      addToast(err.message || 'Failed to load pending requests', 'error');
    } finally {
      setLoadingPending(false);
    }
  };

  const fetchSuggested = async () => {
    try {
      setLoadingSuggested(true);
      const data = await api.connections.suggested();
      setSuggestedConnections(Array.isArray(data) ? data : data.connections || []);
    } catch (err) {
      addToast(err.message || 'Failed to load suggestions', 'error');
    } finally {
      setLoadingSuggested(false);
    }
  };

  const handleAccept = async (connectionId) => {
    try {
      await api.connections.accept(connectionId);
      addToast('Connection accepted!');
      await Promise.all([fetchConnections(), fetchPending()]);
    } catch (err) {
      addToast(err.message || 'Failed to accept connection', 'error');
    }
  };

  const handleReject = async (connectionId) => {
    try {
      await api.connections.reject(connectionId);
      addToast('Request declined');
      await fetchPending();
    } catch (err) {
      addToast(err.message || 'Failed to reject connection', 'error');
    }
  };

  const handleConnect = async (userId) => {
    try {
      await api.connections.create(userId);
      setSentRequests(prev => [...prev, userId]);
      addToast('Connection request sent!');
    } catch (err) {
      addToast(err.message || 'Failed to send request', 'error');
    }
  };

  const handleRemove = async (connectionId) => {
    setRemovingId(connectionId);
    try {
      await api.connections.remove(connectionId);
      setConnections(prev => prev.filter(u => u.id !== connectionId && u.connectionId !== connectionId));
      addToast('Connection removed');
    } catch (err) {
      addToast(err.message || 'Failed to remove connection', 'error');
    } finally {
      setRemovingId(null);
    }
  };

  const handleMessage = async (userId) => {
    try {
      const data = await api.messages.create(userId);
      navigate('/app/messages');
    } catch (err) {
      addToast(err.message || 'Failed to start conversation', 'error');
    }
  };

  const isLoadingTab = (idx) => {
    if (idx === 0) return loadingConnections;
    if (idx === 1) return loadingPending;
    if (idx === 2) return loadingSuggested;
    return false;
  };

  const userSkillsTeach = user?.skillsTeach?.map(s => s.name?.toLowerCase()) || [];
  const userSkillsLearn = user?.skillsLearn?.map(s => s.name?.toLowerCase()) || [];

  function getCompatibility(otherUser) {
    const teachA = userSkillsTeach;
    const learnB = (otherUser.skillsLearn || otherUser.skillsToLearn || []).map(s => (s.name || s).toLowerCase());
    const teachB = (otherUser.skillsTeach || otherUser.skillsToTeach || []).map(s => (s.name || s).toLowerCase());
    const learnA = userSkillsLearn;

    const aTeachesWhatBWants = teachA.filter(s => learnB.includes(s)).length;
    const bTeachesWhatAWants = teachB.filter(s => learnA.includes(s)).length;

    const totalPossible = Math.max(teachA.length + teachB.length, 1);
    const matched = aTeachesWhatBWants + bTeachesWhatAWants;
    return Math.min(Math.round((matched / totalPossible) * 100) + 60, 98);
  }

  function getMutualSkills(otherUser) {
    const teachA = userSkillsTeach;
    const learnB = (otherUser.skillsLearn || otherUser.skillsToLearn || []).map(s => s.name || s);
    const teachB = (otherUser.skillsTeach || otherUser.skillsToTeach || []).map(s => s.name || s);
    const learnA = userSkillsLearn;

    const mutual = [];
    teachA.forEach(s => { if (learnB.map(l => l.toLowerCase()).includes(s)) mutual.push(s); });
    teachB.forEach(s => { if (learnA.includes(s.toLowerCase())) mutual.push(s); });
    return mutual;
  }

  function getSuggestionReason(otherUser) {
    const teachA = userSkillsTeach;
    const learnB = (otherUser.skillsLearn || otherUser.skillsToLearn || []).map(s => (s.name || s).toLowerCase());
    const teachB = (otherUser.skillsTeach || otherUser.skillsToTeach || []).map(s => (s.name || s).toLowerCase());
    const learnA = userSkillsLearn;

    const canTeach = teachA.filter(s => learnB.includes(s));
    const canLearn = teachB.filter(s => learnA.includes(s));

    if (canTeach.length && canLearn.length) {
      return `You can teach ${canTeach[0]} and learn ${canLearn[0]}`;
    }
    if (canLearn.length) {
      return `You both want to learn ${canLearn[0]}`;
    }
    if (canTeach.length) {
      return `${otherUser.name} wants to learn ${canTeach[0]}`;
    }
    return 'Shared interests and complementary skills';
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
                Connections
              </h1>
              <p className="text-surface-500 dark:text-surface-400 mt-1">
                Build your learning network
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400">
              <Users size={18} />
              <span className="font-medium">{connections.length} connected</span>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-1 p-1 bg-surface-100 dark:bg-surface-800 rounded-xl w-fit">
            {tabs.map((tab, idx) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(idx)}
                className={`
                  relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                  ${activeTab === idx
                    ? 'text-primary-700 dark:text-primary-300'
                    : 'text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200'
                  }
                `}
              >
                {activeTab === idx && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white dark:bg-surface-700 rounded-lg shadow-sm"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {tab.label}
                  <span className={`
                    text-xs px-1.5 py-0.5 rounded-full font-semibold
                    ${activeTab === idx
                      ? 'bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400'
                      : 'bg-surface-200 dark:bg-surface-600 text-surface-500 dark:text-surface-300'
                    }
                  `}>
                    {tab.count}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 0 && (
            <motion.div
              key="all"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {loadingConnections ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                </div>
              ) : connections.length === 0 ? (
                <EmptyState
                  icon={<Users size={48} className="text-surface-300 dark:text-surface-600" />}
                  title="No connections yet"
                  message="Start connecting with learners and teachers to build your network."
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {connections.map((conn, i) => {
                    const connUser = conn.connectedUser || conn.user || conn;
                    return (
                      <motion.div
                        key={conn.id || connUser.id}
                        custom={i}
                        initial="hidden"
                        animate={removingId === (conn.id || connUser.id) ? 'hidden' : 'visible'}
                        variants={fadeUp}
                        layout
                      >
                        <Card hover className="h-full">
                          <div className="flex items-start gap-3 mb-3">
                            <Avatar
                              name={connUser.name}
                              size="lg"
                              online={connUser.online}
                            />
                            <div className="flex-1 min-w-0">
                              <Link
                                to={`/app/profile/${connUser.id}`}
                                className="text-sm font-semibold text-surface-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors truncate block"
                              >
                                {connUser.name}
                              </Link>
                              <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5 line-clamp-2">
                                {connUser.bio}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {(connUser.skillsTeach || connUser.skillsToTeach || []).slice(0, 3).map((skill, idx) => (
                              <Badge key={skill.name || skill || idx} variant="primary" className="text-[11px]">
                                {skill.name || skill}
                              </Badge>
                            ))}
                            {(connUser.skillsTeach || connUser.skillsToTeach || []).length > 3 && (
                              <Badge variant="default" className="text-[11px]">
                                +{(connUser.skillsTeach || connUser.skillsToTeach || []).length - 3} more
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-1.5">
                              <Sparkles size={14} className="text-amber-500" />
                              <span className="text-xs font-medium text-surface-600 dark:text-surface-300">
                                {getCompatibility(connUser)}% match
                              </span>
                            </div>
                            <span className={`text-xs font-medium ${connUser.online ? 'text-emerald-600 dark:text-emerald-400' : 'text-surface-400 dark:text-surface-500'}`}>
                              {connUser.online ? 'Online' : 'Offline'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="primary"
                              size="sm"
                              icon={MessageCircle}
                              className="flex-1"
                              onClick={() => handleMessage(connUser.id)}
                            >
                              Message
                            </Button>
                            <Link to={`/app/profile/${connUser.id}`} className="flex-1">
                              <Button variant="outline" size="sm" icon={Eye} className="w-full">
                                View Profile
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={Trash2}
                              onClick={() => handleRemove(conn.id || connUser.id)}
                              className="text-surface-400 hover:text-red-500 dark:hover:text-red-400"
                            />
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 1 && (
            <motion.div
              key="pending"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-3"
            >
              {loadingPending ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                </div>
              ) : pendingRequests.length === 0 ? (
                <EmptyState
                  icon={<UserPlus size={48} className="text-surface-300 dark:text-surface-600" />}
                  title="No pending requests"
                  message="You're all caught up! New connection requests will appear here."
                />
              ) : (
                pendingRequests.map((conn, i) => {
                  const pendingUser = conn.fromUser || conn.user || conn;
                  const mutual = getMutualSkills(pendingUser);
                  return (
                    <motion.div
                      key={conn.id || pendingUser.id}
                      custom={i}
                      initial="hidden"
                      animate="visible"
                      variants={slideIn}
                      exit={{ opacity: 0, x: -40 }}
                      layout
                    >
                      <Card className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <Avatar name={pendingUser.name} size="lg" online={pendingUser.online} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Link
                              to={`/app/profile/${pendingUser.id}`}
                              className="text-sm font-semibold text-surface-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                            >
                              {pendingUser.name}
                            </Link>
                            {mutual.length > 0 && (
                              <Badge variant="accent" dot className="text-[11px]">
                                {mutual.length} mutual skill{mutual.length > 1 ? 's' : ''}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-surface-500 dark:text-surface-400 mt-1 line-clamp-2">
                            {pendingUser.bio}
                          </p>
                          {mutual.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {mutual.map((skill, idx) => (
                                <Badge key={idx} variant="success" className="text-[11px]">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <Button
                            variant="primary"
                            size="sm"
                            icon={Check}
                            onClick={() => handleAccept(conn.id || pendingUser.id)}
                            className="flex-1 sm:flex-none"
                          >
                            Accept
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            icon={X}
                            onClick={() => handleReject(conn.id || pendingUser.id)}
                            className="flex-1 sm:flex-none text-red-500 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-500/10"
                          >
                            Reject
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          )}

          {activeTab === 2 && (
            <motion.div
              key="suggested"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-3"
            >
              {loadingSuggested ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                </div>
              ) : suggestedConnections.length === 0 ? (
                <EmptyState
                  icon={<Sparkles size={48} className="text-surface-300 dark:text-surface-600" />}
                  title="No suggestions available"
                  message="Complete your profile to get personalized connection suggestions."
                />
              ) : (
                suggestedConnections.map((suggestedUser, i) => {
                  const reason = getSuggestionReason(suggestedUser);
                  const overlap = getMutualSkills(suggestedUser);
                  const isPending = sentRequests.includes(suggestedUser.id);
                  return (
                    <motion.div
                      key={suggestedUser.id}
                      custom={i}
                      initial="hidden"
                      animate="visible"
                      variants={slideIn}
                      exit={{ opacity: 0, x: -40 }}
                      layout
                    >
                      <Card className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <Avatar name={suggestedUser.name} size="lg" online={suggestedUser.online} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Link
                              to={`/app/profile/${suggestedUser.id}`}
                              className="text-sm font-semibold text-surface-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                            >
                              {suggestedUser.name}
                            </Link>
                            <Badge variant="warning" className="text-[11px]">
                              {getCompatibility(suggestedUser)}% match
                            </Badge>
                          </div>
                          <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
                            <span className="font-medium text-surface-600 dark:text-surface-300">Why we suggest:</span>{' '}
                            {reason}
                          </p>
                          {overlap.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {overlap.map((skill, idx) => (
                                <Badge key={idx} variant="primary" className="text-[11px]">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          {isPending ? (
                            <Button variant="secondary" size="sm" disabled className="flex-1 sm:flex-none">
                              Pending
                            </Button>
                          ) : (
                            <Button
                              variant="primary"
                              size="sm"
                              icon={UserPlus}
                              onClick={() => handleConnect(suggestedUser.id)}
                              className="flex-1 sm:flex-none"
                            >
                              Connect
                            </Button>
                          )}
                          {!isPending && (
                            <Link to={`/app/profile/${suggestedUser.id}`} className="flex-1 sm:flex-none">
                              <Button variant="outline" size="sm" icon={Eye} className="w-full">
                                View Profile
                              </Button>
                            </Link>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function EmptyState({ icon, title, message }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-1">
        {title}
      </h3>
      <p className="text-sm text-surface-500 dark:text-surface-400 max-w-sm">
        {message}
      </p>
    </motion.div>
  );
}
