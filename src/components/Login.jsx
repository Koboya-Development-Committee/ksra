import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ShieldCheck, Activity, Settings } from 'lucide-react';
import { supabase } from '../supabaseClient';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else navigate('/');
    setLoading(false);
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '80vh', 
      backgroundColor: '#f8fafc',
      backgroundImage: 'radial-gradient(#cbd5e1 1.5px, transparent 1.5px)',
      backgroundSize: '24px 24px'
    }}>
      <div style={{ width: '100%', maxWidth: '450px', background: '#0a192f', border: '2px solid #90cdf4', boxShadow: '12px 12px 0px rgba(144, 205, 244, 0.2)', padding: '40px', position: 'relative', overflow: 'hidden' }}>
        
        {/* Background overlay */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--primary-blue)' }}></div>
        <div style={{ position: 'absolute', top: 10, right: -40, opacity: 0.1, transform: 'rotate(15deg)' }}>
          <ShieldCheck size={180} color="#90cdf4" />
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Shield size={28} color="#90cdf4" />
            <h2 style={{ color: '#fff', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '1.4rem', margin: 0, fontFamily: 'monospace' }}>System Access</h2>
          </div>
          <p style={{ color: '#8892b0', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '32px', borderBottom: '1px solid #233554', paddingBottom: '16px' }}>
            Authorised Administrators Only
          </p>

          {error && (
            <div style={{ background: 'rgba(229, 62, 62, 0.1)', borderLeft: '4px solid #e53e3e', color: '#fc8181', padding: '12px 16px', marginBottom: '24px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', color: '#90cdf4', marginBottom: '8px', letterSpacing: '1px' }}>Email Address</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                style={{ width: '100%', padding: '14px', background: '#112240', border: '1px solid #233554', color: '#fff', fontSize: '1rem', fontFamily: 'monospace', outline: 'none', transition: 'border-color 0.2s', borderRadius: '0px' }} 
                onFocus={e => e.target.style.borderColor = '#90cdf4'}
                onBlur={e => e.target.style.borderColor = '#233554'}
              />
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', color: '#90cdf4', marginBottom: '8px', letterSpacing: '1px' }}>Password</label>
              <input 
                type="password" 
                required 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                style={{ width: '100%', padding: '14px', background: '#112240', border: '1px solid #233554', color: '#fff', fontSize: '1rem', fontFamily: 'monospace', outline: 'none', transition: 'border-color 0.2s', borderRadius: '0px' }} 
                onFocus={e => e.target.style.borderColor = '#90cdf4'}
                onBlur={e => e.target.style.borderColor = '#233554'}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading} 
              style={{ width: '100%', padding: '16px', background: loading ? '#233554' : '#90cdf4', color: loading ? '#8892b0' : '#0a192f', fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', border: 'none', borderRadius: '0px', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
            >
              {loading ? 'Authenticating...' : <><Settings size={18} /> Sign In</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
