import { useEffect, useState } from 'react';
import Header from './components/navbar';
import Sidebar from './components/sidebar';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Only run on client
    const isMobile = window.innerWidth < 768;
    console.log("Window width:", window.innerWidth, "| Mobile?", isMobile);
    if (isMobile) {
      setSidebarOpen(false); // Hide sidebar on mobile
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Full-width Header at the top */}
      <Header onToggleSidebar={toggleSidebar} />

      {/* Below Header: Sidebar + Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Static Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} />

        {/* Main content area */}
        <main className="flex-1 rounded-4xl overflow-auto p-4 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}

