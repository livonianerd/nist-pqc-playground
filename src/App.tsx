import { useEffect, useRef, useState } from 'react';
import { navigation } from './data/content';
import {
  Introduction,
  Threat,
  Classical,
  Uses,
  Myths,
  Glossary,
  About,
} from './pages/Education';
import { KemLab, type Shared } from './pages/KemLab';
import { SecureMessage } from './pages/SecureMessage';
import { SignatureLab } from './pages/SignatureLab';
import { Comparison } from './pages/Comparison';
import { Lattice } from './pages/Lattice';
import { Migration } from './pages/Migration';
const getRoute = () => location.hash.slice(1).split('/')[0] || 'introduction';
export default function App() {
  const [route, setRoute] = useState(getRoute);
  const [menu, setMenu] = useState(false);
  const [shared, setShared] = useState<Shared | null>(null);
  const main = useRef<HTMLElement>(null);
  useEffect(() => {
    const change = () => {
      setRoute(getRoute());
      setMenu(false);
      requestAnimationFrame(() => {
        const term = location.hash.split('/')[1];
        if (term) document.getElementById(term)?.scrollIntoView();
        else {
          window.scrollTo(0, 0);
          main.current?.focus();
        }
      });
    };
    window.addEventListener('hashchange', change);
    return () => window.removeEventListener('hashchange', change);
  }, []);
  useEffect(() => {
    document.title = `${navigation.find(([id]) => id === route)?.[1] ?? 'Introduction'} · NIST PQC Playground`;
    const term = location.hash.split('/')[1];
    if (term) document.getElementById(term)?.scrollIntoView();
  }, [route]);
  const pages: Record<string, React.ReactNode> = {
    introduction: <Introduction />,
    'quantum-threat': <Threat />,
    'ml-kem': <KemLab onShared={setShared} />,
    'secure-message': <SecureMessage shared={shared} />,
    'ml-dsa': <SignatureLab key="ml" family="ML-DSA" />,
    'slh-dsa': <SignatureLab key="slh" family="SLH-DSA" />,
    comparison: <Comparison />,
    lattice: <Lattice />,
    classical: <Classical />,
    uses: <Uses />,
    migration: <Migration />,
    myths: <Myths />,
    glossary: <Glossary />,
    about: <About />,
  };
  return (
    <>
      <a
        href="#main"
        className="skip"
        onClick={(e) => {
          e.preventDefault();
          main.current?.focus();
        }}
      >
        Skip to content
      </a>
      <header className="topbar">
        <a className="brand" href="#introduction">
          <span className="brand-mark">⌘</span>
          <span>
            NIST <strong>PQC</strong>
            <small>CRYPTOGRAPHY PLAYGROUND</small>
          </span>
        </a>
        <div className="top-links">
          <span className="local-dot">LOCAL BY DESIGN</span>
          <a href="#about">Standards & sources ↗</a>
        </div>
        <button
          className="menu-button"
          aria-expanded={menu}
          aria-controls="section-nav"
          onClick={() => setMenu(!menu)}
        >
          Explore ☰
        </button>
      </header>
      <div className="shell">
        <aside className={`sidebar ${menu ? 'open' : ''}`}>
          <p className="eyebrow">EXPLORE THE PLAYGROUND</p>
          <nav id="section-nav" aria-label="Sections">
            {navigation.map(([id, label], index) => (
              <a
                key={id}
                href={`#${id}`}
                aria-current={route === id ? 'page' : undefined}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                {label}
              </a>
            ))}
          </nav>
          <div className="sidebar-note">
            <span className="local-dot">YOUR BROWSER. YOUR DATA.</span>
            <p>
              Real cryptography.
              <br />A place to understand it.
            </p>
          </div>
        </aside>
        <main ref={main} id="main" tabIndex={-1}>
          <div className="privacy">
            <span aria-hidden="true">◈</span>
            <p>
              All cryptographic operations in this playground run locally in
              your browser. Keys, plaintext, ciphertext, signatures, and shared
              secrets are not sent to a server.
            </p>
          </div>
          {pages[route] ?? <Introduction />}
          <footer>
            <span>NIST Post-Quantum Cryptography Playground</span>
            <a href="#about">Independent educational project · MIT</a>
          </footer>
        </main>
      </div>
    </>
  );
}
