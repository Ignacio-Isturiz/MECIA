import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { initLandingPageAnimation } from './HomePageAnimation';

// Landing Components
import Hero from '@/components/landing/Hero';
import { TrustedLogos, StatsStrip } from '@/components/landing/TrustedStats';
import Features from '@/components/landing/Features';
import FAQ from '@/components/landing/FAQ';
import Footer from '@/components/landing/Footer';

export default function HomePage() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Delay initialization slightly to let the browser prioritize LCP (hero text)
    const timeout = setTimeout(() => {
      const cleanup = initLandingPageAnimation(containerRef.current);
      window._mecia_cleanup = cleanup;
    }, 150); // Increased 150ms for even better LCP priority

    return () => {
      clearTimeout(timeout);
      if (window._mecia_cleanup) window._mecia_cleanup();
    };
  }, []);

  return (
    <div ref={containerRef}>

      {/* ══ WEBGL CANVAS ══ */}
      <div className="hero-canvas-bg">
        <canvas id="city-canvas"></canvas>
      </div>

      {/* ══ NAVBAR ══ */}
      <header id="nav">
        <Link className="logo" to="/">
          <div className="logo-mark">
            <svg width="16" height="16" viewBox="0 0 36 36" fill="none">
              <path d="M6 8C6 6.9 6.9 6 8 6H22C22 6 28 6 28 12V20" stroke="white" strokeWidth="3.4" strokeLinecap="round"/>
              <path d="M6 8V28C6 29.1 6.9 30 8 30H28" stroke="white" strokeWidth="3.4" strokeLinecap="round"/>
              <circle cx="25" cy="10" r="3" fill="white"/>
            </svg>
          </div>
          <span className="logo-text">MECIA</span>
        </Link>
        <nav className="nav-links">
          <a href="#" className="active">Inicio</a>
          <a href="#features">Plataforma</a>
          <a href="#faq">Hecho para ti</a>
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
          <Link to="/login" className="btn btn-outline" style={{padding:'9px 20px',fontSize:'13px'}} viewTransition>Iniciar Sesión</Link>
          <Link to="/register" className="btn btn-g" style={{padding:'9px 20px',fontSize:'13px'}} viewTransition>Explorar MECIA →</Link>
        </div>
      </header>

      {/* ══ SECTIONS ══ */}
      <Hero />
      <TrustedLogos />
      <StatsStrip />
      <Features />
      <FAQ />
      <Footer />
    </div>
  );
}