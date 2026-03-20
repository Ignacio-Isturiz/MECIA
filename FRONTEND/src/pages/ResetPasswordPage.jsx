// src/pages/ResetPasswordPage.jsx
// Página para confirmar reset de contraseña

import { useNavigate } from 'react-router-dom';
import { ResetPasswordForm } from '@/components/auth';

/**
 * Página de Confirmación de Reset de Contraseña
 * WIREFRAME: Solo estructura básica
 * TODO: Agregar estilos
 */
export default function ResetPasswordPage() {
  const navigate = useNavigate();

  const handleResetSuccess = () => {
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '2rem' }}>
      <ResetPasswordForm onSuccess={handleResetSuccess} />
    </div>
  );
}
