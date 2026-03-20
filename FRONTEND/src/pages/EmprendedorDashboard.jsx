// src/pages/EmprendedorDashboard.jsx
// Dashboard para emprendedores

import { useEffect, useState } from 'react';
import authService from '@/services/authService';
import { useNavigate } from 'react-router-dom';

/**
 * Dashboard de Emprendedor
 * WIREFRAME: Solo estructura básica
 * TODO: Agregar chatbot, mapas, gráficas, información de zonas
 */
export default function EmprendedorDashboard() {
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

      <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
        <h2>Chatbot de Clasificación</h2>
        <p>TODO: Agregar chatbot para clasificar tipo de negocio</p>
      </div>

      <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
        <h2>Mapa de Zonas</h2>
        <p>TODO: Agregar mapa interactivo con recomendaciones de zonas</p>
      </div>

      <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
        <h2>Análisis de Datos</h2>
        <p>TODO: Agregar gráficas con información de seguridad y servicios</p>
      </div>

      <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
        <h2>Información de Negocios Cercanos</h2>
        <p>TODO: Agregar información de negocios similares en la zona</p>
      </div>
    </div>
  );
}
