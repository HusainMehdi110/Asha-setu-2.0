import React, { useEffect, useState } from 'react';
import { serverStore } from '../serverStore';
import { STATUS_ORDER } from '../i18n';

export default function Dashboard({ t }) {
  const [data, setData] = useState(serverStore.getAll());
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    const handler = () => setData(serverStore.getAll());
    window.addEventListener('setu-server-updated', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('setu-server-updated', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  const patientsById = Object.fromEntries(data.patients.map((p) => [p.id, p]));

  const columns = STATUS_ORDER.map((status) => ({
    status,
    label: t[status],
    referrals: data.referrals
      .filter((r) => r.status === status)
      .sort((a, b) => b.updatedAt - a.updatedAt)
  }));

  function advance(referral) {
    const idx = STATUS_ORDER.indexOf(referral.status);
    if (idx < 0 || idx === STATUS_ORDER.length - 1) return;
    const next = STATUS_ORDER[idx + 1];
    serverStore.updateReferralStatus(referral.id, next);
  }

  function startNote(referral) {
    setEditingId(referral.id);
    setDraft(referral.doctorNote || '');
  }

  function cancelNote() {
    setEditingId(null);
    setDraft('');
  }

  function saveNote(referral) {
    serverStore.addDoctorNote(referral.id, draft.trim());
    setEditingId(null);
    setDraft('');
  }

  const totalReferrals = data.referrals.length;

  return (
    <div>
      <p className="dashboard-hint">{t.facilityDashboardHint}</p>

      {totalReferrals === 0 ? (
        <div className="empty-note">{t.noReferrals}</div>
      ) : (
        <div className="status-board">
          {columns.map((col) => (
            <div className="status-column" key={col.status}>
              <div className="status-column-header">
                <span className="status-dot" style={{ background: `var(--status-${col.status})` }} />
                {col.label}
                <span className="status-count">{col.referrals.length}</span>
              </div>
              {col.referrals.map((r) => {
                const patient = patientsById[r.patientId];
                const isLast = col.status === STATUS_ORDER[STATUS_ORDER.length - 1];
                return (
                  <div className="referral-card" key={r.id}>
                    <div className={`urgency-tag ${r.urgency}`}>{t[r.urgency]}</div>
                    {r.teleconsultRequested && <div className="teleconsult-flag">▣ {r.teleconsultStatus === 'connected' ? t.callLive : t.emergencyTeleconsult}</div>}
                    {r.needsReview && <div className="review-flag">⚠ {t.needsReview}</div>}
                    <div className="patient-name">{patient?.name || t.patientId + ': ' + r.patientId}</div>
                    {patient?.phone && <div className="meta">{t.phone}: {patient.phone}</div>}
                    <div className="meta">{r.fromFacility} → {r.toFacility}</div>
                    {r.reason && <div className="meta">{r.reason}</div>}

                    {editingId === r.id ? (
                      <div className="note-editor">
                        <textarea
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          placeholder={t.checkupNotePlaceholder}
                          autoFocus
                        />
                        <div className="note-editor-actions">
                          <button type="button" className="note-cancel-btn" onClick={cancelNote}>
                            {t.cancelNote}
                          </button>
                          <button type="button" className="note-save-btn" onClick={() => saveNote(r)}>
                            {t.saveCheckupNote}
                          </button>
                        </div>
                      </div>
                    ) : r.doctorNote ? (
                      <div className="doctor-note">
                        <div className="doctor-note-label">{t.checkupNote}</div>
                        <p>{r.doctorNote}</p>
                        <div className="doctor-note-meta">
                          {t.notedOn} {new Date(r.doctorNoteAt).toLocaleString()}
                        </div>
                        <button type="button" className="note-link-btn" onClick={() => startNote(r)}>
                          {t.editCheckupNote}
                        </button>
                      </div>
                    ) : (
                      <button type="button" className="note-link-btn" onClick={() => startNote(r)}>
                        {t.addCheckupNote}
                      </button>
                    )}

                    {!isLast && (
                      <button className="advance-btn" onClick={() => advance(r)}>
                        {t.markNext} →
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
