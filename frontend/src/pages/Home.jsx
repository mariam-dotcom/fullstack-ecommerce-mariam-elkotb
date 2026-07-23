import { Link } from 'react-router-dom';
import { useCatalogList } from '../hooks/useCatalog';
import ItemCard from '../components/ItemCard';

export default function Home() {
  const { data, isLoading } = useCatalogList({ page: 1, perPage: 4, sort: 'title', order: 'asc' });

  return (
    <div>
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-20 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-sage">Nimbus — everyday goods</p>
        <h1 className="mt-4 font-display text-5xl font-semibold leading-tight text-ink sm:text-6xl">
          Considered things,<br />for an ordinary desk.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-slate/75">
          A small catalog of durable, well-made goods for work and home. No gimmicks — just things
          worth keeping around.
        </p>
        <Link to="/shop" className="btn-primary mt-8 inline-flex">
          Browse the shop
        </Link>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="mb-6 font-display text-2xl font-semibold text-ink">Recently added</h2>
        {isLoading ? (
          <p className="text-sm text-slate/60">Loading items…</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {data.items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
