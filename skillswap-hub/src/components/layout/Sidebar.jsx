import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap,
  LayoutDashboard,
  Compass,
  BookOpen,
  Sparkles,
  Users,
  MessageCircle,
  BarChart3,
  Globe,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const navItems = [
  { to: '/app', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/app/explore', icon: Compass, label: 'Explore Skills' },
  { to: '/app/my-skills', icon: BookOpen, label: 'My Skills' },
  { to: '/app/matches', icon: Sparkles, label: 'Skill Matches' },
  { to: '/app/connections', icon: Users, label: 'Connections' },
  { to: '/app/messages', icon: MessageCircle, label: 'Messages' },
  { to: '/app/progress', icon: BarChart3, label: 'Learning Progress' },
  { to: '/app/community', icon: Globe, label: 'Community' },
  { to: '/app/notifications', icon: Bell, label: 'Notifications' },
  { to: '/app/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ mobileOpen, onCloseMobile }) {
  const { darkMode, sidebarCollapsed, setSidebarCollapsed, user } = useApp();

  const collapsed = sidebarCollapsed;

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className={`
          fixed left-0 top-0 h-screen z-40
          flex flex-col
          bg-white dark:bg-surface-900
          border-r border-surface-200 dark:border-surface-800
          transition-transform duration-200
          md:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-surface-200 dark:border-surface-800">
          {!collapsed && (
            <div className="flex items-center gap-2 min-w-0">
              <Zap className="w-6 h-6 text-primary-500 flex-shrink-0" />
              <span className="gradient-text text-lg font-bold whitespace-nowrap overflow-hidden">
                SkillSwap Hub
              </span>
            </div>
          )}
          {collapsed && (
            <Zap className="w-6 h-6 text-primary-500 mx-auto" />
          )}

          <button
            onClick={() => setSidebarCollapsed(!collapsed)}
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg
              hover:bg-surface-100 dark:hover:bg-surface-800
              text-surface-500 dark:text-surface-400
              transition-colors flex-shrink-0 ml-auto"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-colors relative
                ${
                  isActive
                    ? 'bg-primary-500/10 text-primary-500'
                    : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-100'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary-500" />
                  )}
                  <item.icon
                    size={20}
                    className="flex-shrink-0"
                  />
                  {!collapsed && (
                    <span className="whitespace-nowrap overflow-hidden">
                      {item.label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className={`border-t border-surface-200 dark:border-surface-800 p-3 ${collapsed ? 'px-2' : ''}`}>
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
              {user?.initials || 'U'}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-surface-900 dark:text-surface-100 truncate">
                  {user?.name || 'User'}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                  <p className="text-xs text-surface-500 dark:text-surface-400 truncate">
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
}
