import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useBasket } from '../context/BasketContext';
import { useAuth } from '../context/AuthContext';
import { resolveImage } from '../utils/image';

function formatPrice(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function ItemCard({ item }) {
  const { account } = useAuth();
  const { addItem } = useBasket();
  const [justAdded, setJustAdded] = useState(false);
  const [adding, setAdding] = useState(false);

  async function handleQuickAdd(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!account || adding) return;
    setAdding(true);
    try {
      await addItem(item.id, 1);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1500);
    } finally {
      setAdding(false);
    }
  }

  return (
    <Link
      to={`/shop/${item.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-ink/10 bg-white transition hover:shadow-md"
    >
      <div className="aspect-square overflow-hidden bg-ink/5">
        <img
          src={resolveImage(item.imagePath)}
          alt={item.title}
          className="h-full w-full object-cover transition group-hover:scale-105"
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'; }}
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {item.collection && (
          <span className="text-xs uppercase tracking-wide text-sage">{item.collection.name}</span>
        )}
        <h3 className="font-display text-lg font-semibold leading-snug text-ink">{item.title}</h3>
        <p className="line-clamp-2 flex-1 text-sm text-slate/80">{item.summary}</p>

        <div className="flex items-center justify-between gap-2 pt-1">
          <span className="price-tag">{formatPrice(item.priceCents)}</span>
          {item.stockCount < 5 && (
            <span className="text-xs font-medium text-amber">{item.stockCount} left</span>
          )}
        </div>

        {account && (
          <button
            onClick={handleQuickAdd}
            disabled={adding}
            className="btn-secondary mt-1 w-full disabled:opacity-60"
          >
            {justAdded ? 'Added ✓' : adding ? 'Adding…' : 'Add to basket'}
          </button>
        )}
      </div>
    </Link>
  );
}
