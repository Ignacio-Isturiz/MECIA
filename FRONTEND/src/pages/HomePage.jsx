// src/pages/HomePage.jsx
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { initLandingPageAnimation } from './HomePageAnimation';

export default function HomePage() {
  const containerRef = useRef(null);

  useEffect(() => {
    const cleanup = initLandingPageAnimation(containerRef.current);
    return () => { if (cleanup) cleanup(); };
  }, []);

  return (
    <div ref={containerRef}>

      {/* ══ WEBGL CANVAS ══ */}
      <canvas id="city-canvas"></canvas>

      {/* ══ NAVBAR ══ */}
      <header id="nav">
        <a className="logo" href="#">
          <div className="logo-mark">
            <svg width="16" height="16" viewBox="0 0 36 36" fill="none">
              <path d="M6 8C6 6.9 6.9 6 8 6H22C22 6 28 6 28 12V20" stroke="white" strokeWidth="3.4" strokeLinecap="round"/>
              <path d="M6 8V28C6 29.1 6.9 30 8 30H28" stroke="white" strokeWidth="3.4" strokeLinecap="round"/>
              <circle cx="25" cy="10" r="3" fill="white"/>
            </svg>
          </div>
          <span className="logo-text">MECIA</span>
        </a>
        <nav className="nav-links">
          <a href="#" className="active">Inicio</a>
          <a href="#features">Plataforma</a>
          <a href="#services">Servicios</a>
          <a href="#blog">Blog</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div className="nav-r">
          <button className="theme-btn" id="theme-btn">
            <svg className="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
            </svg>
            <svg className="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </button>
          <Link to="/login" className="btn btn-outline" style={{padding:'9px 20px',fontSize:'13px'}}>Iniciar Sesión</Link>
          <Link to="/register" className="btn btn-g" style={{padding:'9px 20px',fontSize:'13px'}}>Explorar MECIA →</Link>
        </div>
      </header>

      {/* ══ HERO ══ */}
      <section className="hero sec-trans">
        <div className="orb-field">
          <div className="orb orb-teal" style={{width:'700px',height:'700px',top:'-15%',left:'35%',transform:'translateX(-50%)',opacity:.9}}></div>
          <div className="orb orb-blue" style={{width:'500px',height:'500px',top:'20%',right:'-10%',opacity:.7}}></div>
          <div className="orb orb-indigo" style={{width:'400px',height:'400px',bottom:'5%',left:'5%',opacity:.5}}></div>
        </div>

        <div className="hero-upper w">
          <div className="hero-lozenge" id="hl">
            <div className="hero-lozenge-dot">✦</div>
            Inteligencia Ciudadana para Colombia
          </div>
          <h1 className="hero-title" id="htitle">
            Medellín, <em>Inteligente.</em><br/>Tu Ciudad en Tiempo Real.
          </h1>
          <p className="hero-sub" id="hsub">
            Seguridad, movilidad y servicios públicos en un solo dashboard. MECIA transforma datos abiertos en decisiones claras para cada ciudadano.
          </p>
          <div className="hero-btns" id="hbtns">
            <a href="#" className="btn btn-g" id="hero-cta">Comenzar Gratis →</a>
            <a href="#" className="btn btn-outline">Ver el Dashboard</a>
          </div>

          {/* MOCKUP */}
          <div className="hero-dash-wrap" id="hdash">
            <div className="mk">
              <div className="mk-top">
                <div className="mk-logo-row">
                  <svg width="13" height="13" viewBox="0 0 36 36" fill="none">
                    <path d="M6 8C6 6.9 6.9 6 8 6H22C22 6 28 6 28 12V20" stroke="var(--g)" strokeWidth="3.5" strokeLinecap="round"/>
                    <path d="M6 8V28C6 29.1 6.9 30 8 30H28" stroke="var(--g)" strokeWidth="3.5" strokeLinecap="round"/>
                    <circle cx="25" cy="10" r="3" fill="var(--g)"/>
                  </svg>
                  MECIA
                </div>
                <div className="mk-search">
                  <svg width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                  Buscar en tu ciudad…
                </div>
                <div className="mk-top-r">
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                  CIUDADANO · Medellín <div className="mk-av"></div>
                </div>
              </div>
              <div className="mk-body">
                <div className="mk-sb">
                  <div className="mk-ico on">🏠</div>
                  <div className="mk-ico">💬</div>
                  <div className="mk-sep"></div>
                  <div className="mk-ico">🔌</div>
                  <div className="mk-ico">🛡</div>
                  <div className="mk-ico">🚇</div>
                  <div className="mk-sep"></div>
                  <div className="mk-ico">⚙</div>
                </div>
                <div className="mk-main">
                  <div className="mk-section-hdr">MEDELLÍN AL DÍA <span>⋯</span></div>
                  <div className="news-grid">
                    <div className="nc"><div className="nc-img metro">🚇</div><div className="nc-body"><div className="nc-title">Metro: demora 8 min Línea A</div><div className="nc-time">hace 12 min</div></div></div>
                    <div className="nc"><div className="nc-img arvi">🌿</div><div className="nc-body"><div className="nc-title">Eventos Parque Arví este fin</div><div className="nc-time">hace 1 h</div></div></div>
                    <div className="nc"><div className="nc-img clima">⚡</div><div className="nc-body"><div className="nc-title">Alerta SIATA: lluvia intensa</div><div className="nc-time">hace 2 h</div></div></div>
                  </div>
                  <div className="mk-pills">
                    <div className="mpill"><div className="mpill-dot" style={{background:'#4ade80'}}></div>EPM: $198.000</div>
                    <div className="mpill"><div className="mpill-dot" style={{background:'#fbbf24'}}></div>Metro: activo</div>
                    <div className="mpill"><div className="mpill-dot" style={{background:'var(--g)'}}></div>SIATA: alerta</div>
                  </div>
                </div>
                <div className="mk-chat">
                  <div className="mk-chat-hdr">GUARDIÁN</div>
                  <div className="mk-msgs">
                    <div className="mk-bbl user">¿El Poblado es seguro hoy?</div>
                    <div className="mk-bbl bot">Afluencia alta. Usa transporte confiable. Evita parques solitarios después de las 10 pm.</div>
                  </div>
                  <div className="mk-map-mini">
                    <div className="mk-map-vis">
                      <div className="mk-map-grid"></div>
                      <div className="mk-zones">
                        <div className="mz" style={{background:'#4ade80'}}></div>
                        <div className="mz" style={{background:'#fbbf24'}}></div>
                        <div className="mz" style={{background:'#f87171'}}></div>
                      </div>
                    </div>
                    <div className="mk-leg">
                      <div className="mk-leg-i"><div className="mk-leg-d" style={{background:'#4ade80'}}></div>Seguro</div>
                      <div className="mk-leg-i"><div className="mk-leg-d" style={{background:'#fbbf24'}}></div>Precaución</div>
                      <div className="mk-leg-i"><div className="mk-leg-d" style={{background:'#f87171'}}></div>Evitar</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mk-analytics">
                <div className="mk-st"><div className="mk-sv" id="a1">0</div><div className="mk-sl">Alertas hoy</div></div>
                <div className="mk-st"><div className="mk-sv" id="a2">0%</div><div className="mk-sl">Rutas sin demoras</div></div>
                <div className="mk-st"><div className="mk-sv" id="a3">0</div><div className="mk-sl">Noticias activas</div></div>
                <div className="mk-spark">
                  <svg viewBox="0 0 200 30" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="spg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00C896" stopOpacity=".3"/>
                        <stop offset="100%" stopColor="#00C896" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    <polygon points="0,28 25,20 50,24 75,12 100,16 125,7 150,11 175,5 200,3 200,30 0,30" fill="url(#spg)"/>
                    <polyline points="0,28 25,20 50,24 75,12 100,16 125,7 150,11 175,5 200,3" fill="none" stroke="var(--g)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══ CURVED DIVIDER ══ */}
        <div className="curve-divider">
          <svg viewBox="0 0 1440 110" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style={{height:'110px'}}>
            <path d="M0,0 C200,100 500,110 720,110 C940,110 1240,100 1440,0 L1440,110 L0,110 Z" fill="rgba(8,14,28,0.65)"/>
            <path d="M0,0 C200,100 500,110 720,110 C940,110 1240,100 1440,0" fill="none" stroke="rgba(0,200,150,0.2)" strokeWidth="1"/>
          </svg>
          <div className="curve-circle" id="curve-scroll">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--g)" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        </div>
      </section>

      {/* ══ TRUSTED ══ */}
      <div className="trusted sec-mid">
        <div className="trusted-lbl">Fuentes de datos verificadas</div>
        <div className="logos">
          <div className="logo-e">🏛 DANE</div>
          <div className="logo-e">🏙 Alcaldía MDE</div>
          <div className="logo-e">⚡ EPM</div>
          <div className="logo-e">🚇 Metro MDE</div>
          <div className="logo-e">🌧 SIATA</div>
          <div className="logo-e">🏦 Banco Rep.</div>
          <div className="logo-e">📋 DNP</div>
        </div>
      </div>

      {/* ══ STATS ══ */}
      <div className="sec-mid sp-sm">
        <div className="w">
          <div style={{maxWidth:'840px',margin:'0 auto'}}>
            <div className="stats-strip">
              <div className="st-it"><div className="st-n" id="s1">0</div><div className="st-l">Alertas procesadas hoy</div></div>
              <div className="st-it"><div className="st-n" id="s2">0</div><div className="st-l">Ciudadanos en MECIA</div></div>
              <div className="st-it"><div className="st-n" id="s3">0</div><div className="st-l">Datasets activos</div></div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ CARACTERÍSTICAS ══ */}
      <section id="features" className="sec-trans sp">
        <div className="w">
          <div className="sh">
            <div className="eye">Características del Proyecto</div>
            <h2 className="d3" style={{marginTop:'12px'}}>Todo lo que necesitas para<br/>entender tu ciudad</h2>
            <p className="body-md" style={{marginTop:'14px'}}>Seguridad, movilidad y servicios públicos al alcance de todos.</p>
          </div>
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
            <div className="fcard feat-card">
              <div className="fcard-ico"><svg viewBox="0 0 24 24" fill="none" stroke="var(--g)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
              <div className="fcard-title">Seguridad en Tiempo Real</div>
              <div className="fcard-desc">Zonas de riesgo, alertas activas y recomendaciones del Chatbot Guardián con datos de la Secretaría de Seguridad de Medellín.</div>
              <div className="fcard-tag">Secretaría de Seguridad MDE</div>
            </div>
            <div className="fcard feat-card">
              <div className="fcard-ico"><svg viewBox="0 0 24 24" fill="none" stroke="var(--g)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>
              <div className="fcard-title">Movilidad Urbana</div>
              <div className="fcard-desc">Estado del Metro, Metroplús y ciclovías en tiempo real. Planifica tus rutas con datos actualizados cada 2 minutos.</div>
              <div className="fcard-tag">Metro MDE · SIATA · Tráfico</div>
            </div>
            <div className="fcard feat-card">
              <div className="fcard-ico"><svg viewBox="0 0 24 24" fill="none" stroke="var(--g)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg></div>
              <div className="fcard-title">Servicios Públicos</div>
              <div className="fcard-desc">Consulta tu factura EPM, historial de consumo y recibe predicciones basadas en datos climáticos y tu comportamiento.</div>
              <div className="fcard-tag">EPM · EEVV · Acueducto</div>
            </div>
            <div className="fcard feat-card">
              <div className="fcard-ico"><svg viewBox="0 0 24 24" fill="none" stroke="var(--g)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
              <div className="fcard-title">Chatbot Guardián</div>
              <div className="fcard-desc">Asistente de seguridad que responde en lenguaje natural sobre zonas, horarios y recomendaciones según tu ubicación y la hora.</div>
              <div className="fcard-tag">IA + datos ciudad</div>
            </div>
            <div className="fcard feat-card">
              <div className="fcard-ico"><svg viewBox="0 0 24 24" fill="none" stroke="var(--g)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
              <div className="fcard-title">Alertas Climáticas SIATA</div>
              <div className="fcard-desc">Notificaciones inmediatas de lluvias fuertes, deslizamientos y riesgo hídrico. Integración directa con el sistema de alerta de Medellín.</div>
              <div className="fcard-tag">SIATA · IDEAM · DAGRD</div>
            </div>
            <div className="fcard feat-card">
              <div className="fcard-ico"><svg viewBox="0 0 24 24" fill="none" stroke="var(--g)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
              <div className="fcard-title">Noticias de tu Barrio</div>
              <div className="fcard-desc">Curación automática: cortes de agua, eventos culturales, obras viales y comunicados de la Alcaldía filtrados por tu zona.</div>
              <div className="fcard-tag">Alcaldía · Prensa oficial</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CASOS DE USO ══ */}
      <section className="sec-mid sp">
        <div className="w">
          <div className="sh">
            <div className="eye">Casos de Uso</div>
            <h2 className="d3" style={{marginTop:'12px'}}>¿Quién usa MECIA?</h2>
            <p className="body-md" style={{marginTop:'14px'}}>Desde familias hasta entidades públicas, MECIA se adapta a cada necesidad.</p>
          </div>
          <div className="casos-grid">
            <div className="caso">
              <div className="caso-vis"><div className="caso-vis-bg"></div><div className="caso-num">01</div><div className="caso-icon"><svg viewBox="0 0 24 24" fill="none" stroke="var(--g)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div></div>
              <div className="caso-body"><div className="caso-title">Ciudadanos de Medellín</div><div className="caso-desc">Consulta si tu barrio es seguro, el estado de tu factura EPM, cuánto tardará el Metro o si hay alerta de lluvia antes de salir.</div><div className="tags"><span className="tag">Seguridad barrial</span><span className="tag">Factura EPM</span><span className="tag">Metro MDE</span></div></div>
            </div>
            <div className="caso">
              <div className="caso-vis"><div className="caso-vis-bg"></div><div className="caso-num">02</div><div className="caso-icon"><svg viewBox="0 0 24 24" fill="none" stroke="var(--g)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg></div></div>
              <div className="caso-body"><div className="caso-title">Emprendedores y PYMEs</div><div className="caso-desc">Identifica zonas con mayor afluencia antes de abrir un local. Analiza el contexto de seguridad e indicadores económicos zonales.</div><div className="tags"><span className="tag">Afluencia zonal</span><span className="tag">Riesgo operacional</span><span className="tag">Oportunidad</span></div></div>
            </div>
            <div className="caso">
              <div className="caso-vis"><div className="caso-vis-bg"></div><div className="caso-num">03</div><div className="caso-icon"><svg viewBox="0 0 24 24" fill="none" stroke="var(--g)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div></div>
              <div className="caso-body"><div className="caso-title">Entidades Públicas</div><div className="caso-desc">Monitorea KPIs de gestión, comunica alertas a ciudadanos de forma proactiva y compara indicadores entre comunas.</div><div className="tags"><span className="tag">KPIs gestión</span><span className="tag">Transparencia</span><span className="tag">Comparación comunas</span></div></div>
            </div>
            <div className="caso">
              <div className="caso-vis"><div className="caso-vis-bg"></div><div className="caso-num">04</div><div className="caso-icon"><svg viewBox="0 0 24 24" fill="none" stroke="var(--g)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></div></div>
              <div className="caso-body"><div className="caso-title">Academia e Investigación</div><div className="caso-desc">Accede a datasets estructurados de movilidad, seguridad y servicios para tesis, publicaciones y proyectos de la ciudad.</div><div className="tags"><span className="tag">Open data</span><span className="tag">API acceso</span><span className="tag">CSV / JSON</span></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SERVICES ══ */}
      <section id="services" className="sec-accent sp">
        <div className="w">
          <div className="sh">
            <div className="eye">Servicios</div>
            <h2 className="d3" style={{marginTop:'12px'}}>Una suite para cada módulo</h2>
            <p className="body-md" style={{marginTop:'14px'}}>Seguridad, movilidad y servicios públicos, integrados.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'28px',marginBottom:'48px',alignItems:'center'}}>
            <div className="slot" id="slot2" style={{minHeight:'240px'}}>
              <div className="slot-badge">🔲 THREE.JS — SLOT #2</div>
              <div className="slot-ico"><svg viewBox="0 0 24 24" fill="none" stroke="var(--g)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg></div>
              <div className="slot-lbl">Mapa 3D Valle de Aburrá</div>
              <div className="slot-sub">deck.gl · Mapbox GL · GeoJSON Alcaldía</div>
            </div>
            <div style={{padding:'10px 0',display:'flex',flexDirection:'column',gap:'16px'}}>
              <div className="eye" style={{justifyContent:'flex-start'}}>Cobertura total</div>
              <h3 style={{fontFamily:'var(--fh)',fontWeight:800,fontSize:'clamp(22px,3vw,34px)',color:'var(--txt)',lineHeight:1.15,letterSpacing:'-.03em'}}>Los 16 comunas de Medellín en una sola plataforma</h3>
              <p className="body-md">Desde Manrique hasta Envigado, MECIA agrega información oficial de todo el Área Metropolitana del Valle de Aburrá con actualización continua.</p>
              <div style={{display:'flex',gap:'12px'}}><a href="#" className="btn btn-g">Explorar el Mapa →</a><a href="#" className="btn btn-outline">Ver Cobertura</a></div>
            </div>
          </div>
          <div className="svc-grid">
            <div className="svc"><div className="svc-ico"><svg viewBox="0 0 24 24" fill="none" stroke="var(--g)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div><div className="svc-title">MECIA Seguridad</div><div className="svc-desc">Mapa de calor, alertas activas y el Chatbot Guardián. Recomendaciones en tiempo real según tu ubicación y hora.</div></div>
            <div className="svc"><div className="svc-ico"><svg viewBox="0 0 24 24" fill="none" stroke="var(--g)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M3 6h18M3 18h18"/><circle cx="12" cy="12" r="3"/></svg></div><div className="svc-title">Movilidad Inteligente</div><div className="svc-desc">Estado del Metro, Metroplús y ciclovías. Planifica tus desplazamientos con datos actualizados cada 2 minutos.</div></div>
            <div className="svc"><div className="svc-ico"><svg viewBox="0 0 24 24" fill="none" stroke="var(--g)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4"/></svg></div><div className="svc-title">Servicios Públicos</div><div className="svc-desc">Factura EPM, historial de consumo y predicciones. Reporta cortes y recibe alertas de mantenimiento programado.</div></div>
            <div className="svc"><div className="svc-ico"><svg viewBox="0 0 24 24" fill="none" stroke="var(--g)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div><div className="svc-title">Guardián Chatbot</div><div className="svc-desc">Pregunta por zonas seguras, horarios, eventos o solicita recomendaciones basadas en tu contexto en tiempo real.</div></div>
            <div className="svc"><div className="svc-ico"><svg viewBox="0 0 24 24" fill="none" stroke="var(--g)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.19 12a19.79 19.79 0 0 1-2.07-8.5A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></div><div className="svc-title">MECIA en Telegram</div><div className="svc-desc">Todas las alertas y consultas desde Telegram sin necesidad de abrir la app. Ideal para uso sin datos móviles.</div></div>
            <div className="svc"><div className="svc-ico"><svg viewBox="0 0 24 24" fill="none" stroke="var(--g)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg></div><div className="svc-title">API para Desarrolladores</div><div className="svc-desc">Integra datos de seguridad, movilidad y servicios de Medellín en tus aplicaciones. REST API documentada y gratuita.</div></div>
          </div>
        </div>
      </section>

      {/* ══ VIDEO SECTION ══ */}
      <div className="video-sec">
        <div className="vid-bg">
          <div className="vid-cinema">
            <div className="vid-glow1"></div><div className="vid-glow2"></div><div className="vid-lines"></div>
          </div>
        </div>
        <div className="vid-play">
          <div className="play-ring" id="play-btn">
            <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3" fill="var(--g)"/></svg>
          </div>
          <span className="play-lbl">Ver Demo</span>
        </div>
        <div className="vid-text">
          <div className="vt-tag"><div className="vt-dot"></div>Plataforma activa · Datos en vivo</div>
          <div className="vt-eyebrow">Conoce la plataforma</div>
          <div className="vt-h">Tu Ciudad.</div>
          <div className="vt-h-accent">Tu Decisión.</div>
          <div className="vt-line"></div>
          <div className="vt-desc">MECIA centraliza la inteligencia de Medellín: alertas de seguridad, estado del Metro, tu factura EPM y las noticias de tu barrio — todo en un solo dashboard ciudadano.</div>
          <div className="vt-btns">
            <a href="#" className="btn btn-g">Ver la Plataforma →</a>
            <a href="#" className="btn" style={{color:'#fff',border:'1px solid rgba(255,255,255,.22)',background:'transparent',borderRadius:'980px',padding:'14px 32px',fontSize:'14.5px',fontWeight:600}}>Leer Más</a>
          </div>
        </div>
      </div>

      {/* ══ INSIGHTS ══ */}
      <section className="sec-trans sp">
        <div className="w">
          <div className="sh">
            <div className="eye">Valuable Insights</div>
            <h2 className="d3" style={{marginTop:'12px'}}>Análisis para decisiones<br/><em className="d-italic">más inteligentes</em></h2>
            <p className="body-md" style={{marginTop:'14px'}}>Nuestro equipo analiza las tendencias más relevantes de Medellín cada semana.</p>
          </div>
          <div className="ins-grid">
            <div className="ins"><div className="ins-vis"><div className="ins-grid-bg"></div><div className="ins-bars"><div className="ib" style={{width:'18px',height:'28px'}}></div><div className="ib" style={{width:'18px',height:'44px'}}></div><div className="ib" style={{width:'18px',height:'30px'}}></div><div className="ib hi" style={{width:'18px',height:'62px'}}></div><div className="ib" style={{width:'18px',height:'46px'}}></div><div className="ib" style={{width:'18px',height:'38px'}}></div></div></div><div className="ins-body"><div className="ins-cat">Seguridad</div><div className="ins-title">Zonas más seguras de El Poblado en el segundo semestre de 2024</div><div className="ins-footer"><span>Mar 2025 · 5 min</span><span style={{color:'var(--g)'}}>→</span></div></div></div>
            <div className="ins"><div className="ins-vis"><div className="ins-grid-bg"></div><div style={{position:'relative',zIndex:1,width:'90%',height:'68px'}}><svg viewBox="0 0 230 68" width="100%" height="100%" preserveAspectRatio="none"><defs><linearGradient id="ig1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00C896" stopOpacity=".26"/><stop offset="100%" stopColor="#00C896" stopOpacity="0"/></linearGradient></defs><polygon points="0,66 30,54 60,58 90,40 115,44 145,24 175,18 205,10 230,5 230,68 0,68" fill="url(#ig1)"/><polyline points="0,66 30,54 60,58 90,40 115,44 145,24 175,18 205,10 230,5" fill="none" stroke="var(--g)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div></div><div className="ins-body"><div className="ins-cat">Movilidad</div><div className="ins-title">Metro de Medellín: tendencias de demora y líneas más afectadas en 2024</div><div className="ins-footer"><span>Feb 2025 · 6 min</span><span style={{color:'var(--g)'}}>→</span></div></div></div>
            <div className="ins"><div className="ins-vis"><div className="ins-grid-bg"></div><div className="ins-bars"><div className="ib" style={{width:'18px',height:'48px'}}></div><div className="ib" style={{width:'18px',height:'30px'}}></div><div className="ib hi" style={{width:'18px',height:'60px'}}></div><div className="ib" style={{width:'18px',height:'40px'}}></div><div className="ib" style={{width:'18px',height:'52px'}}></div><div className="ib" style={{width:'18px',height:'36px'}}></div></div></div><div className="ins-body"><div className="ins-cat">Servicios</div><div className="ins-title">Consumo de agua en Laureles supera 14% el promedio histórico de Medellín</div><div className="ins-footer"><span>Ene 2025 · 8 min</span><span style={{color:'var(--g)'}}>→</span></div></div></div>
          </div>
        </div>
      </section>

      {/* ══ BLOG ══ */}
      <section id="blog" className="sec-mid sp">
        <div className="w">
          <div className="blog-hdr">
            <div>
              <div className="eye" style={{justifyContent:'flex-start'}}>Blog</div>
              <h2 style={{fontFamily:'var(--fh)',fontSize:'clamp(24px,3.2vw,38px)',fontWeight:800,color:'var(--txt)',letterSpacing:'-.03em',marginTop:'10px',maxWidth:'420px',lineHeight:1.12}}>Noticias y análisis sobre <em style={{fontStyle:'italic',color:'var(--g)'}}>Medellín</em></h2>
            </div>
            <a href="#" className="btn btn-outline" style={{padding:'11px 24px',fontSize:'13px'}}>Ver todos →</a>
          </div>
          <div className="blog-main">
            <div className="blog-h">
              <div className="blog-h-thumb"><div className="blog-h-thumb-bg"></div><div className="blog-h-ph-badge">📷 IMG</div><div className="blog-h-thumb-ico"><svg viewBox="0 0 24 24" fill="none" stroke="var(--g)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div></div>
              <div className="blog-h-body"><span className="blog-cat">Seguridad</span><div className="blog-h-title">Cómo el Chatbot Guardián de MECIA está ayudando a los medellinenses a moverse más seguros</div><div className="blog-h-excerpt">Desde su lanzamiento, el Asistente Guardián ha resuelto más de 120.000 consultas de seguridad ciudadana.</div><div className="blog-h-meta"><div className="blog-h-author"><div className="blog-av"></div><span>Equipo MECIA</span></div><span>18 Mar 2025</span></div></div>
            </div>
            <div className="blog-h">
              <div className="blog-h-thumb"><div className="blog-h-thumb-bg"></div><div className="blog-h-ph-badge">📷 IMG</div><div className="blog-h-thumb-ico"><svg viewBox="0 0 24 24" fill="none" stroke="var(--g)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M3 6h18M3 18h18"/><circle cx="12" cy="12" r="3"/></svg></div></div>
              <div className="blog-h-body"><span className="blog-cat">Movilidad</span><div className="blog-h-title">Metro de Medellín: las 3 estaciones con más retrasos y cómo planificar mejor tus rutas</div><div className="blog-h-excerpt">Analizamos 6 meses de datos operativos del Metro para darte las recomendaciones más útiles.</div><div className="blog-h-meta"><div className="blog-h-author"><div className="blog-av" style={{background:'linear-gradient(135deg,#0ea5e9,#38bdf8)'}}></div><span>Ana Torres</span></div><span>12 Mar 2025</span></div></div>
            </div>
            <div className="blog-h">
              <div className="blog-h-thumb"><div className="blog-h-thumb-bg"></div><div className="blog-h-ph-badge">📷 IMG</div><div className="blog-h-thumb-ico"><svg viewBox="0 0 24 24" fill="none" stroke="var(--g)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4"/></svg></div></div>
              <div className="blog-h-body"><span className="blog-cat">Servicios</span><div className="blog-h-title">Tu recibo EPM: cómo leer los indicadores y predecir tu próximo cobro con MECIA</div><div className="blog-h-excerpt">MECIA te explica cada ítem de tu factura y cómo el contexto climático afecta tu consumo.</div><div className="blog-h-meta"><div className="blog-h-author"><div className="blog-av" style={{background:'linear-gradient(135deg,#f97316,#fb923c)'}}></div><span>Luis Pérez</span></div><span>7 Mar 2025</span></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section id="faq" className="sec-trans sp">
        <div className="w">
          <div className="sh">
            <div className="eye">Preguntas Frecuentes</div>
            <h2 className="d3" style={{marginTop:'12px'}}>Todo lo que necesitas saber</h2>
          </div>
          <div className="faq-layout">
            <div className="faq-sticky">
              <div className="slot" id="slot3" style={{minHeight:'480px'}}>
                <div className="slot-badge">🔲 THREE.JS — SLOT #3</div>
                <div className="slot-ico"><svg viewBox="0 0 24 24" fill="none" stroke="var(--g)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
                <div className="slot-lbl">Personaje Guardián 3D</div>
                <div className="slot-sub">Three.js · Spline · Lottie</div>
              </div>
            </div>
            <div className="faq-list">
              {[
                {q:'¿MECIA es gratuito?', a:'Sí. MECIA tiene un plan gratuito completo con acceso al dashboard ciudadano, Chatbot Guardián, alertas de seguridad, movilidad y servicios. Los planes Pro incluyen historial extendido, API ilimitada y reportes automáticos.'},
                {q:'¿De dónde vienen los datos de seguridad?', a:'Los datos provienen de la Secretaría de Seguridad de Medellín, el Centro de Mando y Control (CCTV), SISC y el Sistema 123. Los datos se procesan y anonimizan antes de mostrarse.'},
                {q:'¿Cómo funciona la integración con EPM?', a:'MECIA se conecta con la API pública de EPM. Con tu número de cuenta consultas tu saldo, historial de consumo y recibes alertas de cortes programados. No almacenamos tus credenciales.'},
                {q:'¿Con qué frecuencia se actualiza el Metro?', a:'Los datos del Metro de Medellín y Metroplús se actualizan cada 2 minutos durante las horas de operación. Las alertas de incidentes se procesan en tiempo real.'},
                {q:'¿Tiene MECIA datos del SIATA?', a:'Sí. MECIA tiene integración oficial con el SIATA. Las alertas de lluvia intensa, deslizamientos y riesgo hídrico aparecen con latencia menor a 3 minutos.'},
                {q:'¿Puedo usar MECIA fuera de Medellín?', a:'MECIA cubre los 10 municipios del Área Metropolitana del Valle de Aburrá. La expansión a otras ciudades colombianas está en la hoja de ruta para el segundo semestre de 2025.'},
                {q:'¿Hay API para desarrolladores?', a:'Sí. API REST documentada con 1.000 requests/mes gratis. Los planes Pro ofrecen desde 100k hasta ilimitadas, con acceso a endpoints de análisis avanzado y datos históricos desde 2018.'},
              ].map((item, idx) => (
                <div className="faq-it" key={idx}>
                  <div className="faq-q">{item.q}<div className="faq-plus">+</div></div>
                  <div className="faq-ans"><div className="faq-ans-in">{item.a}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <div className="footer-shell">
        <div className="footer-card">
          <div className="fg">
            <div>
              <a className="fl" href="#">
                <div className="logo-mark"><svg width="16" height="16" viewBox="0 0 36 36" fill="none"><path d="M6 8C6 6.9 6.9 6 8 6H22C22 6 28 6 28 12V20" stroke="white" strokeWidth="3.4" strokeLinecap="round"/><path d="M6 8V28C6 29.1 6.9 30 8 30H28" stroke="white" strokeWidth="3.4" strokeLinecap="round"/><circle cx="25" cy="10" r="3" fill="white"/></svg></div>
                <span className="fl-text">MECIA</span>
              </a>
              <p className="f-tag">Inteligencia ciudadana para Medellín. Seguridad, movilidad y servicios públicos en un solo dashboard.</p>
              <div className="f-socs">
                <div className="fsoc"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg></div>
                <div className="fsoc"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></div>
                <div className="fsoc"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg></div>
                <div className="fsoc"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg></div>
              </div>
            </div>
            <div className="fcol"><h4>Plataforma</h4><ul><li><a href="#">Dashboard</a></li><li><a href="#">Módulo Seguridad</a></li><li><a href="#">Módulo Servicios</a></li><li><a href="#">Módulo Movilidad</a></li><li><a href="#">Chatbot Guardián</a></li></ul></div>
            <div className="fcol"><h4>Recursos</h4><ul><li><a href="#">Documentación</a></li><li><a href="#">Blog</a></li><li><a href="#">Casos de Uso</a></li><li><a href="#">Open Data</a></li><li><a href="#">GitHub</a></li></ul></div>
            <div className="fcol"><h4>Accesos</h4><ul><li><a href="#">Explorar Datos</a></li><li><a href="#">API Developer</a></li><li><a href="#">Telegram</a></li><li><a href="#">Reportar Error</a></li><li><a href="#">Ayuda</a></li></ul></div>
            <div className="fcol"><h4>Legal</h4><ul><li><a href="#">Términos de Uso</a></li><li><a href="#">Privacidad</a></li><li><a href="#">Cookies</a></li><li><a href="#">Licencias</a></li><li><a href="#">Datos Abiertos</a></li></ul></div>
          </div>
          <div className="fbot">
            <span className="f-copy">© 2025 MECIA · UNAULA · unabot@unaula.edu.co · ig. @unabot · www.mecia.com</span>
            <div className="fbot-r">
              <div className="fib"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></div>
              <div className="fib"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></div>
              <div className="fib"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg></div>
              <div className="fib" id="scroll-top"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"/></svg></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}