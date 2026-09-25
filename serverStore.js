// A stand-in for the district health server. In a real deployment this
// would be a REST/FHIR API behind the sync engine. For the prototype it's
// backed by localStorage under its own namespace, kept deliberately
// separate from the device's IndexedDB store (src/db.js) so the two
// genuinely behave like two different machines: nothing appears here
// until the sync engine pushes it across.

const KEY = 'setu-server-store-v1';

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    const data = raw ? JSON.parse(raw) : {};
    return {
      patients: data.patients || [],
      visits: data.visits || [],
      referrals: data.referrals || [],
      appointments: data.appointments || []
    };
  } catch {
    return { patients: [], visits: [], referrals: [], appointments: [] };
  }
}

function write(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent('setu-server-updated'));
}

export const serverStore = {
  getAll() {
    return read();
  },

  upsertPatient(patient) {
    const data = read();
    const idx = data.patients.findIndex((p) => p.id === patient.id);
    if (idx >= 0) data.patients[idx] = patient;
    else data.patients.push(patient);
    write(data);
  },

  upsertVisit(visit) {
    const data = read();
    const idx = data.visits.findIndex((v) => v.id === visit.id);
    if (idx >= 0) {
      // Simple conflict policy: if the incoming record and the stored one
      // were both edited (different updatedAt than what we last saw),
      // don't silently overwrite — flag it for a human to review.
      const existing = data.visits[idx];
      if (existing.updatedAt && visit.updatedAt && existing.updatedAt !== visit.baseUpdatedAt) {
        visit.needsReview = true;
      }
      data.visits[idx] = visit;
    } else {
      data.visits.push(visit);
    }
    write(data);
  },

  upsertReferral(referral) {
    const data = read();
    const idx = data.referrals.findIndex((r) => r.id === referral.id);
    if (idx >= 0) data.referrals[idx] = referral;
    else data.referrals.push(referral);
    write(data);
  },

  updateReferralStatus(id, status) {
    const data = read();
    const idx = data.referrals.findIndex((r) => r.id === id);
    if (idx >= 0) {
      data.referrals[idx].status = status;
      data.referrals[idx].updatedAt = Date.now();
      write(data);
    }
  },

  addDoctorNote(id, note) {
    const data = read();
    const idx = data.referrals.findIndex((r) => r.id === id);
    if (idx >= 0) {
      data.referrals[idx].doctorNote = note;
      data.referrals[idx].doctorNoteAt = Date.now();
      data.referrals[idx].updatedAt = Date.now();
      write(data);
    }
  },

  saveAppointment(appointment) {
    const data = read();
    const idx = data.appointments.findIndex((a) => a.id === appointment.id);
    if (idx >= 0) data.appointments[idx] = appointment;
    else data.appointments.push(appointment);
    write(data);
  },

  updateAppointment(id, changes) {
    const data = read();
    const idx = data.appointments.findIndex((a) => a.id === id);
    if (idx >= 0) {
      data.appointments[idx] = { ...data.appointments[idx], ...changes, updatedAt: Date.now() };
      write(data);
    }
  },

  clearAll() {
    write({ patients: [], visits: [], referrals: [], appointments: [] });
  }
};
