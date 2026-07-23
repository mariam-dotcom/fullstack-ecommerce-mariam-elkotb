import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useCatalogItem, useRatings } from '../hooks/useCatalog';
import { useBasket } from '../context/BasketContext';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import { useQueryClient } from '@tanstack/react-query';
import { resolveImage } from '../utils/image';

export default function ItemDetail() {
  const { id } = useParams();
  const { data: item, isLoading } = useCatalogItem(id);
  const { data: ratings } = useRatings(id);
  const { addItem } = useBasket();
  const { account } = useAuth();
  const queryClient = useQueryClient();
  const [stars, setStars] = useState(5);
  const [note, setNote] = useState('');
  const [added, setAdded] = useState(false);

  if (isLoading || !item) return <p className="mx-auto max-w-4xl px-6 py-12 text-sm text-slate/60">Loading…</p>;

  const imageSrc = resolveImage(item.imagePath);

  async function handleAdd() {
    await addItem(item.id, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  async function handleRate(e) {
    e.preventDefault();
    await client.post(`/ratings/${item.id}`, { stars, note });
    setNote('');
    queryClient.invalidateQueries({ queryKey: ['ratings', id] });
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="grid gap-10 sm:grid-cols-2">
        <img src={imageSrc} alt={item.title} className="aspect-square w-full rounded-lg object-cover" />
        <div>
          <span className="text-xs uppercase tracking-wide text-sage">{item.collection?.name}</span>
          <h1 className="mt-2 font-display text-3xl font-semibold text-ink">{item.title}</h1>
          <p className="mt-3 text-slate/80">{item.summary}</p>
          <div className="mt-6 flex items-center gap-4">
            <span className="price-tag text-base">${(item.priceCents / 100).toFixed(2)}</span>
            <span className="text-sm text-slate/60">{item.stockCount} in stock</span>
          </div>
          {account ? (
            <button onClick={handleAdd} className="btn-primary mt-6">
              {added ? 'Added to basket ✓' : 'Add to basket'}
            </button>
          ) : (
            <p className="mt-6 text-sm text-slate/60">Sign in to add this to your basket.</p>
          )}
        </div>
      </div>

      <section className="mt-16">
        <h2 className="font-display text-2xl font-semibold text-ink">Ratings</h2>
        {ratings?.length ? (
          <ul className="mt-4 space-y-4">
            {ratings.map((r) => (
              <li key={r.id} className="rounded-md border border-ink/10 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-ink">{r.displayName}</span>
                  <span className="font-mono text-sm text-amber">{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</span>
                </div>
                {r.note && <p className="mt-2 text-sm text-slate/75">{r.note}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-slate/60">No ratings yet — be the first.</p>
        )}

        {account && (
          <form onSubmit={handleRate} className="mt-6 flex flex-col gap-3 rounded-md border border-ink/10 p-4">
            <label className="text-sm font-medium text-ink">
              Your rating
              <select value={stars} onChange={(e) => setStars(Number(e.target.value))} className="field mt-1 max-w-[120px]">
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}
              </select>
            </label>
            <textarea
              className="field"
              placeholder="Optional note…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <button type="submit" className="btn-secondary self-start">Submit rating</button>
          </form>
        )}
      </section>
    </div>
  );
}
