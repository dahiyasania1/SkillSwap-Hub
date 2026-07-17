import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.innerWidth >= 768
  );

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return isDesktop;
}

export default function AppLayout() {
  const { sidebarCollapsed } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isDesktop = useIsDesktop();

  const marginLeft = isDesktop ? (sidebarCollapsed ? 72 : 260) : 0;

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div
        className="min-h-screen transition-[margin-left] duration-200 ease-in-out"
        style={{ marginLeft: `${marginLeft}px` }}
      >
        <Navbar onMenuToggle={() => setMobileMenuOpen((prev) => !prev)} />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
