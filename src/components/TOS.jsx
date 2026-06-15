import { Link } from 'react-router-dom';
import { ChevronRight, FileText } from 'lucide-react';

const TOS = () => {
  return (
    <div className="container" style={{ marginTop: '32px', marginBottom: '60px', maxWidth: '800px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <Link to="/" style={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
          <ChevronRight size={18} /> Back to Dashboard
        </Link>
      </div>

      <div style={{ background: '#1a365d', padding: '32px 40px', color: '#fff', borderBottom: '6px solid var(--accent-blue)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <FileText size={40} color="#90cdf4" />
          <div>
            <h1 style={{ fontSize: '2rem', margin: 0, color: '#fff', fontFamily: 'monospace', textTransform: 'uppercase' }}>Terms of Service</h1>
            <p style={{ fontSize: '1rem', color: '#cbd5e1', margin: '4px 0 0' }}>KSRA System Authorization & Operation Mandate</p>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', padding: '40px', border: '1px solid var(--border-light)', borderTop: 'none' }}>
        <div style={{ borderLeft: '4px solid var(--primary-blue)', paddingLeft: '20px', marginBottom: '32px' }}>
          <p style={{ fontStyle: 'italic', color: 'var(--text-dark)' }}>
            Welcome to the Koboya Standardisation and Registry Authority (KSRA) web portal. By accessing this system, you agree to comply with the legal frameworks and archival standards of the Koboya Government.
          </p>
        </div>

        <section style={{ marginBottom: '24px' }}>
          <h3 style={{ textTransform: 'uppercase', fontSize: '1.05rem', color: 'var(--text-dark)', borderBottom: '1px solid var(--border-light)', paddingBottom: '6px', marginBottom: '12px' }}>
            1. System Authorization
          </h3>
          <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-muted)' }}>
            Access to administrative ratification modules is restricted exclusively to authorized operators holding validated credentials. Any unauthorized attempt to modify registries, cascade classification short-codes, or bypass secure database ledgers is strictly prohibited.
          </p>
        </section>

        <section style={{ marginBottom: '24px' }}>
          <h3 style={{ textTransform: 'uppercase', fontSize: '1.05rem', color: 'var(--text-dark)', borderBottom: '1px solid var(--border-light)', paddingBottom: '6px', marginBottom: '12px' }}>
            2. Ledger Integrity & Cascades
          </h3>
          <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-muted)' }}>
            Authorized operators acknowledge that all modifications made to classification nodes (including acronym reassignments) will immediately cascade to all dependent standard definitions. System audits are recorded chronologically in the Standard History table and cannot be retroactively purged.
          </p>
        </section>

        <section style={{ marginBottom: '24px' }}>
          <h3 style={{ textTransform: 'uppercase', fontSize: '1.05rem', color: 'var(--text-dark)', borderBottom: '1px solid var(--border-light)', paddingBottom: '6px', marginBottom: '12px' }}>
            3. Security & Access Control
          </h3>
          <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-muted)' }}>
            This system monitors login attempts via credential verification and third-party authentication (OAuth). In accordance with national cyber-defense policies, password registration requires adherence to the system complexity index (length, casing, numerical, and symbolic criteria).
          </p>
        </section>

        <section>
          <h3 style={{ textTransform: 'uppercase', fontSize: '1.05rem', color: 'var(--text-dark)', borderBottom: '1px solid var(--border-light)', paddingBottom: '6px', marginBottom: '12px' }}>
            4. Compliance & Enforcement
          </h3>
          <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-muted)' }}>
            Failure to adhere to these operating mandates will result in immediate termination of system access privileges and may lead to prosecution under Koboya domestic grid infrastructure and documentation protection acts.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TOS;
