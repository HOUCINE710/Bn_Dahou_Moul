
import React from 'react';
import { useAppContext } from './hooks/useAppContext';
import LoginPage from './components/Auth/LoginPage';
import Dashboard from './components/Dashboard/Dashboard';

const App: React.FC = () => {
  const { currentUser } = useAppContext();

  return (
    <div className="min-h-screen bg-secondary">
      {currentUser ? <Dashboard /> : <LoginPage />}
    </div>
  );
};

export default App;
