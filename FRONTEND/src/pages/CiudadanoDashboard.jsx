// src/pages/CiudadanoDashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '@/services/authService';

import DashboardLayout, {
  DashboardCard,
  StatCard,
  Icons,
} from '@/components/dashboard/DashboardLayout';

import CriminalidadDashboard from '@/components/CriminalidadDashboard';
import CitizenNewsSection    from '@/components/CitizenNewsSection';
import ChatbotSeguridad      from '@/components/ChatbotSeguridad';
import AnalizadorFactura     from '@/components/AnalizadorFactura';

import '@/pages/DashboardComponents.css';

/* ── Sidebar nav ── */
const NAV = [
  { id: 'inicio',    label: 'Inicio',        icon: <Icons.Dashboard /> },
  { id: 'seguridad', label: 'Seguridad',      icon: <Icons.Shield /> },
  { id: 'servicios', label: 'Servicios EPM',  icon: <Icons.Bolt /> },
  { id: 'noticias',  label: 'Noticias',       icon: <Icons.News /> },
];

/* ── Tab pill component ── */
function TabBar({ tabs, active, onChange }) {
  return (
    <div style={{
      display: 'flex', gap: 6, flexWrap: 'wrap',
      padding: '14px 16px 0',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            padding: '6px 14px',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            background: active === t.id
              ? 'rgba(0,200,150,0.12)'
              : 'transparent',
            color: active === t.id
              ? '#00C896'
              : 'rgba(255,255,255,0.38)',
            fontSize: 12.5,
            fontWeight: active === t.id ? 700 : 500,
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            borderBottom: active === t.id
              ? '2px solid #00C896'
              : '2px solid transparent',
            transition: 'all 0.18s',
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

/* ── Overview cards ── */
function OverviewCard({ icon, title, subtitle, value, accent, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${accent ? 'rgba(0,200,150,0.22)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 14,
        padding: '18px 20px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.18s, border-color 0.18s, box-shadow 0.18s',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}
      onMouseEnter={e => onClick && (e.currentTarget.style.transform = 'translateY(-2px)', e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.25)')}
      onMouseLeave={e => onClick && (e.currentTarget.style.transform = '', e.currentTarget.style.boxShadow = '')}
    >
      <div style={{
        width: 38, height: 38, borderRadius: 10,
        background: accent ? 'rgba(0,200,150,0.12)' : 'rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: accent ? '#00C896' : 'rgba(255,255,255,0.5)',
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>
          {title}
        </div>
        <div style={{ fontSize: 20, fontWeight: 800, color: accent ? '#00C896' : '#fff', fontFamily: 'Montserrat, sans-serif', marginTop: 2 }}>
          {value}
        </div>
        {subtitle && (
          <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.32)', marginTop: 2, fontFamily: 'Inter, sans-serif' }}>
            {subtitle}
          </div>
        )}
      </div>
      {onClick && (
        <div style={{ fontSize: 11, color: '#00C896', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
          Ver módulo →
        </div>
      )}
    </div>
  );
}

export default function CiudadanoDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState('inicio');
  const [segTab, setSegTab] = useState('chatbot');
  const [svcTab, setSvcTab] = useState('factura');

  useEffect(() => {
    authService.getMe()
      .then(setUser)
      .catch(() => navigate('/login'))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => { authService.logout(); navigate('/login'); };

  if (loading) {
    return (
      <div className="db-loading">
        <div className="db-spinner" />
        Cargando tu ciudad…
      </div>
    );
  }
  if (!user) return null;

  const firstName = user.full_name?.split(' ')[0] || 'Usuario';

  const PAGE_META = {
    inicio:    { title: `Hola, ${firstName}`,   subtitle: 'Vista general de Medellín en tiempo real' },
    seguridad: { title: 'Seguridad',             subtitle: 'Chatbot Guardián y criminalidad por commune' },
    servicios: { title: 'Servicios Públicos',    subtitle: 'Análisis de facturas EPM con IA' },
    noticias:  { title: 'Noticias',              subtitle: 'Actualidad de Medellín por categoría' },
  };

  const meta = PAGE_META[activeModule];

  return (
    <DashboardLayout
      user={user}
      navItems={NAV}
      activeItem={activeModule}
      onSelect={setActiveModule}
      onLogout={handleLogout}
      pageTitle={meta.title}
      pageSubtitle={meta.subtitle}
      breadcrumb={`Ciudadano / ${meta.title}`}
    >

      {/* ══ INICIO ══ */}
      {activeModule === 'inicio' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Overview grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
            <OverviewCard
              icon={<Icons.Shield />}
              title="Seguridad"
              value="Activo"
              subtitle="Chatbot + criminalidad"
              accent
              onClick={() => setActiveModule('seguridad')}
            />
            <OverviewCard
              icon={<Icons.Bolt />}
              title="Servicios EPM"
              value="Listo"
              subtitle="Análisis con IA"
              accent
              onClick={() => setActiveModule('servicios')}
            />
            <OverviewCard
              icon={<Icons.News />}
              title="Noticias"
              value="6 módulos"
              subtitle="General · Seguridad · +4"
              onClick={() => setActiveModule('noticias')}
            />
            <OverviewCard
              icon={<Icons.MapPin />}
              title="Ciudad"
              value="Medellín"
              subtitle="Valle de Aburrá"
            />
          </div>

          {/* Chat + Noticias en 2 columnas */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <DashboardCard
              title="Guardián"
              subtitle="Asistente de seguridad ciudadana"
            >
              <ChatbotSeguridad />
            </DashboardCard>

            <DashboardCard
              title="Noticias de Medellín"
              subtitle="Actualización en tiempo real"
            >
              <div style={{ padding: '10px 14px 14px' }}>
                <CitizenNewsSection title="" defaultCategory="general" showCategoryFilter={true} />
              </div>
            </DashboardCard>
          </div>
        </div>
      )}

      {/* ══ SEGURIDAD ══ */}
      {activeModule === 'seguridad' && (
        <DashboardCard style={{ overflow: 'visible' }}>
          <TabBar
            tabs={[
              { id: 'chatbot',       label: 'Chatbot Guardián' },
              { id: 'criminalidad',  label: 'Criminalidad por Comuna' },
            ]}
            active={segTab}
            onChange={setSegTab}
          />
          <div style={{ padding: '16px' }}>
            {segTab === 'chatbot' && <ChatbotSeguridad />}
            {segTab === 'criminalidad' && <CriminalidadDashboard />}
          </div>
        </DashboardCard>
      )}

      {/* ══ SERVICIOS ══ */}
      {activeModule === 'servicios' && (
        <div style={{ maxWidth: 760 }}>
          <DashboardCard
            title="Análisis de Factura EPM"
            subtitle="Sube fotos de tu factura · Recomendaciones con GPT-4o Vision"
          >
            <div style={{ padding: '16px 18px' }}>
              <AnalizadorFactura />
            </div>
          </DashboardCard>
        </div>
      )}

      {/* ══ NOTICIAS ══ */}
      {activeModule === 'noticias' && (
        <DashboardCard
          title="Noticias de Medellín"
          subtitle="Filtradas por categoría · Fuentes verificadas"
        >
          <div style={{ padding: '12px 16px 16px' }}>
            <CitizenNewsSection title="" defaultCategory="general" showCategoryFilter={true} />
          </div>
        </DashboardCard>
      )}

    </DashboardLayout>
  );
}