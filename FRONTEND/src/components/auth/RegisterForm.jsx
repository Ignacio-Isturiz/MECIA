// src/components/auth/RegisterForm.jsx
// Wireframe: Formulario de Registro

import { useState } from 'react';
import authService from '@/services/authService';

/**
 * Componente de Registro
 * WIREFRAME: Solo tiene la estructura básica
 * TODO: Agregar estilos Tailwind, validaciones avanzadas y feedback visual
 */
export default function RegisterForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    password: '',
    passwordConfirm: '',
    role: 'ciudadano'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validación básica
    if (formData.password !== formData.passwordConfirm) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (formData.password.length > 72) {
      setError('La contraseña no puede exceder 72 caracteres');
      return;
    }

    setLoading(true);

    try {
      const result = await authService.register({
        email: formData.email,
        full_name: formData.full_name,
        password: formData.password,
        role: formData.role
      });
      onSuccess?.(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Crear Cuenta</h2>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="tu@email.com"
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="full_name">Nombre Completo:</label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
            placeholder="Juan Pérez"
            minLength="2"
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="role">¿Eres emprendedor o ciudadano?</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="ciudadano">Ciudadano</option>
            <option value="emprendedor">Emprendedor</option>
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="••••••••"
            minLength="8"
            maxLength="72"
          />
          <small>Mínimo 8 caracteres, máximo 72</small>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="passwordConfirm">Confirma tu Contraseña:</label>
          <input
            type="password"
            id="passwordConfirm"
            name="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleChange}
            required
            placeholder="••••••••"
            minLength="8"
            maxLength="72"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Creando cuenta...' : 'Registrarse'}
        </button>
      </form>

      <p>
        ¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a>
      </p>
    </div>
  );
}
