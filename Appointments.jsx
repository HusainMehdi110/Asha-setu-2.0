import React, { useEffect, useMemo, useState } from 'react';
import { newId } from '../db';
import { serverStore } from '../serverStore';

const DOCTORS = [
  { name: 'Dr. Anjali Patil', department: 'General Medicine' },
  { name: 'Dr. Rohan Kulkarni', department: 'Maternal & Child Health' },
  { name: 'Dr. Sameer Deshmukh', department: 'Internal Medicine' }
];

function tomorrow() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

export default function Appointments({ t }) {
  const [data, setData] = useState(serverStore.getAll());
  const [patientId, setPatientId] = useState('');
  const [date, setDate] = useState(tomorrow());
  const [time, setTime] = useState('10:30');
  const [doctorIndex, setDoctorIndex] = useState(0);
  const [confirmation, setConfirmation] = useState('');

  useEffect(() => {
    const update = () => setData(serverStore.getAll());
    window.addEventListener('setu-server-updated', update);
    return () => window.removeEventListener('setu-server-updated', update);
  }, []);

  const patients = useMemo(() => [...data.patients].sort((a, b) => a.name.localeCompare(b.name)), [data.patients]);
  const selectedDoctor = DOCTORS[doctorIndex];

  function book(e) {
    e.preventDefault();
    if (!patientId) return;
    const patient = patients.find((p) => p.id === patientId);
    const appointment = {
      id: newId('AP'), patientId, date, time,
      doctorName: selectedDoctor.name, department: selectedDoctor.department,
      facility: 'District Hospital — Kolhapur', status: 'confirmed',
      reminderStatus: 'queued', createdAt: Date.now(), updatedAt: Date.now(),
      reminderMessage: `Namaskar ${patient?.name || ''}, your appointment with ${selectedDoctor.name} is on ${date} at ${time}. Please carry your Health ID.`
    };
    serverStore.saveAppointment(appointment);
    setConfirmation(t.appointmentBooked);
  }

  function markSent(id) {
    serverStore.updateAppointment(id, { reminderStatus: 'sent', reminderSentAt: Date.now() });
  }

  const upcoming = [...data.appointments].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  const patientById = Object.fromEntries(patients.map((p) => [p.id, p]));

  return (
    <div className="appointment-layout">
      <section className="appointment-sheet">
        <div className="section-heading"><span>{t.appointmentTitle}</span><small>{t.appointmentHint}</small></div>
        <form onSubmit={book}>
          <div className="field-row"><div className="field">
            <label>{t.selectPatient}</label>
            <select required value={patientId} onChange={(e) => setPatientId(e.target.value)}>
              <option value="">{t.selectPatient}</option>
              {patients.map((p) => <option key={p.id} value={p.id}>{p.name} · {p.phone || p.healthId}</option>)}
            </select>
          </div></div>
          {patients.length === 0 && <p className="inline-help">{t.selectPatientEmpty}</p>}
          <div className="field-row">
            <div className="field"><label>{t.appointmentDate}</label><input required min={tomorrow()} type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
            <div className="field"><label>{t.appointmentTime}</label><input required type="time" value={time} onChange={(e) => setTime(e.target.value)} /></div>
          </div>
          <div className="field-row"><div className="field">
            <label>{t.doctorName}</label>
            <select value={doctorIndex} onChange={(e) => setDoctorIndex(Number(e.target.value))}>
              {DOCTORS.map((doctor, index) => <option value={index} key={doctor.name}>{doctor.name} — {doctor.department}</option>)}
            </select>
          </div></div>
          <button className="save-btn" disabled={!patients.length} type="submit">{t.bookAppointment}</button>
          {confirmation && <div className="save-confirm online">✓ {confirmation}</div>}
        </form>
      </section>

      <section className="reminder-panel">
        <h2>{t.upcomingAppointments}</h2>
        {!upcoming.length ? <div className="empty-note">{t.noHistory}</div> : upcoming.map((a) => (
          <article className="appointment-card" key={a.id}>
            <strong>{patientById[a.patientId]?.name || a.patientId}</strong>
            <div>{a.date} · {a.time}</div><div>{a.doctorName}</div><div className="meta">{a.department} · {a.facility}</div>
          </article>
        ))}
        <h2 className="reminder-heading">{t.reminderCentre}</h2><p className="dashboard-hint">{t.reminderHint}</p>
        {!upcoming.length ? null : upcoming.map((a) => (
          <article className="reminder-card" key={`reminder-${a.id}`}>
            <span className={`reminder-status ${a.reminderStatus}`}>{a.reminderStatus === 'sent' ? t.reminderSent : t.reminderQueued}</span>
            <p>{a.reminderMessage}</p>
            {a.reminderStatus !== 'sent' && <button className="note-save-btn" onClick={() => markSent(a.id)}>{t.sendNow}</button>}
          </article>
        ))}
      </section>
    </div>
  );
}
