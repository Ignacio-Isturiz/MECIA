import React from 'react';

export function TrustedLogos() {
  return (
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
  );
}

export function StatsStrip() {
  return (
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
  );
}
