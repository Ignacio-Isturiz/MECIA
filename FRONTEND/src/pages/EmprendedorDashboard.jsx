// src/pages/EmprendedorDashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '@/services/authService';

import DashboardLayout, {
  DashboardCard,
  Icons,
} from '@/components/dashboard/DashboardLayout';

import EmprendedorInsightsDashboard from '@/components/EmprendedorInsightsDashboard';
import NegociosCoberturaSection     from '@/components/NegociosCoberturaSection';
import NegociosCercanosSection      from '@/components/NegociosCercanosSection';
import ChatbotEmprendedor from '@/components/ChatbotEmprendedor';
import ConversationList from '@/components/ConversationList';

import '@/pages/DashboardComponents.css';

/* ── Sidebar nav ── */
const NAV = [
  { id: 'inicio',      label: 'Inicio',              icon: <Icons.Dashboard /> },
  { id: 'emprendedor', label: 'Abre Tu Negocio',     icon: <Icons.Rocket /> },
  { id: 'insights',    label: 'Inteligencia Emp.',   icon: <Icons.Chart /> },
  { id: 'negocios',    label: 'Negocios Cercanos',   icon: <Icons.Store /> },
  { id: 'cobertura',   label: 'Cobertura y Tarifas', icon: <Icons.Bolt /> },
];

/* ── Tab bar ── */
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
            background: active === t.id ? 'rgba(0,200,150,0.12)' : 'transparent',
            color: active === t.id ? '#00C896' : 'rgba(255,255,255,0.38)',
            fontSize: 12.5,
            fontWeight: active === t.id ? 700 : 500,
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            borderBottom: active === t.id ? '2px solid #00C896' : '2px solid transparent',
            transition: 'all 0.18s',
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

/* ── Overview card ── */
function OverviewCard({ icon, title, subtitle, value, accent, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${accent ? 'rgba(0,200,150,0.22)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 14, padding: '18px 20px',
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
      }}>{icon}</div>
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
      {onClick && <div style={{ fontSize: 11, color: '#00C896', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>Ver módulo →</div>}
    </div>
  );
}

export default function EmprendedorDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState('inicio');
  const [insightsTab, setInsightsTab] = useState('empresarial');
  const [negociosTab, setNegociosTab] = useState('cercanos');
  const [currentConversationId, setCurrentConversationId] = useState(null);

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
        Cargando inteligencia empresarial…
      </div>
    );
  }
  if (!user) return null;

  const firstName = user.full_name?.split(' ')[0] || 'Emprendedor';

  const PAGE_META = {
    inicio:      { title: `Hola, ${firstName}`,       subtitle: 'Panel ejecutivo para emprendedores de Medellín' },
    emprendedor: { title: 'Abre Tu Negocio',          subtitle: 'Consultor IA · Análisis de viabilidad · Recomendaciones' },
    insights:    { title: 'Inteligencia Empresarial', subtitle: 'Datos empresariales cruzados con contexto de zona' },
    negocios:    { title: 'Negocios y Cobertura',     subtitle: 'Negocios cercanos · Cobertura EPM · Tarifas' },
    cobertura:   { title: 'Cobertura y Tarifas',      subtitle: 'Estratificación, servicios públicos y tarifas EPM' },
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
      breadcrumb={`Emprendedor / ${meta.title}`}
    >

      {/* ══ INICIO ══ */}
      {activeModule === 'inicio' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
            <OverviewCard
              icon={<Icons.Chart />}
              title="Inteligencia"
              value="Activo"
              subtitle="Empresas + criminalidad"
              accent
              onClick={() => setActiveModule('insights')}
            />
            <OverviewCard
              icon={<Icons.Store />}
              title="Negocios"
              value="Dataset"
              subtitle="Por barrio y categoría"
              accent
              onClick={() => setActiveModule('negocios')}
            />
            <OverviewCard
              icon={<Icons.Bolt />}
              title="Cobertura EPM"
              value="Tarifas"
              subtitle="Estratificación y tendencias"
              onClick={() => setActiveModule('cobertura')}
            />
            <OverviewCard
              icon={<Icons.MapPin />}
              title="Ciudad"
              value="Medellín"
              subtitle="Valle de Aburrá"
            />
          </div>

          {/* Insights preview */}
          <DashboardCard
            title="Inteligencia Empresarial"
            subtitle="Resumen ejecutivo · Haz clic en una sección para expandir"
          >
            <div style={{ padding: '0 16px 16px' }}>
              <EmprendedorInsightsDashboard />
            </div>
          </DashboardCard>
        </div>
      )}

      {/* ══ INSIGHTS ══ */}
      {activeModule === 'insights' && (
        <DashboardCard>
          <TabBar
            tabs={[
              { id: 'empresarial', label: 'Actividad Empresarial' },
              { id: 'criminalidad', label: 'Contexto de Seguridad' },
            ]}
            active={insightsTab}
            onChange={setInsightsTab}
          />
          <div style={{ padding: '16px' }}>
            <EmprendedorInsightsDashboard />
          </div>
        </DashboardCard>
      )}

      {/* ══ NEGOCIOS ══ */}
      {activeModule === 'negocios' && (
        <DashboardCard>
          <TabBar
            tabs={[
              { id: 'cercanos', label: 'Negocios Cercanos' },
              { id: 'cobertura', label: 'Cobertura y Tarifas' },
            ]}
            active={negociosTab}
            onChange={setNegociosTab}
          />
          <div style={{ padding: '16px' }}>
            {negociosTab === 'cercanos'  && <NegociosCercanosSection />}
            {negociosTab === 'cobertura' && <NegociosCoberturaSection />}
          </div>
        </DashboardCard>
      )}

      {/* ══ COBERTURA ══ */}
      {activeModule === 'cobertura' && (
        <DashboardCard
          title="Cobertura y Tarifas EPM"
          subtitle="Estratificación · Cobertura por servicio · Tendencias de tarifas"
        >
          <div style={{ padding: '16px 18px' }}>
            <NegociosCoberturaSection />
          </div>
        </DashboardCard>
      )}

      {/* ══ ABRE TU NEGOCIO ══ */}
      {activeModule === 'emprendedor' && (
        <div style={{
          display: 'flex',
          height: '100%',
          gap: 0,
          background: 'rgba(15, 23, 42, 0.4)',
          borderRadius: 14,
          overflow: 'hidden',
        }}>
          {/* Left sidebar with conversation list */}
          <ConversationList
            currentId={currentConversationId}
            onSelect={setCurrentConversationId}
            onNew={() => setCurrentConversationId(null)}
            onDelete={(convId) => {
              if (currentConversationId === convId) {
                setCurrentConversationId(null);
              }
            }}
          />

          {/* Right area with chatbot */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            borderLeft: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{
              padding: '16px 18px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              <h2 style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 700,
                color: '#fff',
                fontFamily: 'Inter, sans-serif',
              }}>
                Abre Tu Negocio
              </h2>
              <p style={{
                margin: '4px 0 0',
                fontSize: 13,
                color: 'rgba(255,255,255,0.5)',
                fontFamily: 'Inter, sans-serif',
              }}>
                Asesor IA para emprendedores · Análisis de viabilidad · Recomendaciones
              </p>
            </div>

            <div style={{
              flex: 1,
              overflow: 'hidden',
              padding: '16px 18px',
            }}>
              <ChatbotEmprendedor
                conversationId={currentConversationId}
                onConversationChange={setCurrentConversationId}
              />
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}