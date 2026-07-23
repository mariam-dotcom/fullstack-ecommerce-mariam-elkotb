import { Link } from 'react-router-dom';
import { useBasket } from '../context/BasketContext';
import { resolveImage } from '../utils/image';

export default function Basket() {
  const { rows, totalCents, loading, updateQuantity, removeItem } = useBasket();

  if (loading) return <p className="mx-auto max-w-3xl px-6 py-12 text-sm text-slate/60">Loading your basket…</p>;

  if (rows.length === 0) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <h2 className="font-display text-2xl font-semibold text-ink">Your basket is empty</h2>
        <p className="mt-2 text-sm text-slate/70">Nothing here yet — go find something worth keeping.</p>
        <Link to="/shop" className="btn-primary mt-6 inline-flex">Browse the shop</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-ink">Your basket</h1>
      <ul className="mt-8 space-y-4">
        {rows.map((row) => (
          <li key={row.id} className="flex items-center gap-4 rounded-md border border-ink/10 p-4">
            <img src={resolveImage(row.item.imagePath)} alt={row.item.title} className="h-16 w-16 rounded object-cover" />
            <div className="flex-1">
              <p className="font-medium text-ink">{row.item.title}</p>
              <span className="price-tag mt-1">${(row.item.priceCents / 100).toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn-secondary px-3" onClick={() => updateQuantity(row.id, row.quantity - 1)}>-</button>
              <span className="w-6 text-center">{row.quantity}</span>
              <button className="btn-secondary px-3" onClick={() => updateQuantity(row.id, row.quantity + 1)}>+</button>
            </div>
            <button className="text-sm text-slate/50 hover:text-ink" onClick={() => removeItem(row.id)}>Remove</button>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center justify-between border-t border-ink/10 pt-6">
        <span className="font-display text-xl font-semibold text-ink">Total</span>
        <span className="price-tag text-base">${(totalCents / 100).toFixed(2)}</span>
      </div>

      <Link to="/checkout" className="btn-primary mt-6 inline-flex w-full justify-center">
        Proceed to checkout
      </Link>
    </div>
  );
}
