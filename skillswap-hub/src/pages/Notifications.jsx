import { useState, useEffect } from 'react';
import { UserPlus, Sparkles, MessageCircle, Clock, Heart, Award, UserCheck, Star, Bell, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { api } from '../api';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const iconMap = {
  UserPlus,
  Sparkles,
  MessageCircle,
  Clock,
  Heart,
  Award,
  UserCheck,
  Star,
};

const typeColors = {
  connection: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10',
  match: 'text-purple-500 bg-purple-50 dark:bg-purple-500/10',
  message: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10',
  reminder: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10',
  community: 'text-pink-500 bg-pink-50 dark:bg-pink-500/10',
  achievement: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10',
};

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'connection', label: 'Connection Requests' },
  { id: 'message', label: 'Messages' },
  { id: 'achievement', label: 'Achievements' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3, ease: 'easeOut' },
  }),
};

export default function Notifications() {
  const { addToast } = useApp();
  const [localNotifications, setLocalNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    try {
      setLoading(true);
      const data = await api.notifications.list();
      setLocalNotifications(Array.isArray(data) ? data : data.notifications || []);
    } catch (err) {
      console.error('Failed to load notifications:', err);
      addToast('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }

  const unreadCount = localNotifications.filter((n) => !n.read).length;

  const filteredNotifications = localNotifications.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    if (filter === 'connection') return n.type === 'connection';
    if (filter === 'message') return n.type === 'message';
    if (filter === 'achievement') return n.type === 'achievement';
    return true;
  });

  const handleMarkAsRead = async (id) => {
    setLocalNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      await api.notifications.markRead(id);
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
      setLocalNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: false } : n))
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    setLocalNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await api.notifications.markAllRead();
      addToast('All notifications marked as read');
    } catch (err) {
      console.error('Failed to mark all as read:', err);
      await fetchNotifications();
    }
  };

  const handleAcceptConnection = async (notificationId) => {
    try {
      await api.connections.accept(notificationId);
      await handleMarkAsRead(notificationId);
      addToast('Connection accepted!');
    } catch (err) {
      console.error('Failed to accept connection:', err);
      addToast('Failed to accept connection');
    }
  };

  const getTabCount = (tabId) => {
    if (tabId === 'all') return localNotifications.length;
    if (tabId === 'unread') return unreadCount;
    if (tabId === 'connection') return localNotifications.filter((n) => n.type === 'connection').length;
    if (tabId === 'message') return localNotifications.filter((n) => n.type === 'message').length;
    if (tabId === 'achievement') return localNotifications.filter((n) => n.type === 'achievement').length;
    return 0;
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
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
                Notifications
              </h1>
              <p className="text-surface-500 dark:text-surface-400 mt-1">
                Stay updated on your learning journey
              </p>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                icon={CheckCheck}
                onClick={handleMarkAllAsRead}
                className="text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/10"
              >
                Mark all as read
              </Button>
            )}
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex gap-1 p-1 bg-surface-100 dark:bg-surface-800 rounded-xl overflow-x-auto">
            {tabs.map((tab) => {
              const count = getTabCount(tab.id);
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`
                    relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 whitespace-nowrap
                    ${filter === tab.id
                      ? 'text-primary-700 dark:text-primary-300'
                      : 'text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200'
                    }
                  `}
                >
                  {filter === tab.id && (
                    <motion.div
                      layoutId="activeFilterTab"
                      className="absolute inset-0 bg-white dark:bg-surface-700 rounded-lg shadow-sm"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {tab.label}
                    {count > 0 && (
                      <span
                        className={`
                          text-xs px-1.5 py-0.5 rounded-full font-semibold
                          ${filter === tab.id
                            ? 'bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400'
                            : 'bg-surface-200 dark:bg-surface-600 text-surface-500 dark:text-surface-300'
                          }
                        `}
                      >
                        {count}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Notification List */}
        {!loading && (
          <AnimatePresence mode="wait">
            {filteredNotifications.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-4">
                  <Bell size={40} className="text-surface-300 dark:text-surface-600" />
                </div>
                <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-1">
                  No notifications
                </h3>
                <p className="text-sm text-surface-500 dark:text-surface-400 max-w-sm">
                  You're all caught up! New notifications will appear here.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={filter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-2"
              >
                {filteredNotifications.map((notification, i) => {
                  const Icon = iconMap[notification.icon] || Bell;
                  const colorClass = typeColors[notification.type] || typeColors.connection;

                  return (
                    <motion.div
                      key={notification.id}
                      custom={i}
                      initial="hidden"
                      animate="visible"
                      variants={fadeUp}
                      layout
                    >
                      <div
                        onClick={() => handleMarkAsRead(notification.id)}
                        className={`
                          relative flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200
                          border border-transparent
                          ${!notification.read
                            ? 'bg-primary-50 dark:bg-primary-500/5 border-l-4 border-l-primary-500'
                            : 'bg-white dark:bg-surface-900 hover:bg-surface-50 dark:hover:bg-surface-800 border-surface-100 dark:border-surface-800'
                          }
                        `}
                      >
                        {/* Icon */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}>
                          <Icon size={20} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${!notification.read ? 'font-semibold text-surface-900 dark:text-white' : 'text-surface-700 dark:text-surface-200'}`}>
                            {notification.text}
                          </p>
                          <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">
                            {notification.time}
                          </p>
                        </div>

                        {/* Unread Indicator */}
                        {!notification.read && (
                          <div className="absolute top-4 right-4">
                            <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />
                          </div>
                        )}

                        {/* Action Buttons for Connection Requests */}
                        {notification.type === 'connection' && notification.icon === 'UserPlus' && !notification.read && (
                          <div className="flex items-center gap-2 shrink-0">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAcceptConnection(notification.id);
                              }}
                            >
                              Accept
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                            >
                              View
                            </Button>
                          </div>
                        )}

                        {/* View Button for Messages */}
                        {notification.type === 'message' && !notification.read && (
                          <div className="shrink-0">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                            >
                              View
                            </Button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
