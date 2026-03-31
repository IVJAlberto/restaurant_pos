import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import Sidemenu from './components/Sidemenu/Sidemenu';
import InfoContainer from './components/InfoContainer/InfoContainer';
import MainLogo from '../../UI/MainLogo';
import MenuTogglerBtn from '../../UI/MenuTogglerBtn';
import MenuWrapper from './components/MenuWrapper/MenuWrapper';
import CheckoutBtn from '../../UI/CheckoutBtn';
import UserData from './components/userData/userData';
import ThemeToggler from './components/ThemeToggler/ThemeToggler';

const STORAGE_KEY = 'sidebar-collapsed';

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : false;
  });

  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
    console.log("click");
    
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const showCheckout = location.pathname === '/food_catalog';

  const sidebarClasses = `
    h-screen flex flex-col bg-zinc-200 dark:bg-stone-950 border-r border-zinc-300 dark:border-zinc-950
    transition-all duration-300 ease-in-out overflow-hidden
    ${isCollapsed ? 'w-20' : 'w-full md:w-72 lg:w-80'}
  `;

  return (
    <aside className={sidebarClasses}>
      <div className="flex h-24 items-center gap-3 px-2 bg-zinc-300 dark:bg-zinc-900">
        <div
          type="button"
          onClick={toggleSidebar}
          aria-expanded={!isCollapsed}
          aria-controls="sidebar-content"
          className="shrink-0 rounded-md p-2 hover:bg-zinc-400 dark:hover:bg-zinc-800 transition-colors"
        >
          <span className="sr-only">
            {isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          </span>
          <MenuTogglerBtn isMenuOpen={!isCollapsed} />
        </div>

        {!isCollapsed && (
          <div className="flex items-center justify-between w-full gap-3">
            <MainLogo />
            {showCheckout && <CheckoutBtn displayOnBig={false} />}
          </div>
        )}
      </div>

      <div id="sidebar-content" className="flex-1 overflow-y-auto">
        <MenuWrapper>
          <Sidemenu collapsed={isCollapsed} />
          {!isCollapsed && (
            <div>
              <div className="flex flex-row md:flex-col lg:flex-row mx-3 space-x-3 md:space-x-0 lg:space-x-3 space-y-0 md:space-y-3 lg:space-y-0 mb-3 lg:mb-0">
                <UserData />
                <ThemeToggler />
              </div>
              <InfoContainer />
            </div>
          )}
        </MenuWrapper>
      </div>
    </aside>
  );
};

export default Sidebar;