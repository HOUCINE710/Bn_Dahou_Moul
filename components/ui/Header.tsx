
import React from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { LogoutIcon, WrenchScrewdriverIcon } from './Icons';

const Header: React.FC = () => {
  const { currentUser, logout } = useAppContext();

  return (
    <header className="bg-accent p-4 shadow-lg flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <WrenchScrewdriverIcon className="h-8 w-8 text-primary"/>
        <h1 className="text-xl md:text-2xl font-bold text-white">BN DAHOU MOUL</h1>
      </div>
      {currentUser && (
        <div className="flex items-center space-x-4">
          <span className="hidden sm:inline text-text-secondary">
            مرحباً, <span className="font-bold text-text-main">{currentUser.username}</span> ({currentUser.role === 'MANAGER' ? 'مدير' : 'عامل'})
          </span>
          <button
            onClick={logout}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg transition duration-300"
            aria-label="Logout"
          >
            <LogoutIcon className="h-5 w-5" />
            <span className='hidden md:inline'>تسجيل الخروج</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
