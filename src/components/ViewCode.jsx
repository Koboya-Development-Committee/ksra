import { Link, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const ViewCode = ({ data }) => {
  const { id } = useParams();
  const std = data.standards?.find(s => s.id === id);
  if (!std) return <div className="container mt-4">Record not found.</div>;

  const cat = data.categories?.find(c => c.id === std.categoryId);
  const activeCode = std.history[0]?.code;

  return (
    <div className="container" style={{ marginTop: '32px', marginBottom: '60px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <Link to="/" style={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}><ChevronRight size={18} /> Back to Dashboard</Link>
      </div>

      <div style={{ background: '#1a365d', padding: '32px 40px', color: '#fff', borderBottom: '6px solid var(--accent-blue)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '6px 12px', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>{cat?.fullName}</span>
            <h1 style={{ fontSize: '3rem', margin: '16px 0', color: '#fff', fontFamily: 'monospace' }}>{activeCode}</h1>
            <p style={{ fontSize: '1.4rem', color: '#e2e8f0' }}>{std.title}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.85rem', color: '#90cdf4', textTransform: 'uppercase' }}>Ratification Cycle</p>
            <p style={{ fontSize: '2rem', fontWeight: 700 }}>{std.year}</p>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', padding: '40px', border: '1px solid var(--border-light)', borderTop: 'none' }}>
        <div style={{ borderLeft: '6px solid var(--primary-blue)', paddingLeft: '24px', marginBottom: '48px' }}>
          <h3 className="mb-4" style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>Standard Description & Mandate</h3>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-dark)', whiteSpace: 'pre-line' }}>{std.desc}</p>
        </div>

        <h3 className="mb-4" style={{ textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '2px solid var(--border-light)', paddingBottom: '12px' }}>Audit Log Matrix</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-canvas)' }}>
              <th style={{ textAlign: 'left', padding: '12px', borderBottom: '2px solid var(--border-light)', color: 'var(--text-muted)' }}>Cycle</th>
              <th style={{ textAlign: 'left', padding: '12px', borderBottom: '2px solid var(--border-light)', color: 'var(--text-muted)' }}>Recorded Code State</th>
              <th style={{ textAlign: 'left', padding: '12px', borderBottom: '2px solid var(--border-light)', color: 'var(--text-muted)' }}>Transition Annotation</th>
            </tr>
          </thead>
          <tbody>
            {std.history.map(h => (
              <tr key={h.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '16px 12px', fontWeight: 600 }}>{h.year}</td>
                <td style={{ padding: '16px 12px', fontFamily: 'monospace', color: 'var(--accent-blue)', fontWeight: 700 }}>{h.code}</td>
                <td style={{ padding: '16px 12px', color: 'var(--text-dark)' }}>{h.summary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewCode;
