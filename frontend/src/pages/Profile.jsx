import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';

export default function Profile() {
  const { account } = useAuth();
  const [displayName, setDisplayName] = useState(account?.displayName || '');
  const [saved, setSaved] = useState(false);

  async function handleSave(e) {
    e.preventDefault();
    await client.patch('/accounts/me', { displayName });
    const stored = JSON.parse(localStorage.getItem('nimbus_account'));
    localStorage.setItem('nimbus_account', JSON.stringify({ ...stored, displayName }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="mx-auto max-w-sm px-6 py-16">
      <h1 className="font-display text-2xl font-semibold text-ink">Your profile</h1>
      <form onSubmit={handleSave} className="mt-6 flex flex-col gap-4">
        <label className="text-sm font-medium text-ink">
          Display name
          <input className="field mt-1" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        </label>
        <p className="text-sm text-slate/60">Email: {account?.email}</p>
        <p className="text-sm text-slate/60">Role: {account?.role}</p>
        <button type="submit" className="btn-primary self-start">{saved ? 'Saved ✓' : 'Save changes'}</button>
      </form>
    </div>
  );
}
