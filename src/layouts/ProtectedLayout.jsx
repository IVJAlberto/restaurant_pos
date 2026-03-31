import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../modules/Sidebar/Sidebar';

const ProtectedLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(prev => !prev)}
      />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedLayout;