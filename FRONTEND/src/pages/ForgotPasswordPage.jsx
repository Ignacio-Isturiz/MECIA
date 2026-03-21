// src/pages/ForgotPasswordPage.jsx
import { Link } from 'react-router-dom';
import { ForgotPasswordForm } from '@/components/auth';
import ThemeToggle from '@/components/common/ThemeToggle';
import './AuthPages.css';

export default function ForgotPasswordPage() {
  return (
    <div className="auth-reset-layout">
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />
      <ThemeToggle className="auth-theme-card-btn" />

      <div className="auth-reset-card">
        <Link to="/" className="auth-reset-brand">
          <div className="auth-logo-mark">
            <svg width="15" height="15" viewBox="0 0 36 36" fill="none">
              <path d="M6 8C6 6.9 6.9 6 8 6H22C22 6 28 6 28 12V20" stroke="white" strokeWidth="3.4" strokeLinecap="round"/>
              <path d="M6 8V28C6 29.1 6.9 30 8 30H28" stroke="white" strokeWidth="3.4" strokeLinecap="round"/>
              <circle cx="25" cy="10" r="3" fill="white"/>
            </svg>
          </div>
          <span className="auth-brand-name">MECIA</span>
        </Link>
        <div className="auth-reset-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="#00C896" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>
        <div className="auth-form-header" style={{textAlign:'center'}}>
          <h1 className="auth-form-title">Recuperar Contraseña</h1>
          <p className="auth-form-subtitle">Te enviaremos un enlace para restablecer tu contraseña.</p>
        </div>
        <ForgotPasswordForm />
        <p className="auth-switch" style={{marginTop:'16px'}}>
          <Link to="/login" className="auth-switch-link" viewTransition>
            Volver al inicio de sesión
          </Link>
        </p>
      </div>
    </div>
  );
}