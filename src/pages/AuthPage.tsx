import { useState } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';
import ForgotPassword from '../components/ForgotPassword';

export default function AuthPage() {
  const [view, setView] = useState<'login' | 'register' | 'forgot'>('login');

  if (view === 'register') {
    return <Register onToggleForm={() => setView('login')} />;
  }
  if (view === 'forgot') {
    return <ForgotPassword onBack={() => setView('login')} />;
  }
  return <Login onToggleForm={() => setView('register')} onForgot={() => setView('forgot')} />;
}
