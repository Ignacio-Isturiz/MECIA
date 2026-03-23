import React from 'react';

export function TrustedLogos() {
  return (
    <div className="trusted sec-mid">
      <div className="trusted-lbl">Fuentes de datos verificadas</div>
      <div className="logos">
        <div className="logo-e">🏛 DANE</div>
        <div className="logo-e">🏙 Alcaldía MDE</div>
        <div className="logo-e">⚡ EPM</div>
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
            <div className="st-it"><div className="st-n" id="s1">0</div><div className="st-l">Tasa de criminalidad en Medellín (casos por cada 1.000 hab.)</div></div>
            <div className="st-it"><div className="st-n" id="s2">0</div><div className="st-l">Casos en las 3 comunas más afectadas</div></div>
            <div className="st-it"><div className="st-n" id="s3">0</div><div className="st-l">Casos reportados en La Candelaria</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
