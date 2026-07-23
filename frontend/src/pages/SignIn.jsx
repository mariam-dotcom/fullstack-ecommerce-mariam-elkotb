import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignIn() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await signIn({ email, password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Could not sign in.');
    }
  }

  return (
    <div className="mx-auto max-w-sm px-6 py-16">
      <h1 className="font-display text-2xl font-semibold text-ink">Sign in</h1>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <input className="field" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="field" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="btn-primary">Sign in</button>
      </form>
      <p className="mt-4 text-sm text-slate/70">
        No account yet? <Link to="/sign-up" className="text-amber">Create one</Link>
      </p>
    </div>
  );
}
