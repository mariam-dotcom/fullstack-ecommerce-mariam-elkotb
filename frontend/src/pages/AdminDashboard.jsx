import { useState, useEffect } from 'react';
import client from '../api/client';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [collections, setCollections] = useState([]);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [priceCents, setPriceCents] = useState('');
  const [stockCount, setStockCount] = useState('');
  const [collectionId, setCollectionId] = useState('');
  const [image, setImage] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSummary, setEditSummary] = useState('');
  const [editPriceCents, setEditPriceCents] = useState('');
  const [editStockCount, setEditStockCount] = useState('');
  const [editCollectionId, setEditCollectionId] = useState('');
  const [editImage, setEditImage] = useState(null);

  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionBlurb, setNewCollectionBlurb] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [statsRes, colRes, itemsRes] = await Promise.all([
          client.get('/stats'),
          client.get('/collections'),
          client.get('/catalog', { params: { perPage: 60 } }),
        ]);
        setStats(statsRes.data);
        setCollections(colRes.data);
        setItems(itemsRes.data.items);
      } catch {
        setError('Could not load dashboard data.');
      }
    })();
  }, [refreshKey]);

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    const form = new FormData();
    form.append('title', title);
    form.append('summary', summary);
    form.append('priceCents', priceCents);
    form.append('stockCount', stockCount);
    form.append('collectionId', collectionId);
    if (image) form.append('image', image);

    try {
      await client.post('/catalog', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess('Item created.');
      setTitle(''); setSummary(''); setPriceCents(''); setStockCount(''); setCollectionId(''); setImage(null);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not create item.');
    }
  }

  async function handleDelete(id) {
    await client.delete(`/catalog/${id}`);
    setRefreshKey((k) => k + 1);
  }

  function startEdit(item) {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditSummary(item.summary || '');
    setEditPriceCents(item.priceCents);
    setEditStockCount(item.stockCount);
    setEditCollectionId(item.collectionId || item.collection?.id || '');
    setEditImage(null);
    setError('');
    setSuccess('');
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function handleUpdate(e, id) {
    e.preventDefault();
    setError('');
    setSuccess('');
    const form = new FormData();
    form.append('title', editTitle);
    form.append('summary', editSummary);
    form.append('priceCents', editPriceCents);
    form.append('stockCount', editStockCount);
    form.append('collectionId', editCollectionId);
    if (editImage) form.append('image', editImage);

    try {
      await client.patch(`/catalog/${id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess('Item updated.');
      setEditingId(null);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not update item.');
    }
  }

  async function handleCreateCollection(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await client.post('/collections', { name: newCollectionName, blurb: newCollectionBlurb });
      setSuccess('Category created.');
      setNewCollectionName('');
      setNewCollectionBlurb('');
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not create category.');
    }
  }

  async function handleDeleteCollection(id) {
    try {
      await client.delete(`/collections/${id}`);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not delete category (it may still have items in it).');
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-ink">Store dashboard</h1>

      {stats && (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="Items" value={stats.itemCount} />
          <Stat label="Collections" value={stats.collectionCount} />
          <Stat label="Accounts" value={stats.accountCount} />
          <Stat label="Open baskets value" value={`$${(stats.openBasketValueCents / 100).toFixed(2)}`} />
        </div>
      )}

      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}
      {success && <p className="mt-6 text-sm text-sage">{success}</p>}

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-ink">Categories</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {collections.map((c) => (
            <li key={c.id} className="flex items-center gap-2 rounded-full border border-ink/15 px-3 py-1 text-sm">
              {c.name}
              <button
                onClick={() => handleDeleteCollection(c.id)}
                className="text-slate/40 hover:text-ink"
                title="Delete category"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
        <form onSubmit={handleCreateCollection} className="mt-4 flex flex-wrap gap-3">
          <input
            className="field max-w-[200px]"
            placeholder="New category name"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            required
          />
          <input
            className="field max-w-[280px]"
            placeholder="Short description (optional)"
            value={newCollectionBlurb}
            onChange={(e) => setNewCollectionBlurb(e.target.value)}
          />
          <button type="submit" className="btn-secondary">Add category</button>
        </form>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-ink">Add a new item</h2>
        <form onSubmit={handleCreate} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input className="field" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <select className="field" value={collectionId} onChange={(e) => setCollectionId(e.target.value)} required>
            <option value="">Choose collection…</option>
            {collections.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input className="field" placeholder="Price in cents (e.g. 4900)" value={priceCents} onChange={(e) => setPriceCents(e.target.value)} required />
          <input className="field" placeholder="Stock count" value={stockCount} onChange={(e) => setStockCount(e.target.value)} required />
          <textarea className="field sm:col-span-2" placeholder="Summary" value={summary} onChange={(e) => setSummary(e.target.value)} />
          <input className="field sm:col-span-2" type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
          <button type="submit" className="btn-primary self-start sm:col-span-2">Create item</button>
        </form>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-ink">Catalog</h2>
        <ul className="mt-4 divide-y divide-ink/10">
          {items.map((item) => (
            <li key={item.id} className="py-3">
              {editingId === item.id ? (
                <form onSubmit={(e) => handleUpdate(e, item.id)} className="grid gap-2 rounded-md border border-ink/10 bg-ink/[0.02] p-4 sm:grid-cols-2">
                  <input className="field" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required />
                  <select className="field" value={editCollectionId} onChange={(e) => setEditCollectionId(e.target.value)} required>
                    {collections.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <input className="field" value={editPriceCents} onChange={(e) => setEditPriceCents(e.target.value)} required />
                  <input className="field" value={editStockCount} onChange={(e) => setEditStockCount(e.target.value)} required />
                  <textarea className="field sm:col-span-2" value={editSummary} onChange={(e) => setEditSummary(e.target.value)} />
                  <input className="field sm:col-span-2" type="file" accept="image/*" onChange={(e) => setEditImage(e.target.files[0])} />
                  <div className="flex gap-2 sm:col-span-2">
                    <button type="submit" className="btn-primary">Save changes</button>
                    <button type="button" onClick={cancelEdit} className="btn-secondary">Cancel</button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-ink">{item.title}</p>
                    <p className="text-xs text-slate/60">{item.collection?.name} · {item.stockCount} in stock</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="price-tag">${(item.priceCents / 100).toFixed(2)}</span>
                    <button onClick={() => startEdit(item)} className="text-sm text-slate/50 hover:text-ink">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="text-sm text-slate/50 hover:text-ink">Delete</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-md border border-ink/10 p-4">
      <p className="font-mono text-2xl font-semibold text-ink">{value}</p>
      <p className="text-xs uppercase tracking-wide text-slate/60">{label}</p>
    </div>
  );
}