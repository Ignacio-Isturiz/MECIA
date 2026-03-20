// src/pages/RegisterPage.jsx
// Página de Registro

import { useNavigate } from 'react-router-dom';
import { RegisterForm } from '@/components/auth';

/**
 * Página de Registro
 * WIREFRAME: Solo estructura básica
 * TODO: Agregar estilos, descripción de roles, etc.
 */
export default function RegisterPage() {
  const navigate = useNavigate();

  const handleRegisterSuccess = (result) => {
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
      <RegisterForm onSuccess={handleRegisterSuccess} />
    </div>
  );
}
