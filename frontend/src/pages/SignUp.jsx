import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignUp() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await signUp({ displayName, email, password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Could not create account.');
    }
  }

  return (
    <div className="mx-auto max-w-sm px-6 py-16">
      <h1 className="font-display text-2xl font-semibold text-ink">Create account</h1>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <input className="field" placeholder="Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
        <input className="field" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="field" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="btn-primary">Create account</button>
      </form>
      <p className="mt-4 text-sm text-slate/70">
        Already have an account? <Link to="/sign-in" className="text-amber">Sign in</Link>
      </p>
    </div>
  );
}
