import Dexie from 'dexie';

// This is the ON-DEVICE store. It is what the ASHA worker's app writes to
// when there is no connectivity. Nothing here is visible to any other
// facility until it has been synced.
export const db = new Dexie('setu-device-store');

db.version(1).stores({
  patients: 'id, healthId, name, village',
  visits: 'id, patientId, timestamp, synced',
  referrals: 'id, patientId, visitId, status, urgency, synced, updatedAt'
});

// Phone is the practical lookup key for frontline workers. Existing demo
// data is upgraded in place; the Health ID remains available for later ABDM
// interoperability but is not needed at the point of care.
db.version(2).stores({
  patients: 'id, healthId, name, village, phone',
  visits: 'id, patientId, timestamp, synced',
  referrals: 'id, patientId, visitId, status, urgency, synced, updatedAt'
});

export function newId(prefix) {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  const time = Date.now().toString(36).slice(-4).toUpperCase();
  return `${prefix}-${time}${rand}`;
}

export function newHealthId() {
  // Loosely mirrors an ABHA-style 14-digit health ID, shown grouped for
  // readability. Not a real ABDM integration — a prototype-scale stand-in
  // so the record shape stays compatible with that direction later.
  const digits = Array.from({ length: 14 }, () => Math.floor(Math.random() * 10)).join('');
  return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6, 10)}-${digits.slice(10, 14)}`;
}
