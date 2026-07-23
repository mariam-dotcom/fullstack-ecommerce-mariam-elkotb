import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBasket } from '../context/BasketContext';

export default function Navbar() {
  const { account, signOut } = useAuth();
  const { rows } = useBasket();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 border-b border-ink/10 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-2xl font-semibold text-ink">
          Nimbus
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link to="/shop" className="hover:text-amber">Shop</Link>
          {account?.role === 'MANAGER' && (
            <Link to="/admin" className="hover:text-amber">Dashboard</Link>
          )}
          {account && (
            <Link to="/basket" className="hover:text-amber">
              Basket{rows.length > 0 ? ` (${rows.length})` : ''}
            </Link>
          )}
          {account ? (
            <>
              <Link to="/profile" className="hover:text-amber">{account.displayName}</Link>
              <button
                onClick={() => { signOut(); navigate('/'); }}
                className="btn-secondary"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/sign-in" className="hover:text-amber">Sign in</Link>
              <Link to="/sign-up" className="btn-primary">Create account</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
