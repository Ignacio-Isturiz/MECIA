import React from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
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
          <Link to="/register" className="btn btn-g" id="hero-cta">Comenzar Gratis →</Link>
          <a href="#hdash" className="btn btn-outline">Ver el Dashboard</a>
        </div>

        {/* MOCKUP */}
        <div className="hero-dash-wrap" id="hdash">
          <div className="mk">
            <div className="mk-top">
              <div className="mk-logo-row">
                <img src="/mecialogo.png" alt="MECIA" style={{ height: '22px', width: 'auto' }} />
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
  );
}
