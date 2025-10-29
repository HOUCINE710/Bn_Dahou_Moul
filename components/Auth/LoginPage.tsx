import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { WrenchScrewdriverIcon } from '../ui/Icons';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAppContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(username, password);
    if (!success) {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-secondary to-accent p-4">
      <div className="w-full max-w-md bg-accent p-8 rounded-2xl shadow-2xl border border-accent-light transform transition-all hover:scale-105 duration-300">
        <div className="text-center mb-8">
            <WrenchScrewdriverIcon className="h-16 w-16 text-primary mx-auto mb-4"/>
            <h1 className="text-3xl font-bold text-text-main">BN DAHOU MOUL</h1>
            <p className="text-text-secondary mt-1">نظام إدارة الكراء</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-text-secondary text-sm font-bold mb-2" htmlFor="username">
              اسم المستخدم
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow-inner appearance-none border border-accent-light rounded-lg w-full py-3 px-4 bg-secondary text-text-main leading-tight focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
              required
            />
          </div>
          <div>
            <label className="block text-text-secondary text-sm font-bold mb-2" htmlFor="password">
              كلمة المرور
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow-inner appearance-none border border-accent-light rounded-lg w-full py-3 px-4 bg-secondary text-text-main leading-tight focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
              required
            />
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <div>
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-secondary font-bold py-3 px-6 rounded-lg w-full focus:outline-none focus:shadow-outline transition duration-300 transform hover:translate-y-[-2px]"
            >
              تسجيل الدخول
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;