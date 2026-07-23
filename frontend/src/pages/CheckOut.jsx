import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBasket } from '../context/BasketContext';
import { resolveImage } from '../utils/image';

function generateOrderNumber() {
  return `NIM-${Date.now().toString().slice(-6)}`;
}

export default function Checkout() {
  const { rows, totalCents, removeItem } = useBasket();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [confirmed, setConfirmed] = useState(null);

  async function handlePlaceOrder() {
    setPlacing(true);
    await new Promise((resolve) => setTimeout(resolve, 900));

    const orderNumber = generateOrderNumber();
    await Promise.all(rows.map((row) => removeItem(row.id)));

    setConfirmed({ orderNumber, total: totalCents, itemCount: rows.length });
    setPlacing(false);
  }

  if (confirmed) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-sage/15 text-2xl text-sage">
          ✓
        </div>
        <h1 className="font-display text-2xl font-semibold text-ink">Order placed</h1>
        <p className="mt-2 text-sm text-slate/70">
          This is a simulated checkout - no payment was actually processed.
        </p>
        <div className="mt-6 rounded-md border border-ink/10 p-4 text-left text-sm">
          <p className="flex justify-between"><span className="text-slate/60">Order number</span><span className="font-mono">{confirmed.orderNumber}</span></p>
          <p className="mt-2 flex justify-between"><span className="text-slate/60">Items</span><span>{confirmed.itemCount}</span></p>
          <p className="mt-2 flex justify-between"><span className="text-slate/60">Total charged</span><span className="price-tag">${(confirmed.total / 100).toFixed(2)}</span></p>
        </div>
        <Link to="/shop" className="btn-primary mt-8 inline-flex">Continue shopping</Link>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <h2 className="font-display text-2xl font-semibold text-ink">Nothing to check out</h2>
        <p className="mt-2 text-sm text-slate/70">Your basket is empty.</p>
        <Link to="/shop" className="btn-primary mt-6 inline-flex">Browse the shop</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-ink">Checkout</h1>
      <p className="mt-2 text-sm text-slate/60">
        This is a simulated checkout for demonstration purposes - no real payment is collected.
      </p>

      <ul className="mt-8 divide-y divide-ink/10 rounded-md border border-ink/10">
        {rows.map((row) => (
          <li key={row.id} className="flex items-center gap-4 p-4">
            <img src={resolveImage(row.item.imagePath)} alt={row.item.title} className="h-12 w-12 rounded object-cover" />
            <div className="flex-1">
              <p className="text-sm font-medium text-ink">{row.item.title}</p>
              <p className="text-xs text-slate/60">Qty {row.quantity}</p>
            </div>
            <span className="font-mono text-sm text-ink">
              ${((row.item.priceCents * row.quantity) / 100).toFixed(2)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between border-t border-ink/10 pt-4">
        <span className="font-display text-lg font-semibold text-ink">Total</span>
        <span className="price-tag text-base">${(totalCents / 100).toFixed(2)}</span>
      </div>


      <div className="mt-6 flex gap-3">
        <button onClick={() => navigate('/basket')} className="btn-secondary">Back to basket</button>
        <button onClick={handlePlaceOrder} disabled={placing} className="btn-primary flex-1 disabled:opacity-60">
          {placing ? 'Placing order…' : `Place order - $${(totalCents / 100).toFixed(2)}`}
        </button>
      </div>
    </div>
  );
}