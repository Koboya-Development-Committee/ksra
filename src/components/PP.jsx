import { Link } from 'react-router-dom';
import { ChevronRight, ShieldAlert } from 'lucide-react';

const PP = () => {
  return (
    <div className="container" style={{ marginTop: '32px', marginBottom: '60px', maxWidth: '800px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <Link to="/" style={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
          <ChevronRight size={18} /> Back to Dashboard
        </Link>
      </div>

      <div style={{ background: '#1a365d', padding: '32px 40px', color: '#fff', borderBottom: '6px solid var(--accent-blue)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <ShieldAlert size={40} color="#90cdf4" />
          <div>
            <h1 style={{ fontSize: '2rem', margin: 0, color: '#fff', fontFamily: 'monospace', textTransform: 'uppercase' }}>Privacy Policy</h1>
            <p style={{ fontSize: '1rem', color: '#cbd5e1', margin: '4px 0 0' }}>KSRA Data Collection & Processing Disclosure</p>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', padding: '40px', border: '1px solid var(--border-light)', borderTop: 'none' }}>
        <div style={{ borderLeft: '4px solid var(--primary-blue)', paddingLeft: '20px', marginBottom: '32px' }}>
          <p style={{ fontStyle: 'italic', color: 'var(--text-dark)' }}>
            This disclosure outlines the data processing and logging protocols active on the Koboya Standardisation and Registry Authority (KSRA) portal.
          </p>
        </div>

        <section style={{ marginBottom: '24px' }}>
          <h3 style={{ textTransform: 'uppercase', fontSize: '1.05rem', color: 'var(--text-dark)', borderBottom: '1px solid var(--border-light)', paddingBottom: '6px', marginBottom: '12px' }}>
            1. Audit Logging & System Activity
          </h3>
          <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-muted)' }}>
            To preserve the integrity of national standards ledger records, all modifications, additions, and deletions are permanently logged. This history includes details of the changes and timestamps, which are linked to the executing operator's authorization ID.
          </p>
        </section>

        <section style={{ marginBottom: '24px' }}>
          <h3 style={{ textTransform: 'uppercase', fontSize: '1.05rem', color: 'var(--text-dark)', borderBottom: '1px solid var(--border-light)', paddingBottom: '6px', marginBottom: '12px' }}>
            2. Account & Profile Syncing
          </h3>
          <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-muted)' }}>
            Upon account sign-up, your profile data (email, identifier, and system clearance tier) is synchronized from Supabase Auth to a public profiles registry. This registry is used internally for displaying access credentials and tracking editor attributions.
          </p>
        </section>

        <section style={{ marginBottom: '24px' }}>
          <h3 style={{ textTransform: 'uppercase', fontSize: '1.05rem', color: 'var(--text-dark)', borderBottom: '1px solid var(--border-light)', paddingBottom: '6px', marginBottom: '12px' }}>
            3. Third-Party Identities (Discord OAuth)
          </h3>
          <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-muted)' }}>
            If you authenticate via Discord, the system accesses your basic Discord email identity and user metadata to link your identity. No personal game logs, chat history, or friends lists are queried or stored.
          </p>
        </section>

        <section>
          <h3 style={{ textTransform: 'uppercase', fontSize: '1.05rem', color: 'var(--text-dark)', borderBottom: '1px solid var(--border-light)', paddingBottom: '6px', marginBottom: '12px' }}>
            4. Encryption & Retention
          </h3>
          <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-muted)' }}>
            Operator credentials are encrypted on the BaaS layer. Inactive guest sessions are cached in local browser state and can be cleared at any time by executing a session log-out command.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PP;
