// src/pages/RegisterPage.jsx
import { useNavigate, Link } from 'react-router-dom';
import { RegisterForm } from '@/components/auth';
import ThemeToggle from '@/components/common/ThemeToggle';
import './AuthPages.css';

export default function RegisterPage() {
  const navigate = useNavigate();

  const handleRegisterSuccess = (result) => {
    const role = result.user.role;
    if (role === 'emprendedor') navigate('/emprendedor/dashboard');
    else navigate('/ciudadano/dashboard');
  };

  return (
    <div className="auth-layout auth-flipped">

      {/* Panel verde — derecha (por auth-flipped) */}
      <div className="auth-left">
        <div className="auth-left-inner">
          <div className="auth-orb auth-orb-1" />
          <div className="auth-orb auth-orb-2" />
          <div className="auth-orb auth-orb-3" />

          <Link to="/" className="auth-brand">
            <div className="auth-logo-mark">
              <svg width="15" height="15" viewBox="0 0 36 36" fill="none">
                <path d="M6 8C6 6.9 6.9 6 8 6H22C22 6 28 6 28 12V20" stroke="white" strokeWidth="3.4" strokeLinecap="round"/>
                <path d="M6 8V28C6 29.1 6.9 30 8 30H28" stroke="white" strokeWidth="3.4" strokeLinecap="round"/>
                <circle cx="25" cy="10" r="3" fill="white"/>
              </svg>
            </div>
            <span className="auth-brand-name">MECIA</span>
          </Link>

          <div className="auth-left-content">
            <h2 className="auth-left-title">Empieza con<br/><em>nosotros</em> hoy</h2>
            <p className="auth-left-desc">
              Completa estos pasos para crear tu cuenta y acceder a la inteligencia ciudadana de Medellín.
            </p>
            <div className="auth-steps">
              <div className="auth-step auth-step-active">
                <div className="auth-step-num">1</div>
                <span>Crea tu cuenta</span>
              </div>
              <div className="auth-step">
                <div className="auth-step-num">2</div>
                <span>Elige tu perfil ciudadano</span>
              </div>
              <div className="auth-step">
                <div className="auth-step-num">3</div>
                <span>Explora tu ciudad</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario — izquierda (por auth-flipped order:1) */}
      <div className="auth-right">
        {/* Botón tema — top izquierda del panel del formulario (flipped) */}
        <ThemeToggle className="auth-theme-panel-btn auth-theme-panel-btn--left" />

        <div className="auth-form-wrap">
          <div className="auth-form-header">
            <h1 className="auth-form-title">Crear Cuenta</h1>
            <p className="auth-form-subtitle">Ingresa tus datos para registrarte en MECIA.</p>
          </div>

          <div className="auth-social">
            <button className="auth-social-btn">
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button className="auth-social-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              Github
            </button>
          </div>

          <div className="auth-divider"><span>O</span></div>

          <RegisterForm onSuccess={handleRegisterSuccess} />

          <p className="auth-switch">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="auth-switch-link" viewTransition>
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}