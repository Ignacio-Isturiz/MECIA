// src/components/dashboard/DashboardLayout.jsx
// Layout compartido para todos los dashboards de MECIA
// Sidebar colapsable · Glassmorphism · Fondo Medellín día/noche

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';
import '@/pages/Dashboard.css';

/* ── SVG ICONS (sin emojis) ── */
export const Icons = {
  Dashboard: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  ),
  Shield: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  Bolt: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  MapPin: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  News: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0-1.414 1.914"/>
      <path d="M8 6h8M8 10h8M8 14h4"/>
    </svg>
  ),
  Chart: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6"  y1="20" x2="6"  y2="14"/>
      <line x1="2"  y1="20" x2="22" y2="20"/>
    </svg>
  ),
  Building: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="15" rx="2"/>
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
      <line x1="12" y1="12" x2="12" y2="12.01"/>
    </svg>
  ),
  Store: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  ),
  Settings: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
    </svg>
  ),
  LogOut: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  ChevronLeft: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
  Bell: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Sun: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    </svg>
  ),
  Moon: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  ),
};

/**
 * DashboardLayout
 * @param {object} user        — datos del usuario logueado
 * @param {array}  navItems    — [{ id, label, icon: <IconComponent> }]
 * @param {string} activeItem  — id del item activo
 * @param {func}   onSelect    — callback al seleccionar nav item
 * @param {func}   onLogout    — callback logout
 * @param {string} pageTitle   — título de la página actual
 * @param {string} pageSubtitle
 * @param {string} breadcrumb  — ej: "Ciudadano / Seguridad"
 * @param {node}   children    — contenido del dashboard
 */
export default function DashboardLayout({
  user,
  navItems = [],
  activeItem,
  onSelect,
  onLogout,
  pageTitle,
  pageSubtitle,
  breadcrumb,
  children,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const { theme, toggle: toggleTheme } = useTheme();

  const initials = user?.full_name
    ? user.full_name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <>
      {/* Fondo Medellín (día/noche según tema) */}
      <div className="db-bg" />

      <div className="db-layout">

        {/* ── SIDEBAR ── */}
        <aside className={`db-sidebar${collapsed ? ' collapsed' : ''}`}>

          {/* Header: logo + toggle */}
          <div className="db-sidebar-header">
            <Link to="/" className="db-logo">
              <div className="db-logo-mark">
                <svg width="14" height="14" viewBox="0 0 36 36" fill="none">
                  <path d="M6 8C6 6.9 6.9 6 8 6H22C22 6 28 6 28 12V20" stroke="white" strokeWidth="3.4" strokeLinecap="round"/>
                  <path d="M6 8V28C6 29.1 6.9 30 8 30H28" stroke="white" strokeWidth="3.4" strokeLinecap="round"/>
                  <circle cx="25" cy="10" r="3" fill="white"/>
                </svg>
              </div>
              <span className="db-logo-text">MECIA</span>
            </Link>
            <button
              className="db-toggle-btn"
              onClick={() => setCollapsed(c => !c)}
              title={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
            >
              <Icons.ChevronLeft />
            </button>
          </div>

          {/* User */}
          <div className="db-sidebar-user">
            <div className="db-user-avatar">{initials}</div>
            <div className="db-user-info">
              <div className="db-user-name">{user?.full_name}</div>
              <div className="db-user-role">{user?.role}</div>
            </div>
          </div>

          {/* Nav */}
          <nav className="db-nav">
            {!collapsed && <div className="db-nav-section">Navegación</div>}
            {navItems.map(item => (
              <button
                key={item.id}
                className={`db-nav-item${activeItem === item.id ? ' active' : ''}`}
                onClick={() => onSelect(item.id)}
                title={collapsed ? item.label : undefined}
              >
                <span className="db-nav-icon">
                  {item.icon}
                </span>
                <span className="db-nav-label">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="db-sidebar-footer">
            <button
              className="db-nav-item"
              onClick={toggleTheme}
              title={collapsed ? (theme === 'dark' ? 'Modo claro' : 'Modo oscuro') : undefined}
            >
              <span className="db-nav-icon">
                {theme === 'dark' ? <Icons.Sun /> : <Icons.Moon />}
              </span>
              <span className="db-nav-label">
                {theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
              </span>
            </button>

            <button
              className="db-logout-btn"
              onClick={onLogout}
              title={collapsed ? 'Cerrar Sesión' : undefined}
            >
              <span className="db-nav-icon">
                <Icons.LogOut />
              </span>
              <span className="db-nav-label">Cerrar Sesión</span>
            </button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div className="db-main">

          {/* Topbar */}
          <header className="db-topbar">
            <div className="db-breadcrumb">
              <span>MECIA</span>
              <div className="db-breadcrumb-sep" />
              <span className="db-breadcrumb-current">
                {breadcrumb || pageTitle}
              </span>
            </div>

            <div className="db-topbar-right">
              <button className="db-icon-btn" title="Buscar">
                <Icons.Search />
              </button>
              <button className="db-icon-btn" title="Notificaciones">
                <Icons.Bell />
              </button>
              <div
                className="db-user-avatar"
                style={{width:32, height:32, fontSize:11, borderRadius:9, cursor:'default'}}
                title={user?.full_name}
              >
                {initials}
              </div>
            </div>
          </header>

          {/* Contenido */}
          <main className="db-content">
            {(pageTitle || pageSubtitle) && (
              <div className="db-page-header">
                {pageTitle && <h1 className="db-page-title">{pageTitle}</h1>}
                {pageSubtitle && <p className="db-page-subtitle">{pageSubtitle}</p>}
              </div>
            )}
            {children}
          </main>
        </div>
      </div>
    </>
  );
}

/**
 * DashboardCard — wrapper con header opcional
 */
export function DashboardCard({ title, subtitle, children, className = '', colSpan, style = {} }) {
  return (
    <div
      className={`db-card ${className}`}
      style={{
        gridColumn: colSpan ? `span ${colSpan}` : undefined,
        ...style
      }}
    >
      {(title || subtitle) && (
        <div className="db-card-header">
          <div>
            {title && <div className="db-card-title">{title}</div>}
            {subtitle && <div className="db-card-subtitle">{subtitle}</div>}
          </div>
        </div>
      )}
      <div className="db-card-body">
        {children}
      </div>
    </div>
  );
}

/**
 * StatCard — tarjeta de métrica pequeña
 */
export function StatCard({ label, value, valueClass = '', style = {} }) {
  return (
    <div className="db-stat" style={style}>
      <div className="db-stat-label">{label}</div>
      <div className={`db-stat-value ${valueClass}`}>{value}</div>
    </div>
  );
}