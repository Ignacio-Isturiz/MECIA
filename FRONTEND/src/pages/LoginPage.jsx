// src/pages/LoginPage.jsx
// Página de Login

import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/auth';

/**
 * Página de Login
 * WIREFRAME: Solo estructura básica
 * TODO: Agregar estilos, logo, fondo, etc.
 */
export default function LoginPage() {
  const navigate = useNavigate();

  const handleLoginSuccess = (result) => {
    // Redirige según el rol del usuario
    const role = result.user.role;
    if (role === 'emprendedor') {
      navigate('/emprendedor/dashboard');
    } else {
      navigate('/ciudadano/dashboard');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '2rem' }}>
      <LoginForm onSuccess={handleLoginSuccess} />
    </div>
  );
}
