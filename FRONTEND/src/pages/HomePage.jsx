// src/pages/HomePage.jsx
// Página de inicio - Bienvenida simple

/**
 * Página Home
 * Muestra un simple "Hola" de bienvenida
 */
export default function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '2rem'
    }}>
      <h1 style={{ fontSize: '4rem', fontWeight: 'bold' }}>Hola</h1>
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        <a href="/login" style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#3b82f6',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '0.5rem',
          fontWeight: 'bold'
        }}>
          Iniciar Sesión
        </a>
        <a href="/register" style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#10b981',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '0.5rem',
          fontWeight: 'bold'
        }}>
          Registrarse
        </a>
      </div>
    </div>
  );
}
