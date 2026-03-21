import React from 'react';

export default function Features() {
  return (
    <section id="features" className="sec-trans sp">
      <div className="w">
        <div className="sh">
          <div className="eye">Características del Proyecto</div>
          <h2 className="d3" style={{marginTop:'12px'}}>Todo lo que necesitas para<br/>entender tu ciudad</h2>
          <p className="body-md" style={{marginTop:'14px'}}>Seguridad, movilidad y servicios públicos al alcance de todos.</p>
        </div>
        
        {/* SLOT #1 Placeholder */}
        <div className="slot" id="slot1" style={{marginBottom:'44px',minHeight:'260px'}}>
          <div className="slot-badge">🔲 THREE.JS — SLOT #1</div>
          <div className="slot-ico">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--g)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div className="slot-lbl">Red de Datos 3D · Valle de Aburrá</div>
          <div className="slot-sub">Three.js node graph · React Three Fiber · Spline</div>
        </div>

        <div className="feat-grid">
          {[
            {
              title: 'Seguridad en Tiempo Real',
              desc: 'Zonas de riesgo, alertas activas y recomendaciones del Chatbot Guardián con datos de la Secretaría de Seguridad de Medellín.',
              tag: 'Secretaría de Seguridad MDE',
              icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            },
            {
              title: 'Movilidad Urbana',
              desc: 'Estado del Metro, Metroplús y ciclovías en tiempo real. Planifica tus rutas con datos actualizados cada 2 minutos.',
              tag: 'Metro MDE · SIATA · Tráfico',
              icon: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>
            },
            {
              title: 'Servicios Públicos',
              desc: 'Consulta tu factura EPM, historial de consumo y recibe predicciones basadas en datos climáticos y tu comportamiento.',
              tag: 'EPM · EEVV · Acueducto',
              icon: <><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></>
            },
            {
              title: 'Chatbot Guardián',
              desc: 'Asistente de seguridad que responde en lenguaje natural sobre zonas, horarios y recomendaciones según tu ubicación y la hora.',
              tag: 'IA + datos ciudad',
              icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            },
            {
              title: 'Alertas Climáticas SIATA',
              desc: 'Notificaciones inmediatas de lluvias fuertes, deslizamientos y riesgo hídrico. Integración directa con el sistema de alerta de Medellín.',
              tag: 'SIATA · IDEAM · DAGRD',
              icon: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            },
            {
              title: 'Noticias de tu Barrio',
              desc: 'Curación automática: cortes de agua, eventos culturales, obras viales y comunicados de la Alcaldía filtrados por tu zona.',
              tag: 'Alcaldía · Prensa oficial',
              icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>
            }
          ].map((feat, idx) => (
            <div className="fcard feat-card" key={idx}>
              <div className="fcard-ico">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--g)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  {feat.icon}
                </svg>
              </div>
              <div className="fcard-title">{feat.title}</div>
              <div className="fcard-desc">{feat.desc}</div>
              <div className="fcard-tag">{feat.tag}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
