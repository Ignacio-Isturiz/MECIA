// src/router/index.jsx
// Configuración de rutas de la aplicación

import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth';

// Páginas
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import EmprendedorDashboard from '@/pages/EmprendedorDashboard';
import CiudadanoDashboard from '@/pages/CiudadanoDashboard';

/**
 * Configuración de rutas
 * - Ruta raíz: Home con "Hola"
 * - Rutas públicas: login, register, forgot-password, reset-password
 * - Rutas protegidas: dashboards
 */
export const router = createBrowserRouter([
  // Ruta inicial - Home
  {
    path: '/',
    element: <HomePage />
  },

  // Rutas públicas de autenticación
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/register',
    element: <RegisterPage />
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage />
  },

  // Rutas protegidas para emprendedor
  {
    path: '/emprendedor/dashboard',
    element: (
      <ProtectedRoute>
        <EmprendedorDashboard />
      </ProtectedRoute>
    )
  },

  // Rutas protegidas para ciudadano
  {
    path: '/ciudadano/dashboard',
    element: (
      <ProtectedRoute>
        <CiudadanoDashboard />
      </ProtectedRoute>
    )
  }
]);

export default router;
