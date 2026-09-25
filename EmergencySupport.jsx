import React, { useState } from 'react';

// This is a cached local directory for the prototype. In deployment, the
// district health authority supplies and periodically updates these entries.
const LOCAL_DIRECTORY = [
  { type: 'blood', icon: '🩸', name: 'Rural Hospital blood storage unit', place: 'Shirol · 6.4 km', availability: 'Call to confirm blood group' },
  { type: 'pharmacy', icon: '✚', name: 'Jan Aushadhi pharmacy', place: 'Wadgaon PHC · 2.1 km', availability: 'Essential medicines' }
];

export default function EmergencySupport({ t, online }) {
  const [doctorCalling, setDoctorCalling] = useState(false);
  const [directoryOpen, setDirectoryOpen] = useState(false);

  return (
    <section className="emergency-support" aria-label={t.emergencySupport}>
      <div className="emergency-support-top">
        <div><span className="support-kicker">{t.emergencySupport}</span><strong>{t.getHelpFast}</strong></div>
        <span className={`support-network ${online ? 'online' : ''}`}>{online ? t.directoryOnline : t.directoryOffline}</span>
      </div>
      <div className="emergency-actions">
        <button type="button" className="offline-call-btn" onClick={() => setDoctorCalling(true)}>
          <span>☎</span><span>{t.offlineVoiceCall}<small>{t.offlineVoiceCallSub}</small></span>
        </button>
        <a className="ambulance-btn" href="tel:108" aria-label={t.callAmbulance}>
          <span>🚑</span><span>{t.callAmbulance}<small>{t.ambulanceNumber}</small></span>
        </a>
        <button type="button" className="directory-btn" onClick={() => setDirectoryOpen((open) => !open)}>
          <span>⌖</span><span>{t.nearbySupport}<small>{t.bloodBankAndPharmacy}</small></span>
        </button>
      </div>
      {doctorCalling && (
        <div className="call-sheet">
          <span className="call-indicator">●</span><div><strong>{t.callingOnCallDoctor}</strong><p>{t.callUsesGsm}</p></div>
          <button type="button" className="note-cancel-btn" onClick={() => setDoctorCalling(false)}>{t.endCall}</button>
        </div>
      )}
      {directoryOpen && <div className="nearby-directory">
        <p>{t.directoryNotice}</p>
        {LOCAL_DIRECTORY.map((item) => <article className="directory-item" key={item.type}>
          <span className={`directory-icon ${item.type}`}>{item.icon}</span><div><strong>{item.name}</strong><span>{item.place} · {item.availability}</span></div>
        </article>)}
      </div>}
    </section>
  );
}
