import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, Sun, Moon, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const routeTitles = {
  '/app': 'Dashboard',
  '/app/explore': 'Explore Skills',
  '/app/my-skills': 'My Skills',
  '/app/matches': 'Skill Matches',
  '/app/connections': 'Connections',
  '/app/messages': 'Messages',
  '/app/progress': 'Learning Progress',
  '/app/community': 'Community',
  '/app/notifications': 'Notifications',
  '/app/settings': 'Settings',
};

export default function Navbar({ onMenuToggle, unreadCount = 3 }) {
  const { darkMode, toggleDarkMode, user, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const pageTitle = routeTitles[location.pathname] || 'SkillSwap Hub';

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 md:px-6
      bg-white/80 dark:bg-surface-900/80 backdrop-blur-md
      border-b border-surface-200 dark:border-surface-800">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg
            hover:bg-surface-100 dark:hover:bg-surface-800
            text-surface-600 dark:text-surface-400 transition-colors"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-1">
        <button className="flex items-center justify-center w-10 h-10 rounded-lg
          hover:bg-surface-100 dark:hover:bg-surface-800
          text-surface-600 dark:text-surface-400 transition-colors">
          <Search size={20} />
        </button>

        <button
          onClick={() => navigate('/app/notifications')}
          className="relative flex items-center justify-center w-10 h-10 rounded-lg
            hover:bg-surface-100 dark:hover:bg-surface-800
            text-surface-600 dark:text-surface-400 transition-colors"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] flex items-center justify-center
              bg-red-500 text-white text-[10px] font-bold rounded-full px-1">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={toggleDarkMode}
          className="flex items-center justify-center w-10 h-10 rounded-lg
            hover:bg-surface-100 dark:hover:bg-surface-800
            text-surface-600 dark:text-surface-400 transition-colors"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 ml-1 px-2 py-1.5 rounded-lg
              hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500
              flex items-center justify-center text-white text-xs font-semibold">
              {user?.initials || 'U'}
            </div>
            <ChevronDown
              size={16}
              className={`text-surface-500 dark:text-surface-400 transition-transform hidden sm:block
                ${dropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 py-2
              bg-white dark:bg-surface-800
              border border-surface-200 dark:border-surface-700
              rounded-xl shadow-lg">
              <div className="px-4 py-2 border-b border-surface-100 dark:border-surface-700 mb-1">
                <p className="text-sm font-medium text-surface-900 dark:text-surface-100">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-surface-500 dark:text-surface-400">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
              <button
                onClick={() => { navigate('/app/settings'); setDropdownOpen(false); }}
                className="w-full text-left px-4 py-2 text-sm text-surface-700 dark:text-surface-300
                  hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
              >
                Profile
              </button>
              <button
                onClick={() => { navigate('/app/settings'); setDropdownOpen(false); }}
                className="w-full text-left px-4 py-2 text-sm text-surface-700 dark:text-surface-300
                  hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
              >
                Settings
              </button>
              <button
                onClick={() => { logout(); setDropdownOpen(false); }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400
                  hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
