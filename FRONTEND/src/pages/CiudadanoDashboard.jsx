// src/pages/CiudadanoDashboard.jsx

import { useEffect, useState } from 'react';
import authService from '@/services/authService';
import { useNavigate } from 'react-router-dom';
import CriminalidadDashboard from '@/components/CriminalidadDashboard';
import CitizenNewsSection from '@/components/CitizenNewsSection';
import ChatbotSeguridad from '@/components/ChatbotSeguridad';
import AnalizadorFactura from '@/components/AnalizadorFactura';

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
  { id: 'seguridad', label: 'Módulo Seguridad', icon: '🛡️' },
  { id: 'servicios', label: 'Módulo Servicios', icon: '⚡' },
];

function Sidebar({ active, onSelect, user, onLogout }) {
  return (
    <div style={{
      width: '220px',
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      borderRight: '1px solid #1e293b',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid #1e293b' }}>
        <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'white', letterSpacing: '0.05em' }}>MECIA</div>
        <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.15rem' }}>Medellín, Colombia</div>
      </div>

      {/* Usuario */}
      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #1e293b' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#e2e8f0' }}>{user?.full_name}</div>
        <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'capitalize' }}>{user?.role}</div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0.75rem 0' }}>
        {NAV.map(item => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.65rem 1.25rem',
              backgroundColor: active === item.id ? '#1e293b' : 'transparent',
              borderLeft: active === item.id ? '3px solid #3b82f6' : '3px solid transparent',
              color: active === item.id ? '#e2e8f0' : '#94a3b8',
              border: 'none',
              borderLeft: active === item.id ? '3px solid #3b82f6' : '3px solid transparent',
              cursor: 'pointer',
              fontSize: '0.85rem',
              textAlign: 'left',
              transition: 'all 0.15s',
            }}
          >
            <span style={{ fontSize: '1rem' }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #1e293b' }}>
        <button
          onClick={onLogout}
          style={{
            width: '100%',
            padding: '0.6rem',
            backgroundColor: '#7f1d1d',
            color: '#fca5a5',
            border: 'none',
            borderRadius: '0.4rem',
            cursor: 'pointer',
            fontSize: '0.82rem',
            fontWeight: '600',
          }}
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

function ModuleCard({ title, subtitle, children, fullWidth = false }) {
  return (
    <div style={{
      border: '1px solid #334155',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      gridColumn: fullWidth ? '1 / -1' : undefined,
    }}>
      <div style={{ padding: '1rem 1rem 0.5rem', borderBottom: '1px solid #334155' }}>
        <h2 style={{ margin: 0, fontSize: '1rem', color: '#e2e8f0' }}>{title}</h2>
        {subtitle && <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>{subtitle}</p>}
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  );
}

export default function CiudadanoDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState('dashboard');

  useEffect(() => {
    authService.getMe()
      .then(setUser)
      .catch(() => navigate('/login'))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => { authService.logout(); navigate('/login'); };

  if (loading) return <div style={{ color: 'white', padding: '2rem' }}>Cargando...</div>;
  if (!user) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f172a' }}>
      <Sidebar active={activeModule} onSelect={setActiveModule} user={user} onLogout={handleLogout} />

      {/* Contenido */}
      <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#f1f5f9' }}>
            {activeModule === 'dashboard' && `Hola, ${user.full_name}`}
            {activeModule === 'seguridad' && 'Módulo de Seguridad'}
            {activeModule === 'servicios' && 'Módulo de Servicios'}
          </h1>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', color: '#64748b' }}>
            {activeModule === 'dashboard' && 'Vista general de tu ciudad'}
            {activeModule === 'seguridad' && 'Consulta y analiza la seguridad en Medellín'}
            {activeModule === 'servicios' && 'Analiza tus facturas EPM y ahorra'}
          </p>
        </div>

        {/* DASHBOARD: vista completa */}
        {activeModule === 'dashboard' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <CitizenNewsSection />

            <ModuleCard title="Chatbot de Seguridad" subtitle="Consulta la seguridad de cualquier barrio o zona">
              <ChatbotSeguridad />
            </ModuleCard>

            <ModuleCard title="Análisis de Facturas EPM" subtitle="Sube tu factura y recibe recomendaciones de ahorro">
              <div style={{ padding: '1rem' }}>
                <AnalizadorFactura />
              </div>
            </ModuleCard>

            <ModuleCard title="Criminalidad por Comuna">
              <div style={{ padding: '1rem' }}>
                <CriminalidadDashboard />
              </div>
            </ModuleCard>
          </div>
        )}

        {/* SEGURIDAD */}
        {activeModule === 'seguridad' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <ModuleCard title="Chatbot de Seguridad" subtitle="Consulta la seguridad de cualquier barrio o zona de Medellín">
              <ChatbotSeguridad />
            </ModuleCard>

            <ModuleCard title="Criminalidad por Comuna" subtitle="Datos reales de criminalidad en las comunas de Medellín">
              <div style={{ padding: '1rem' }}>
                <CriminalidadDashboard />
              </div>
            </ModuleCard>
          </div>
        )}

        {/* SERVICIOS */}
        {activeModule === 'servicios' && (
          <div style={{ maxWidth: '700px' }}>
            <ModuleCard
              title="Análisis de Facturas EPM"
              subtitle="Sube una o varias fotos de tu factura y recibe recomendaciones de ahorro con predicción del próximo pago"
            >
              <div style={{ padding: '1.25rem' }}>
                <AnalizadorFactura />
              </div>
            </ModuleCard>
          </div>
        )}

      </div>
    </div>
  );
}
