import { useState, useEffect } from 'react';
import { Sun, Moon, Monitor, Camera, Save, User, Mail, MapPin, Bell, Eye, EyeOff, Globe, Lock, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { api } from '../api';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Avatar from '../components/ui/Avatar';

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' },
  }),
};

function Toggle({ enabled, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`
        relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        ${enabled
          ? 'bg-primary-500'
          : 'bg-surface-300 dark:bg-surface-600'
        }
      `}
    >
      <span
        className={`
          absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200
          ${enabled ? 'translate-x-5' : 'translate-x-0'}
        `}
      />
    </button>
  );
}

export default function Settings() {
  const { user, darkMode, toggleDarkMode, addToast } = useApp();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [theme, setTheme] = useState(darkMode ? 'dark' : 'light');

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    onlineStatus: true,
    messagePermissions: 'everyone',
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    learningReminders: true,
    communityUpdates: false,
  });

  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await api.settings.get();
        if (data.profile) {
          setProfile({
            name: data.profile.name || user?.name || '',
            email: data.profile.email || user?.email || '',
            bio: data.profile.bio || user?.bio || '',
            location: data.profile.location || user?.location || '',
          });
        } else {
          setProfile({
            name: user?.name || '',
            email: user?.email || '',
            bio: user?.bio || '',
            location: user?.location || '',
          });
        }
        if (data.privacy) {
          setPrivacy(data.privacy);
        }
        if (data.notifications) {
          setNotifications(data.notifications);
        }
        if (data.theme) {
          setTheme(data.theme);
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
        setProfile({
          name: user?.name || '',
          email: user?.email || '',
          bio: user?.bio || '',
          location: user?.location || '',
        });
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, [user]);

  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handlePrivacyChange = (field, value) => {
    setPrivacy((prev) => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field, value) => {
    setNotifications((prev) => ({ ...prev, [field]: value }));
  };

  const handleThemeChange = async (selectedTheme) => {
    setTheme(selectedTheme);
    if (selectedTheme === 'dark' && !darkMode) {
      toggleDarkMode();
    } else if (selectedTheme === 'light' && darkMode) {
      toggleDarkMode();
    }
    try {
      await api.settings.update({ theme: selectedTheme });
    } catch (err) {
      console.error('Failed to save theme:', err);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await api.settings.update({ profile });
      addToast('Profile updated!');
    } catch (err) {
      console.error('Failed to save profile:', err);
      addToast('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePrivacy = async () => {
    setSaving(true);
    try {
      await api.settings.update({ privacy });
      addToast('Privacy settings updated!');
    } catch (err) {
      console.error('Failed to save privacy settings:', err);
      addToast('Failed to update privacy settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    try {
      await api.settings.update({ notifications });
      addToast('Notification settings updated!');
    } catch (err) {
      console.error('Failed to save notification settings:', err);
      addToast('Failed to update notification settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
            Settings
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">
            Manage your account preferences
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Account Settings */}
          <motion.div custom={0} initial="hidden" animate="visible" variants={fadeIn}>
            <Card>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
                  Account Settings
                </h2>
                <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                  Update your personal information
                </p>
              </div>

              {/* Profile Photo */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-surface-100 dark:border-surface-800">
                <Avatar name={user?.name || 'U'} size="xl" src={user?.avatar} />
                <div>
                  <Button variant="outline" size="sm" icon={Camera}>
                    Change Photo
                  </Button>
                  <p className="text-xs text-surface-400 dark:text-surface-500 mt-2">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => handleProfileChange('name', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                  Bio
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => handleProfileChange('bio', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => handleProfileChange('location', e.target.value)}
                  placeholder="City, Country"
                  className="w-full px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="flex justify-end">
                <Button variant="primary" icon={Save} onClick={handleSaveProfile} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Privacy Settings */}
          <motion.div custom={1} initial="hidden" animate="visible" variants={fadeIn}>
            <Card>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
                  Privacy Settings
                </h2>
                <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                  Control who can see your profile and activity
                </p>
              </div>

              <div className="space-y-5">
                {/* Profile Visibility */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center">
                      <Globe size={20} className="text-primary-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-surface-900 dark:text-white">
                        Profile Visibility
                      </p>
                      <p className="text-xs text-surface-500 dark:text-surface-400">
                        {privacy.profileVisibility === 'public' ? 'Anyone can view your profile' : 'Only connections can view your profile'}
                      </p>
                    </div>
                  </div>
                  <Toggle
                    enabled={privacy.profileVisibility === 'public'}
                    onChange={(val) => handlePrivacyChange('profileVisibility', val ? 'public' : 'private')}
                  />
                </div>

                {/* Online Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                      <Eye size={20} className="text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-surface-900 dark:text-white">
                        Online Status
                      </p>
                      <p className="text-xs text-surface-500 dark:text-surface-400">
                        {privacy.onlineStatus ? 'Others can see when you are online' : 'Your online status is hidden'}
                      </p>
                    </div>
                  </div>
                  <Toggle
                    enabled={privacy.onlineStatus}
                    onChange={(val) => handlePrivacyChange('onlineStatus', val)}
                  />
                </div>

                {/* Message Permissions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                      <Lock size={20} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-surface-900 dark:text-white">
                        Message Permissions
                      </p>
                      <p className="text-xs text-surface-500 dark:text-surface-400">
                        Control who can send you messages
                      </p>
                    </div>
                  </div>
                  <select
                    value={privacy.messagePermissions}
                    onChange={(e) => handlePrivacyChange('messagePermissions', e.target.value)}
                    className="px-3 py-2 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="everyone">Everyone</option>
                    <option value="connections">Connections Only</option>
                    <option value="nobody">Nobody</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-6 pt-6 border-t border-surface-100 dark:border-surface-800">
                <Button variant="primary" icon={Save} onClick={handleSavePrivacy} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Notification Settings */}
          <motion.div custom={2} initial="hidden" animate="visible" variants={fadeIn}>
            <Card>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
                  Notification Settings
                </h2>
                <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                  Choose how you want to be notified
                </p>
              </div>

              <div className="space-y-5">
                {/* Email Notifications */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
                      <Mail size={20} className="text-amber-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-surface-900 dark:text-white">
                        Email Notifications
                      </p>
                      <p className="text-xs text-surface-500 dark:text-surface-400">
                        Receive updates via email
                      </p>
                    </div>
                  </div>
                  <Toggle
                    enabled={notifications.emailNotifications}
                    onChange={(val) => handleNotificationChange('emailNotifications', val)}
                  />
                </div>

                {/* Push Notifications */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center">
                      <Bell size={20} className="text-purple-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-surface-900 dark:text-white">
                        Push Notifications
                      </p>
                      <p className="text-xs text-surface-500 dark:text-surface-400">
                        Receive push notifications on your device
                      </p>
                    </div>
                  </div>
                  <Toggle
                    enabled={notifications.pushNotifications}
                    onChange={(val) => handleNotificationChange('pushNotifications', val)}
                  />
                </div>

                {/* Learning Reminders */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                      <User size={20} className="text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-surface-900 dark:text-white">
                        Learning Reminders
                      </p>
                      <p className="text-xs text-surface-500 dark:text-surface-400">
                        Daily reminders to keep your streak going
                      </p>
                    </div>
                  </div>
                  <Toggle
                    enabled={notifications.learningReminders}
                    onChange={(val) => handleNotificationChange('learningReminders', val)}
                  />
                </div>

                {/* Community Updates */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-pink-50 dark:bg-pink-500/10 flex items-center justify-center">
                      <Users size={20} className="text-pink-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-surface-900 dark:text-white">
                        Community Updates
                      </p>
                      <p className="text-xs text-surface-500 dark:text-surface-400">
                        Get notified about community posts and activity
                      </p>
                    </div>
                  </div>
                  <Toggle
                    enabled={notifications.communityUpdates}
                    onChange={(val) => handleNotificationChange('communityUpdates', val)}
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6 pt-6 border-t border-surface-100 dark:border-surface-800">
                <Button variant="primary" icon={Save} onClick={handleSaveNotifications} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Appearance */}
          <motion.div custom={3} initial="hidden" animate="visible" variants={fadeIn}>
            <Card>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
                  Appearance
                </h2>
                <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                  Customize the look and feel of the app
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {/* Light Theme */}
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`
                    relative p-4 rounded-xl border-2 transition-all duration-200 text-center
                    ${theme === 'light'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10'
                      : 'border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 hover:border-surface-300 dark:hover:border-surface-600'
                    }
                  `}
                >
                  <Sun
                    size={24}
                    className={`mx-auto mb-2 ${
                      theme === 'light' ? 'text-primary-500' : 'text-surface-400 dark:text-surface-500'
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      theme === 'light'
                        ? 'text-primary-700 dark:text-primary-300'
                        : 'text-surface-600 dark:text-surface-300'
                    }`}
                  >
                    Light
                  </span>
                  {theme === 'light' && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary-500" />
                  )}
                </button>

                {/* Dark Theme */}
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`
                    relative p-4 rounded-xl border-2 transition-all duration-200 text-center
                    ${theme === 'dark'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10'
                      : 'border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 hover:border-surface-300 dark:hover:border-surface-600'
                    }
                  `}
                >
                  <Moon
                    size={24}
                    className={`mx-auto mb-2 ${
                      theme === 'dark' ? 'text-primary-500' : 'text-surface-400 dark:text-surface-500'
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      theme === 'dark'
                        ? 'text-primary-700 dark:text-primary-300'
                        : 'text-surface-600 dark:text-surface-300'
                    }`}
                  >
                    Dark
                  </span>
                  {theme === 'dark' && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary-500" />
                  )}
                </button>

                {/* System Theme */}
                <button
                  onClick={() => handleThemeChange('system')}
                  className={`
                    relative p-4 rounded-xl border-2 transition-all duration-200 text-center
                    ${theme === 'system'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10'
                      : 'border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 hover:border-surface-300 dark:hover:border-surface-600'
                    }
                  `}
                >
                  <Monitor
                    size={24}
                    className={`mx-auto mb-2 ${
                      theme === 'system' ? 'text-primary-500' : 'text-surface-400 dark:text-surface-500'
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      theme === 'system'
                        ? 'text-primary-700 dark:text-primary-300'
                        : 'text-surface-600 dark:text-surface-300'
                    }`}
                  >
                    System
                  </span>
                  {theme === 'system' && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary-500" />
                  )}
                </button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
