import { useState } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';

export default function AuthPage() {
  const [isRegistering, setIsRegistering] = useState(false);

  if (isRegistering) {
    return <Register onToggleForm={() => setIsRegistering(false)} />;
  }
  return <Login onToggleForm={() => setIsRegistering(true)} />;
}