import React from 'react';

export default function VideoSection() {
  return (
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
  );
}
