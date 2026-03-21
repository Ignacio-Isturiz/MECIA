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

const FAQ_ITEMS = [
  {q:'¿MECIA es gratuito?', a:'Sí. MECIA tiene un plan gratuito completo con acceso al dashboard ciudadano, Chatbot Guardián, alertas de seguridad, movilidad y servicios. Los planes Pro incluyen historial extendido, API ilimitada y reportes automáticos.'},
  {q:'¿De dónde vienen los datos de seguridad?', a:'Los datos provienen de la Secretaría de Seguridad de Medellín, el Centro de Mando y Control (CCTV), SISC y el Sistema 123. Los datos se procesan y anonimizan antes de mostrarse.'},
  {q:'¿Cómo funciona la integración con EPM?', a:'MECIA se conecta con la API pública de EPM. Con tu número de cuenta consultas tu saldo, historial de consumo y recibes alertas de cortes programados. No almacenamos tus credenciales.'},
  {q:'¿Con qué frecuencia se actualiza el Metro?', a:'Los datos del Metro de Medellín y Metroplús se actualizan cada 2 minutos durante las horas de operación. Las alertas de incidentes se procesan en tiempo real.'},
  {q:'¿Tiene MECIA datos del SIATA?', a:'Sí. MECIA tiene integración oficial con el SIATA. Las alertas de lluvia intensa, deslizamientos y riesgo hídrico aparecen con latencia menor a 3 minutos.'},
  {q:'¿Puedo usar MECIA fuera de Medellín?', a:'MECIA cubre los 10 municipios del Área Metropolitana del Valle de Aburrá. La expansión a otras ciudades colombianas está en la hoja de ruta para el segundo semestre de 2025.'},
  {q:'¿Hay API para desarrolladores?', a:'Sí. API REST documentada con 1.000 requests/mes gratis. Los planes Pro ofrecen desde 100k hasta ilimitadas, con acceso a endpoints de análisis avanzado y datos históricos desde 2018.'},
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
          <div className="eye">Preguntas Frecuentes</div>
          <h2 className="d3" style={{marginTop:'12px'}}>Todo lo que necesitas saber</h2>
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
            {FAQ_ITEMS.map((item, idx) => (
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
