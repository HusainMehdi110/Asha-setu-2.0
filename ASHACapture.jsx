import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, newId, newHealthId } from '../db';
import { runSync } from '../syncEngine';
import EmergencySupport from './EmergencySupport';

const FACILITY_OPTIONS = [
  'Sub-centre — Kondgaon',
  'PHC — Wadgaon',
  'Rural Hospital — Shirol',
  'District Hospital — Kolhapur'
];

const normalizePhone = (value) => value.replace(/\D/g, '').slice(-10);

export default function ASHACapture({ t, online, onSaved }) {
  const [mode, setMode] = useState('new'); // 'new' | 'existing'
  const [healthId, setHealthId] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('female');
  const [village, setVillage] = useState('');
  const [phone, setPhone] = useState('');

  const [bp, setBp] = useState('');
  const [pulse, setPulse] = useState('');
  const [temp, setTemp] = useState('');
  const [weight, setWeight] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('');

  const [needsReferral, setNeedsReferral] = useState(false);
  const [referTo, setReferTo] = useState(FACILITY_OPTIONS[1]);
  const [referralReason, setReferralReason] = useState('');
  const [urgency, setUrgency] = useState('routine');
  const [teleconsultOpen, setTeleconsultOpen] = useState(false);
  const [teleconsultConnected, setTeleconsultConnected] = useState(false);

  const [confirmation, setConfirmation] = useState(null);

  const recentVisits = useLiveQuery(async () => {
    const visits = await db.visits.orderBy('timestamp').reverse().limit(6).toArray();
    const patients = await db.patients.toArray();
    const byId = Object.fromEntries(patients.map((p) => [p.id, p]));
    return visits.map((v) => ({ ...v, patient: byId[v.patientId] }));
  }, []);

  function resetForm() {
    setMode('new');
    setHealthId('');
    setName('');
    setAge('');
    setVillage('');
    setPhone('');
    setBp('');
    setPulse('');
    setTemp('');
    setWeight('');
    setSymptoms('');
    setNotes('');
    setNeedsReferral(false);
    setReferralReason('');
    setUrgency('routine');
    setTeleconsultOpen(false);
    setTeleconsultConnected(false);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!name.trim() && mode === 'new') return;
    const normalizedPhone = normalizePhone(phone);

    let patientId;
    let generatedHealthId = null;
    if (mode === 'new') {
      if (normalizedPhone.length !== 10) {
        setConfirmation({ ok: false, msg: t.validPhone });
        return;
      }
      const existingPhone = await db.patients.where('phone').equals(normalizedPhone).first();
      if (existingPhone) {
        setConfirmation({ ok: false, msg: t.phoneAlreadyRegistered });
        return;
      }
      patientId = newId('PT');
      generatedHealthId = newHealthId();
      await db.patients.put({
        id: patientId,
        healthId: generatedHealthId,
        name: name.trim(),
        age,
        gender,
        village: village.trim(),
        phone: normalizedPhone
      });
    } else {
      const existing = await db.patients.where('phone').equals(normalizedPhone).first();
      if (!existing) {
        setConfirmation({ ok: false, msg: t.phoneNotFound });
        return;
      }
      patientId = existing.id;
    }

    const visitId = newId('VS');
    const timestamp = Date.now();
    await db.visits.put({
      id: visitId,
      patientId,
      timestamp,
      recordedBy: 'ASHA — this device',
      vitals: { bp, pulse, temp, weight },
      symptoms: symptoms.trim(),
      notes: notes.trim(),
      synced: 0
    });

    if (needsReferral) {
      const referralId = newId('RF');
      await db.referrals.put({
        id: referralId,
        patientId,
        visitId,
        fromFacility: FACILITY_OPTIONS[0],
        toFacility: referTo,
        reason: referralReason.trim(),
        urgency,
        teleconsultRequested: urgency === 'emergency' && teleconsultOpen,
        teleconsultStatus: urgency === 'emergency' && teleconsultOpen
          ? (teleconsultConnected ? 'connected' : 'requested')
          : null,
        status: 'created',
        createdAt: timestamp,
        updatedAt: timestamp,
        synced: 0
      });
    }

    let result = { pushed: 0, skipped: true };
    if (online) result = await runSync();

    setConfirmation({
      ok: true,
      msg: online && !result.skipped ? t.savedOnline : t.savedOffline,
      phone: normalizedPhone
    });
    resetForm();
    if (onSaved) onSaved();
  }

  return (
    <>
      <EmergencySupport t={t} online={online} />
      <form className="register-sheet" onSubmit={handleSave}>
        <div className="register-section">
          <h2>{t.newPatient} / {t.existingPatient}</h2>
          <div className="mode-toggle">
            <button type="button" className={mode === 'new' ? 'active' : ''} onClick={() => setMode('new')}>
              {t.newPatient}
            </button>
            <button type="button" className={mode === 'existing' ? 'active' : ''} onClick={() => setMode('existing')}>
              {t.existingPatient}
            </button>
          </div>

          {mode === 'existing' ? (
            <div className="field-row">
              <div className="field">
                <label>{t.phone}</label>
                <input type="tel" inputMode="numeric" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit mobile number" required />
              </div>
            </div>
          ) : (
            <>
              <div className="field-row">
                <div className="field">
                  <label>{t.name} *</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="field">
                  <label>{t.age}</label>
                  <input type="number" min="0" value={age} onChange={(e) => setAge(e.target.value)} />
                </div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label>{t.gender}</label>
                  <select value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="female">{t.female}</option>
                    <option value="male">{t.male}</option>
                    <option value="other">{t.other}</option>
                  </select>
                </div>
                <div className="field">
                  <label>{t.village}</label>
                  <input value={village} onChange={(e) => setVillage(e.target.value)} />
                </div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label>{t.phone} *</label>
                  <input type="tel" inputMode="numeric" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit mobile number" required />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="register-section">
          <h2>{t.vitals}</h2>
          <div className="field-row">
            <div className="field">
              <label>{t.bp}</label>
              <input value={bp} onChange={(e) => setBp(e.target.value)} placeholder="120/80" />
            </div>
            <div className="field">
              <label>{t.pulse}</label>
              <input value={pulse} onChange={(e) => setPulse(e.target.value)} placeholder="/min" />
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>{t.temp}</label>
              <input value={temp} onChange={(e) => setTemp(e.target.value)} placeholder="°F" />
            </div>
            <div className="field">
              <label>{t.weight}</label>
              <input value={weight} onChange={(e) => setWeight(e.target.value)} />
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>{t.symptoms}</label>
              <textarea value={symptoms} onChange={(e) => setSymptoms(e.target.value)} />
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>{t.notes}</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="register-section">
          <label className="referral-toggle">
            <input type="checkbox" checked={needsReferral} onChange={(e) => setNeedsReferral(e.target.checked)} />
            {t.referralNeeded}
          </label>

          {needsReferral && (
            <>
              <div className="field-row">
                <div className="field">
                  <label>{t.referTo}</label>
                  <select value={referTo} onChange={(e) => setReferTo(e.target.value)}>
                    {FACILITY_OPTIONS.slice(1).map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label>{t.referralReason}</label>
                  <input value={referralReason} onChange={(e) => setReferralReason(e.target.value)} />
                </div>
              </div>
              <div className="field">
                <label>{t.urgency}</label>
                <div className="urgency-row">
                  {['routine', 'urgent', 'emergency'].map((level) => (
                    <button
                      type="button"
                      key={level}
                      data-level={level}
                      className={urgency === level ? 'active' : ''}
                      onClick={() => {
                        setUrgency(level);
                        if (level !== 'emergency') {
                          setTeleconsultOpen(false);
                          setTeleconsultConnected(false);
                        }
                      }}
                    >
                      {t[level]}
                    </button>
                  ))}
                </div>
              </div>
              {urgency === 'emergency' && (
                <div className="emergency-consult" role="region" aria-label={t.emergencyTeleconsult}>
                  <div className="emergency-consult-heading">
                    <span className="emergency-pulse" aria-hidden="true" />
                    <div>
                      <strong>{t.emergencyTeleconsult}</strong>
                      <p>{t.emergencyTeleconsultHint}</p>
                    </div>
                  </div>
                  {!teleconsultOpen ? (
                    <button type="button" className="teleconsult-btn" onClick={() => setTeleconsultOpen(true)}>
                      ▣ {t.startVideoConsult}
                    </button>
                  ) : (
                    <div className="video-consult-panel">
                      <div className="video-preview patient-preview">
                        <span>●</span>
                        <small>{t.patientAtVillage}</small>
                      </div>
                      <div className="video-preview doctor-preview">
                        <span>♙</span>
                        <small>{teleconsultConnected ? t.cityDoctorConnected : t.connectingCityDoctor}</small>
                      </div>
                      <div className="video-consult-actions">
                        {!teleconsultConnected ? (
                          <button type="button" className="note-save-btn" onClick={() => setTeleconsultConnected(true)}>{t.connectDoctor}</button>
                        ) : <span className="call-live">● {t.callLive}</span>}
                        <button type="button" className="note-cancel-btn" onClick={() => { setTeleconsultOpen(false); setTeleconsultConnected(false); }}>{t.closeConsult}</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <div className="register-section">
          <button className="save-btn" type="submit">{t.saveVisit}</button>
          {confirmation && (
            <div className={`save-confirm ${online ? 'online' : 'offline'}`}>
              <div>
                {confirmation.msg}
                {confirmation.phone && (
                  <div className="health-id-issued">
                    {t.phone}: <strong>{confirmation.phone}</strong>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </form>

      {recentVisits && recentVisits.length > 0 && (
        <div className="recent-list">
          <h3>{t.recentVisits}</h3>
          {recentVisits.map((v) => (
            <div className="recent-item" key={v.id}>
              <span>
                {v.patient?.name || '—'} · {new Date(v.timestamp).toLocaleTimeString()}
                {v.patient?.phone && (
                  <span className="recent-health-id"> · {v.patient.phone}</span>
                )}
              </span>
              <span className={v.synced ? 'synced-pill' : 'pending-pill'}>
                {v.synced ? '✓ synced' : t.pendingSync(1)}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
