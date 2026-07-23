import { useState } from 'react';
import { useCatalogList, useCollections } from '../hooks/useCatalog';
import ItemCard from '../components/ItemCard';

export default function Shop() {
  const [q, setQ] = useState('');
  const [collectionId, setCollectionId] = useState('');
  const [sort, setSort] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);

  const { data: collections } = useCollections();
  const { data, isLoading } = useCatalogList({ q, collectionId, sort, order, page, perPage: 8 });

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-ink">Shop everything</h1>

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          className="field max-w-xs"
          placeholder="Search items…"
          value={q}
          onChange={(e) => { setQ(e.target.value); setPage(1); }}
        />
        <select
          className="field max-w-[200px]"
          value={collectionId}
          onChange={(e) => { setCollectionId(e.target.value); setPage(1); }}
        >
          <option value="">All collections</option>
          {collections?.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          className="field max-w-[200px]"
          value={`${sort}-${order}`}
          onChange={(e) => {
            const [s, o] = e.target.value.split('-');
            setSort(s); setOrder(o); setPage(1);
          }}
        >
          <option value="createdAt-desc">Newest first</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="title-asc">Name: A to Z</option>
        </select>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <p className="text-sm text-slate/60">Loading items…</p>
        ) : data.items.length === 0 ? (
          <p className="text-sm text-slate/60">No items match your search.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {data.items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {data && data.page.pages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            className="btn-secondary"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>
          <span className="text-sm text-slate/70">
            Page {data.page.current} of {data.page.pages}
          </span>
          <button
            className="btn-secondary"
            disabled={page >= data.page.pages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
