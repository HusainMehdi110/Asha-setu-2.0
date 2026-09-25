import React, { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db';
import { strings } from './i18n';
import { runSync } from './syncEngine';
import { serverStore } from './serverStore';
import StatusBar from './components/StatusBar';
import ASHACapture from './components/ASHACapture';
import Dashboard from './components/Dashboard';
import Appointments from './components/Appointments';
import DoctorPortal from './components/DoctorPortal';

export default function App() {
  const [lang, setLang] = useState('en');
  const [view, setView] = useState('field');
  // "online" here is a simulated flag the demo controls directly, rather
  // than trusting navigator.onLine — this is what lets you show the
  // offline -> reconnect -> sync moment live without touching real wifi.
  const [online, setOnline] = useState(navigator.onLine);

  const t = { ...strings.en, ...strings[lang] };
  const navItems = [
    { id: 'field', label: t.fieldView, icon: '＋' },
    { id: 'dashboard', label: t.dashboardView, icon: '▦' },
    { id: 'appointments', label: t.appointments, icon: '◷' },
    { id: 'doctor', label: t.doctorPortal, icon: '♙' }
  ];

  const pendingCount = useLiveQuery(async () => {
    const [visits, referrals] = await Promise.all([
      db.visits.where('synced').equals(0).count(),
      db.referrals.where('synced').equals(0).count()
    ]);
    return visits + referrals;
  }, [], 0);

  useEffect(() => {
    if (online) runSync();
  }, [online]);

  async function handleSync() {
    await runSync();
  }

  function handleReset() {
    db.patients.clear();
    db.visits.clear();
    db.referrals.clear();
    serverStore.clearAll();
  }

  return (
    <div className="app-shell">
      <StatusBar
        t={t}
        online={online}
        pendingCount={pendingCount || 0}
        onToggleOnline={() => setOnline((o) => !o)}
        onSync={handleSync}
      />

      <header className="top-header">
        <div className="brand">
          <span className="brand-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 64 64" fill="none">
              <path d="M14 40 C14 26, 26 26, 32 32 C38 38, 50 38, 50 24" stroke="#C96E27" strokeWidth="6" strokeLinecap="round" />
              <circle cx="14" cy="40" r="4.5" fill="#FAF9F6" />
              <circle cx="50" cy="24" r="4.5" fill="#FAF9F6" />
            </svg>
          </span>
          <span className="brand-text">
            <span className="brand-mark">{t.appName}</span>
            <span className="brand-tagline">{t.tagline}</span>
          </span>
        </div>

        <nav className="nav-tabs" aria-label="Primary navigation">
          {navItems.map((item) => (
            <button key={item.id} className={view === item.id ? 'active' : ''} onClick={() => setView(item.id)}>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="lang-switch">
          <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
          <button className={lang === 'mr' ? 'active' : ''} onClick={() => setLang('mr')}>मर</button>
        </div>
      </header>

      <main className="main-area">
        {view === 'field' ? (
          <ASHACapture t={t} online={online} />
        ) : view === 'dashboard' ? (
          <Dashboard t={t} />
        ) : view === 'appointments' ? (
          <Appointments t={t} />
        ) : (
          <DoctorPortal t={t} />
        )}

        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <button className="reset-link" onClick={handleReset}>
            {t.resetDemo}
          </button>
        </div>
      </main>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        {navItems.map((item) => (
          <button key={item.id} className={view === item.id ? 'active' : ''} onClick={() => setView(item.id)}>
            <span aria-hidden="true">{item.icon}</span>
            <small>{item.label}</small>
          </button>
        ))}
      </nav>
    </div>
  );
}
