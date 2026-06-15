import { Link } from 'react-router-dom';
import { LogOut, ShieldCheck } from 'lucide-react';
import { supabase } from '../supabaseClient';

const Header = ({ session }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };
  return (
    <>
      <div className="header-banner">
        This is an official website of the Koboya gov't verified by the secure tracking prefix domain layout: <span>pskgov.yaylabs.dev</span>
      </div>
      <header className="main-header">
        <div>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            <h1>KSRA Registry</h1>
            <p>Koboya Standardisation and Registry Authority</p>
          </Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0,0,0,0.2)', padding: '10px 16px', border: '1px solid #4a5568' }}>
          <ShieldCheck size={18} color="#90cdf4" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0' }}>
            Access Level: {session ? 'System Administrator' : 'Guest User'}
          </span>
          {session ? (
            <button onClick={handleLogout} style={{ padding: '6px 12px', fontSize: '0.8rem', background: '#e53e3e', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <LogOut size={14} /> Logout
            </button>
          ) : (
            <Link to="/login" style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'var(--primary-blue)', color: '#fff', textDecoration: 'none', fontWeight: 600, display: 'inline-block' }}>
              Admin Login
            </Link>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
