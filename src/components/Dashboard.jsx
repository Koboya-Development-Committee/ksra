import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Activity, PlusCircle, Edit3, Database } from 'lucide-react';

const Dashboard = ({ data, role }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const navigate = useNavigate();

  if (!data.standards) return <div className="container mt-4">Loading database...</div>;

  const filteredStandards = data.standards.filter(std => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = std.title.toLowerCase().includes(term) || std.desc.toLowerCase().includes(term) || (std.history[0]?.code.toLowerCase().includes(term));
    const matchesCat = categoryFilter === 'ALL' || std.categoryId === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="container" style={{ display: 'flex', gap: '32px', marginTop: '32px' }}>
      <div style={{ flex: '1' }}>
        <div style={{ background: '#fff', padding: '16px', border: '1px solid var(--border-light)', marginBottom: '24px', display: 'flex', gap: '16px' }}>
          <div style={{ flex: '1', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Filter by structural strings, titles, descriptions..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '38px' }}
            />
          </div>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{ width: '250px' }}>
            <option value="ALL">All Categories</option>
            {data.categories.map(c => <option key={c.id} value={c.id}>{c.fullName} ({c.acronym})</option>)}
          </select>
        </div>

        <h2 style={{ fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '2px solid var(--border-light)', paddingBottom: '8px', marginBottom: '24px' }}>
          <Activity size={20} style={{ display: 'inline-block', verticalAlign: 'text-bottom', marginRight: '8px' }} />
          System Feed Overview
        </h2>

        {filteredStandards.map(std => {
          const activeCode = std.history[0]?.code || 'N/A';
          const cat = data.categories.find(c => c.id === std.categoryId);
          return (
            <div key={std.id} className="card">
              <div className="flex-between mb-4">
                <Link to={`/View-Code/${std.id}`} className="code-highlight">{activeCode}</Link>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, background: '#e2e8f0', padding: '4px 8px', letterSpacing: '0.5px' }}>{cat?.acronym}</span>
              </div>
              <h3 className="mb-2" style={{ fontSize: '1.2rem', color: 'var(--text-dark)' }}>{std.title}</h3>
              <p className="metadata-text mb-4" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{std.desc}</p>
              {role === 'System Administrator' && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={() => navigate(`/Edit-Code/${std.id}`)} style={{ padding: '6px 12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--text-muted)' }}>
                    <Edit3 size={14} /> Revise Record
                  </button>
                </div>
              )}
            </div>
          );
        })}
        {filteredStandards.length === 0 && <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No standard definitions match the query.</div>}
      </div>

      {role === 'System Administrator' && (
        <div style={{ width: '340px' }}>
          <div className="card" style={{ borderLeftColor: 'var(--text-dark)' }}>
            <h3 className="mb-4 border-b" style={{ paddingBottom: '12px', fontSize: '1.1rem', textTransform: 'uppercase' }}>Command Tools</h3>
            
            <div className="mb-6">
              <p className="metadata-text mb-2" style={{ fontWeight: 600 }}>Ratification Module</p>
              <button style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={() => navigate('/Create-Code')}>
                <PlusCircle size={18} /> Initialise New Standard
              </button>
            </div>

            <div className="mb-6">
              <p className="metadata-text mb-2" style={{ fontWeight: 600 }}>Revision Module</p>
              <select onChange={(e) => { if(e.target.value) navigate(`/Edit-Code/${e.target.value}`) }} style={{ marginBottom: '8px' }}>
                <option value="">Select an active item...</option>
                {data.standards.map(std => (
                  <option key={std.id} value={std.id}>{std.history[0]?.code}</option>
                ))}
              </select>
            </div>

            <div className="mb-2 border-t mt-4" style={{ paddingTop: '16px' }}>
              <p className="metadata-text mb-2" style={{ fontWeight: 600 }}>Management Database</p>
              <button style={{ width: '100%', background: '#2d3748', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={() => navigate('/Category-Management')}>
                <Database size={18} /> Classification Grid
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
