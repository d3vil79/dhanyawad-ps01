import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../contexts/useAuthStore';
import { useHaptics } from '../../hooks/useHaptics';

const ROLES = [
  { label: 'Patient',      email: 'patient@demo.com',  emoji: '🏥', color: '#60A5FA', glow: 'rgba(96,165,250,0.4)', bg: 'rgba(96,165,250,0.1)' },
  { label: 'Doctor',       email: 'doctor@demo.com',   emoji: '🩺', color: '#34D399', glow: 'rgba(52,211,153,0.4)', bg: 'rgba(52,211,153,0.1)' },
  { label: 'Hospital',     email: 'hospital@demo.com', emoji: '🏨', color: '#A78BFA', glow: 'rgba(167,139,250,0.4)', bg: 'rgba(167,139,250,0.1)' },
  { label: 'System Admin', email: 'admin@demo.com',    emoji: '🛡️', color: '#FBBF24', glow: 'rgba(251,191,36,0.4)',  bg: 'rgba(251,191,36,0.1)' },
];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { tap, success, error: hapticError } = useHaptics();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [err, setErr]           = useState('');
  const [activeRole, setActiveRole] = useState(null);

  const performLogin = async (targetEmail, targetPassword, roleLabel = null) => {
    tap();
    setErr('');
    setActiveRole(roleLabel);
    setLoading(true);
    try {
      const user = await login(targetEmail, targetPassword);
      success();
      const roleRoutes = { doctor: '/dashboard/doctor', hospital: '/dashboard/hospital', admin: '/dashboard/admin' };
      navigate(roleRoutes[user?.role] || '/');
    } catch (apiErr) {
      hapticError();
      setErr(apiErr.message || 'Invalid credentials. Try a demo email below.');
    } finally {
      setLoading(false);
      setActiveRole(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) { setErr('Please fill in both fields.'); return; }
    performLogin(email, password);
  };

  return (
    <div style={{ position: 'relative', zIndex: 1, maxWidth: 400, margin: '0 auto', padding: '40px 20px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotate: -15 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 20 }}
          style={{
            width: 72, height: 72, borderRadius: 24,
            background: 'linear-gradient(135deg, #00C6FF, #0072FF)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px', fontSize: 32,
            boxShadow: '0 10px 30px -10px rgba(0, 198, 255, 0.6), inset 0 2px 10px rgba(255,255,255,0.4)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          ✨
        </motion.div>
        <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.04em', color: '#FFFFFF', marginBottom: 8, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
          Welcome Back
        </h1>
        <p style={{ fontSize: 16, color: '#94a3b8', fontWeight: 500 }}>
          Enter the AccessCare Universe
        </p>
      </div>

      {/* Quick Role Login Cards */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 11, fontWeight: 800, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>
          1-Click Demo Login
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {ROLES.map((r) => (
            <motion.button
              key={r.label}
              type="button"
              whileHover={{ y: -4, scale: 1.03, boxShadow: `0 10px 20px -10px ${r.glow}` }}
              whileTap={{ scale: 0.95 }}
              onClick={() => performLogin(r.email, 'demo1234', r.label)}
              disabled={loading}
              style={{
                background: activeRole === r.label ? r.bg : 'rgba(255,255,255,0.03)',
                border: `1px solid ${activeRole === r.label ? r.color : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 16, padding: '14px 16px',
                textAlign: 'left', cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: loading && activeRole !== r.label ? 0.3 : 1,
                backdropFilter: 'blur(10px)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 20, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }}>{r.emoji}</span>
                <span style={{ fontWeight: 800, fontSize: 14, color: r.color, letterSpacing: '-0.01em' }}>{r.label}</span>
              </div>
              <p style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'hidden', textUnderlineOffset: 4 }}>
                {r.email}
              </p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1))' }} />
        <span style={{ fontSize: 12, color: '#64748b', whiteSpace: 'nowrap', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>or sign in manually</span>
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(270deg, transparent, rgba(255,255,255,0.1))' }} />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
            Email Address
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: '100%', padding: '16px 20px', borderRadius: 16,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#f8fafc', fontSize: 15, outline: 'none',
                fontFamily: 'inherit', boxSizing: 'border-box',
                transition: 'all 0.3s ease',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
              }}
              onFocus={e => { 
                e.target.style.borderColor = '#00C6FF'; 
                e.target.style.background = 'rgba(0,198,255,0.05)'; 
                e.target.style.boxShadow = '0 0 0 4px rgba(0,198,255,0.1), inset 0 2px 4px rgba(0,0,0,0.2)';
              }}
              onBlur={e => { 
                e.target.style.borderColor = 'rgba(255,255,255,0.1)'; 
                e.target.style.background = 'rgba(0,0,0,0.2)'; 
                e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.2)';
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%', padding: '16px 20px', borderRadius: 16,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#f8fafc', fontSize: 15, outline: 'none',
                fontFamily: 'inherit', boxSizing: 'border-box',
                transition: 'all 0.3s ease',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
              }}
              onFocus={e => { 
                e.target.style.borderColor = '#00C6FF'; 
                e.target.style.background = 'rgba(0,198,255,0.05)'; 
                e.target.style.boxShadow = '0 0 0 4px rgba(0,198,255,0.1), inset 0 2px 4px rgba(0,0,0,0.2)';
              }}
              onBlur={e => { 
                e.target.style.borderColor = 'rgba(255,255,255,0.1)'; 
                e.target.style.background = 'rgba(0,0,0,0.2)'; 
                e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.2)';
              }}
            />
          </div>
        </div>

        {/* Error */}
        <AnimatePresence>
          {err && (
            <motion.p
              initial={{ opacity: 0, y: -10, scale: 0.95 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              style={{ fontSize: 13, color: '#f87171', margin: '12px 0 0', padding: '10px 14px', background: 'rgba(248,113,113,0.1)', borderRadius: 8, border: '1px solid rgba(248,113,113,0.2)', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}
            >
              <span>⚠</span> {err}
            </motion.p>
          )}
        </AnimatePresence>

        <motion.button
          whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02, filter: 'brightness(1.1)' }}
          type="submit"
          disabled={loading}
          style={{
            width: '100%', marginTop: 28, padding: '18px 0',
            background: loading
              ? 'rgba(255,255,255,0.1)'
              : 'linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)',
            color: '#fff', border: 'none', borderRadius: 16,
            fontWeight: 800, fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 10px 25px -5px rgba(0, 198, 255, 0.5), inset 0 2px 4px rgba(255,255,255,0.3)',
            transition: 'all 0.3s ease',
            letterSpacing: '-0.01em',
          }}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'inline-block', width: 20, height: 20, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff' }}
              />
              Authenticating...
            </span>
          ) : 'Enter Portal ✨'}
        </motion.button>
      </form>

      {/* Footer */}
      <p style={{ textAlign: 'center', marginTop: 32, fontSize: 14, color: '#94a3b8', fontWeight: 500 }}>
        Don&apos;t have an account?{' '}
        <button
          onClick={() => { tap(); navigate('/auth/register'); }}
          style={{ background: 'none', border: 'none', color: '#38bdf8', fontWeight: 800, cursor: 'pointer', fontSize: 14, textDecoration: 'underline', textUnderlineOffset: 4 }}
        >
          Register Here
        </button>
      </p>
    </div>
  );
}
