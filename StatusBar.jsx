import React from 'react';

export default function StatusBar({ t, online, pendingCount, onToggleOnline, onSync }) {
  return (
    <div className={`status-bar ${online ? '' : 'is-offline'}`}>
      <span>
        <span className="dot" />
        {online ? t.online : t.offline}
        {pendingCount > 0 ? ` · ${t.pendingSync(pendingCount)}` : ''}
      </span>
      <span className="status-bar-right">
        <button onClick={onToggleOnline}>
          {online ? t.goOffline : t.goOnline}
        </button>
        {online && pendingCount > 0 && (
          <button onClick={onSync}>{t.syncing}</button>
        )}
      </span>
    </div>
  );
}
