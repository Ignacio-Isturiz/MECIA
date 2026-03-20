// src/pages/ForgotPasswordPage.jsx
// Página para solicitar reset de contraseña

import { ForgotPasswordForm } from '@/components/auth';

/**
 * Página de Solicitud de Reset de Contraseña
 * WIREFRAME: Solo estructura básica
 * TODO: Agregar estilos y feedback visual
 */
export default function ForgotPasswordPage() {
  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '2rem' }}>
      <ForgotPasswordForm />
    </div>
  );
}
