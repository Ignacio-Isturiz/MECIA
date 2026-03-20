// src/pages/CiudadanoDashboard.jsx
// Dashboard para ciudadanos

import { useEffect, useState } from 'react';
import authService from '@/services/authService';
import { useNavigate } from 'react-router-dom';

/**
 * Dashboard de Ciudadano
 * WIREFRAME: Solo estructura básica
 * TODO: Agregar noticias, chatbot de seguridad, módulos de servicios
 */
export default function CiudadanoDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await authService.getMe();
        setUser(userData);
      } catch (error) {
        console.error('Error cargando usuario:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <div>No autorizado</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            Hola, {user.full_name}
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#666' }}>
            Rol: <strong>{user.role}</strong>
          </p>
        </div>
        <button onClick={handleLogout} style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}>
          Cerrar Sesión
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
          <h2>Noticias de Medellín</h2>
          <p>TODO: Agregar feed de noticias locales</p>
        </div>

        <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
          <h2>Chatbot de Seguridad</h2>
          <p>TODO: Agregar chatbot para recomendaciones de seguridad</p>
        </div>

        <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
          <h2>Módulo de Servicios</h2>
          <p>TODO: Agregar facturación y recomendaciones de gastos</p>
        </div>

        <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
          <h2>Módulo de Seguridad</h2>
          <p>TODO: Agregar información de seguridad por zona</p>
        </div>
      </div>

      <div style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '1rem' }}>
        <h2>Acceso a Telegram</h2>
        <p>TODO: Agregar botón para acceder a la herramienta vía Telegram</p>
      </div>

      <div style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '1rem' }}>
        <h2>Historial de Conversaciones</h2>
        <p>TODO: Agregar vista del historial de chats</p>
      </div>
    </div>
  );
}
