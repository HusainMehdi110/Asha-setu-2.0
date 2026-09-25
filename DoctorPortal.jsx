import React, { useEffect, useMemo, useState } from 'react';
import { serverStore } from '../serverStore';

export default function DoctorPortal({ t }) {
  const [doctorId, setDoctorId] = useState('');
  const [signedIn, setSignedIn] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [data, setData] = useState(serverStore.getAll());

  useEffect(() => {
    const update = () => setData(serverStore.getAll());
    window.addEventListener('setu-server-updated', update);
    return () => window.removeEventListener('setu-server-updated', update);
  }, []);

  const results = useMemo(() => data.patients.filter((p) => [p.name, p.phone, p.village].join(' ').toLowerCase().includes(query.toLowerCase())), [data.patients, query]);
  const patient = data.patients.find((p) => p.id === selectedId);
  const visits = data.visits.filter((v) => v.patientId === selectedId).sort((a, b) => b.timestamp - a.timestamp);
  const referrals = data.referrals.filter((r) => r.patientId === selectedId).sort((a, b) => b.updatedAt - a.updatedAt);
  const appointments = data.appointments.filter((a) => a.patientId === selectedId).sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`));

  if (!signedIn) return <section className="login-sheet"><div className="login-badge">CLINICAL ACCESS</div><h1>{t.doctorLogin}</h1><p>{t.doctorLoginHint}</p><form onSubmit={(e) => { e.preventDefault(); if (doctorId.trim()) setSignedIn(true); }}><div className="field"><label>{t.doctorId}</label><input required value={doctorId} onChange={(e) => setDoctorId(e.target.value)} placeholder={t.doctorIdPlaceholder} /></div><button className="save-btn" type="submit">{t.continueToPortal}</button></form></section>;

  return <section className="doctor-workspace">
    <div className="portal-header"><div><span className="login-badge">DOCTOR {doctorId}</span><h1>{t.doctorPortal}</h1></div><button className="note-cancel-btn" onClick={() => { setSignedIn(false); setSelectedId(null); }}>{t.signOut}</button></div>
    <div className="search-box"><label>{t.patientSearch}</label><input autoFocus type="tel" inputMode="numeric" value={query} onChange={(e) => { setQuery(e.target.value); setSelectedId(null); }} placeholder={t.patientSearchHint} /></div>
    {!selectedId ? <div className="patient-results">{results.length ? results.map((p) => <button className="patient-result" key={p.id} onClick={() => setSelectedId(p.id)}><strong>{p.name}</strong><span>{p.phone || 'Phone not recorded'}</span><span>{p.age ? `${p.age} yrs · ` : ''}{p.village || 'Village not recorded'}</span></button>) : <div className="empty-note">{t.noPatientsFound}</div>}</div> : <PatientHistory t={t} patient={patient} visits={visits} referrals={referrals} appointments={appointments} back={() => setSelectedId(null)} />}
  </section>;
}

function PatientHistory({ t, patient, visits, referrals, appointments, back }) {
  return <div className="history-view"><button className="note-link-btn" onClick={back}>← {t.backToSearch}</button><div className="patient-profile"><div><span className="login-badge">{t.patientProfile}</span><h2>{patient?.name}</h2><p>{patient?.phone || 'Phone not recorded'} · {patient?.age || '—'} yrs · {patient?.gender || '—'}</p><p>{patient?.village || 'Village not recorded'}</p></div></div><h2>{t.patientHistory}</h2><HistorySection title={t.visitHistory} empty={t.noHistory}>{visits.map((v) => <div className="history-item" key={v.id}><strong>{new Date(v.timestamp).toLocaleString()}</strong><p>{v.symptoms || 'No symptoms recorded'}</p><span>BP {v.vitals?.bp || '—'} · Pulse {v.vitals?.pulse || '—'} · Temp {v.vitals?.temp || '—'}</span>{v.notes && <p className="meta">{v.notes}</p>}</div>)}</HistorySection><HistorySection title={t.referralHistory} empty={t.noHistory}>{referrals.map((r) => <div className="history-item" key={r.id}><strong>{r.status}</strong><p>{r.fromFacility} → {r.toFacility}</p><span>{r.reason || 'Reason not recorded'} · {r.urgency}</span>{r.doctorNote && <p className="doctor-note">{r.doctorNote}</p>}</div>)}</HistorySection><HistorySection title={t.appointmentHistory} empty={t.noHistory}>{appointments.map((a) => <div className="history-item" key={a.id}><strong>{a.date} · {a.time}</strong><p>{a.doctorName} · {a.department}</p><span>{a.status} · Reminder {a.reminderStatus}</span></div>)}</HistorySection></div>;
}

function HistorySection({ title, children, empty }) { const entries = React.Children.toArray(children); return <section className="history-section"><h3>{title}</h3>{entries.length ? entries : <p className="inline-help">{empty}</p>}</section>; }
