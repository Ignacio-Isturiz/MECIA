import React, { Suspense, lazy, useState, useEffect, useRef } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

const SplineLoader = () => (
  <div style={{
    width: '100%', height: '520px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '18px'
  }}>
    <div className="logo-mark animate-pulse" style={{ width: '40px', height: '40px' }}>
      <svg width="20" height="20" viewBox="0 0 36 36" fill="none">
        <path d="M6 8C6 6.9 6.9 6 8 6H22C22 6 28 6 28 12V20" stroke="white" strokeWidth="3.4" strokeLinecap="round"/>
        <path d="M6 8V28C6 29.1 6.9 30 8 30H28" stroke="white" strokeWidth="3.4" strokeLinecap="round"/>
        <circle cx="25" cy="10" r="3" fill="white"/>
      </svg>
    </div>
  </div>
);

const PROFILE_ITEMS = [
  {
    q: 'Para quienes emprenden y quieren decidir mejor',
    a: 'Si estás montando o escalando negocio, MECIA te ayuda a leer zonas con más claridad: seguridad del entorno, contexto del barrio y señales útiles para elegir mejor dónde moverte o crecer. Todo en un lenguaje simple y accionable.'
  },
  {
    q: 'Para quienes viven la ciudad día a día',
    a: 'Si quieres salir con más tranquilidad, aquí encuentras recomendaciones cercanas según tu zona: qué tener en cuenta, cómo moverte con más confianza y qué alertas vale la pena revisar antes de salir.'
  },
  {
    q: 'Para equipos que cuidan y gestionan la ciudad',
    a: 'Si trabajas desde una entidad pública, MECIA reúne señales territoriales en un solo lugar para facilitar seguimiento, priorización y comunicación con la comunidad, con enfoque práctico y orientado a decisiones.'
  },
];

export default function FAQ() {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, { rootMargin: '500px' }); // Load 500px before reaching it

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="faq" ref={sectionRef} className="sec-trans sp">
      <div className="w">
        <div className="sh">
          <div className="eye">Hecho para ti</div>
          <h2 className="d3" style={{marginTop:'12px'}}>Una experiencia pensada para cada forma de vivir Medellín</h2>
        </div>
        <div className="faq-layout">
          <div className="faq-sticky">
            <div style={{
              minHeight: '480px',
              borderRadius: '18px',
              overflow: 'hidden',
              position: 'sticky',
              top: '100px'
            }}>
              {inView ? (
                <Suspense fallback={<SplineLoader />}>
                  <Spline
                    scene="https://prod.spline.design/zs6aYoLKRBxwRElM/scene.splinecode"
                    style={{ width: '100%', height: '580px' }}
                  />
                </Suspense>
              ) : <SplineLoader />}
            </div>
          </div>
          <div className="faq-list">
            {PROFILE_ITEMS.map((item, idx) => (
              <div className="faq-it" key={idx}>
                <div className="faq-q">{item.q}<div className="faq-plus">+</div></div>
                <div className="faq-ans"><div className="faq-ans-in">{item.a}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
