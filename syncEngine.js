import { db } from './db';
import { serverStore } from './serverStore';

// Pushes every unsynced record from the device store to the server store,
// then marks it synced. This is the function that runs the moment
// connectivity returns.
export async function runSync() {
  if (!navigator.onLine) return { pushed: 0, skipped: true };

  const [patients, visits, referrals] = await Promise.all([
    db.patients.toArray(),
    db.visits.where('synced').equals(0).toArray(),
    db.referrals.where('synced').equals(0).toArray()
  ]);

  patients.forEach((p) => serverStore.upsertPatient(p));

  for (const v of visits) {
    serverStore.upsertVisit({ ...v, synced: 1 });
    await db.visits.update(v.id, { synced: 1 });
  }

  for (const r of referrals) {
    serverStore.upsertReferral({ ...r, synced: 1 });
    await db.referrals.update(r.id, { synced: 1 });
  }

  return { pushed: visits.length + referrals.length, skipped: false };
}

// Subscribe to connectivity changes and auto-sync on reconnect.
export function watchConnectivity(onChange) {
  const handler = async () => {
    const online = navigator.onLine;
    if (online) await runSync();
    onChange(online);
  };
  window.addEventListener('online', handler);
  window.addEventListener('offline', handler);
  return () => {
    window.removeEventListener('online', handler);
    window.removeEventListener('offline', handler);
  };
}
