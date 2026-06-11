import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { Search, Shield, Activity, FileText, Settings, LogOut, ChevronRight, PlusCircle, Edit3, Save, Trash2, ShieldCheck, Database } from 'lucide-react';
import { supabase } from './supabaseClient';

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

const CreateEditCode = ({ data, refresh, isEdit }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    categoryId: '',
    itemId: '',
    title: '',
    desc: '',
    year: new Date().getFullYear(),
    summary: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (data.categories?.length > 0 && !formData.categoryId && !isEdit) {
      setFormData(prev => ({ ...prev, categoryId: data.categories[0].id }));
    }
  }, [data, isEdit, formData.categoryId]);

  useEffect(() => {
    if (isEdit && id && data.standards) {
      const std = data.standards.find(s => s.id === id);
      if (std) {
        setFormData({
          categoryId: std.categoryId,
          itemId: std.itemId,
          title: std.title,
          desc: std.desc,
          year: std.year,
          summary: ''
        });
      }
    }
  }, [isEdit, id, data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const category = data.categories.find(c => c.id === formData.categoryId);
    const targetCode = `KSRA-ST-${category.acronym}.${formData.itemId}:${formData.year}`;

    try {
      if (isEdit) {
        const { error: err1 } = await supabase.from('standards').update({
          category_id: formData.categoryId,
          item_id: formData.itemId,
          title: formData.title,
          desc_body: formData.desc,
          ratification_year: formData.year.toString()
        }).eq('id', id);
        if (err1) throw err1;

        const { error: err2 } = await supabase.from('standard_history').insert({
          standard_id: id,
          ratification_year: formData.year.toString(),
          code_state: targetCode,
          summary: formData.summary || `Standard updated. Title: ${formData.title}.`
        });
        if (err2) throw err2;
      } else {
        const { data: newStd, error: err1 } = await supabase.from('standards').insert({
          category_id: formData.categoryId,
          item_id: formData.itemId,
          title: formData.title,
          desc_body: formData.desc,
          ratification_year: formData.year.toString()
        }).select().single();
        if (err1) throw err1;

        const { error: err2 } = await supabase.from('standard_history').insert({
          standard_id: newStd.id,
          ratification_year: formData.year.toString(),
          code_state: targetCode,
          summary: 'Initial ratification and publishing to web portal node.'
        });
        if (err2) throw err2;
      }
      refresh();
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container" style={{ marginTop: '32px', marginBottom: '60px', maxWidth: '900px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <Link to="/" style={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}><ChevronRight size={18} /> Cancel & Return</Link>
      </div>

      <div style={{ background: '#fff', border: '1px solid var(--border-light)' }}>
        <div style={{ background: '#1a365d', padding: '24px 32px', color: '#fff', borderBottom: '4px solid var(--accent-blue)' }}>
          <h2 style={{ color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>
            {isEdit ? 'Full-Page Modification Studio' : 'Full-Page Code Creation Workspace'}
          </h2>
        </div>
        
        {error && (
          <div style={{ background: '#fed7d7', color: '#9b2c2c', padding: '16px 32px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #feb2b2' }}>
            <ShieldCheck size={20} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ padding: '32px' }}>
          <div style={{ background: 'var(--bg-canvas)', padding: '24px', marginBottom: '32px', border: '1px solid var(--border-light)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label className="mb-2" style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Classification Node</label>
              <select required value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                {data.categories?.map(c => <option key={c.id} value={c.id}>{c.acronym} - {c.fullName}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-2" style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Item Identification</label>
              <input required type="text" placeholder="e.g. 102" value={formData.itemId} onChange={e => setFormData({...formData, itemId: e.target.value})} style={{ fontFamily: 'monospace', fontWeight: 600 }} />
            </div>
            <div>
              <label className="mb-2" style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Ratification Cycle</label>
              <input required type="number" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} style={{ fontFamily: 'monospace', fontWeight: 600 }} />
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-2" style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Standard Title Text</label>
            <input required type="text" placeholder="Enter definitive title..." value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{ fontSize: '1.2rem', padding: '16px' }} />
          </div>

          <div className="mb-6">
            <label className="mb-2" style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Description Body & Specification Data</label>
            <textarea required rows={8} placeholder="Draft specifications..." value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} style={{ resize: 'vertical' }}></textarea>
          </div>

          {isEdit && (
            <div className="mb-6">
              <label className="mb-2" style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Audit Log Annotation (Optional)</label>
              <input type="text" placeholder="Describe the justification for this revision..." value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} />
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', fontSize: '1.1rem' }}>
              <Save size={20} /> {isEdit ? 'Commit Revision to Ledger' : 'Ratify & Append Code'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CategoryManagement = ({ data, refresh }) => {
  const [acronym, setAcronym] = useState('');
  const [fullName, setFullName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [fallbackId, setFallbackId] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const oldCat = data.categories.find(c => c.id === editingId);
        const { error } = await supabase.from('categories').update({
          acronym,
          full_name: fullName
        }).eq('id', editingId);
        if (error) throw error;

        const stds = data.standards.filter(s => s.categoryId === editingId);
        for (const std of stds) {
          for (const hist of std.history) {
            const newCode = hist.code.replace(`-ST-${oldCat.acronym}.`, `-ST-${acronym}.`);
            if (newCode !== hist.code) {
               await supabase.from('standard_history').update({ code_state: newCode }).eq('id', hist.id);
            }
          }
        }
      } else {
        const { error } = await supabase.from('categories').insert({
          acronym,
          full_name: fullName
        });
        if (error) throw error;
      }
      setAcronym('');
      setFullName('');
      setEditingId(null);
      refresh();
    } catch(e) {
      console.error(e);
      alert('Error saving category: ' + e.message);
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setAcronym(cat.acronym);
    setFullName(cat.fullName);
  };

  const handleDeleteRequest = (id) => {
    const stds = data.standards.filter(s => s.categoryId === id);
    if (stds.length > 0) {
      setDeletingId(id);
    } else {
      executeDelete(id);
    }
  };

  const executeDelete = async (id, fallback = null) => {
    try {
      if (fallback) {
        const { error: err1 } = await supabase.from('standards').update({ category_id: fallback }).eq('category_id', id);
        if (err1) throw err1;

        const oldCat = data.categories.find(c => c.id === id);
        const fallbackCat = data.categories.find(c => c.id === fallback);
        const stds = data.standards.filter(s => s.categoryId === id);
        for (const std of stds) {
          for (const hist of std.history) {
             const newCode = hist.code.replace(`-ST-${oldCat.acronym}.`, `-ST-${fallbackCat.acronym}.`);
             if (newCode !== hist.code) {
               await supabase.from('standard_history').update({ code_state: newCode }).eq('id', hist.id);
             }
          }
        }
      }
      
      const { error: err2 } = await supabase.from('categories').delete().eq('id', id);
      if (err2) throw err2;
      
      setDeletingId(null);
      setFallbackId('');
      refresh();
    } catch(err) {
      console.error(err);
      alert('Error deleting category: ' + err.message);
    }
  };

  return (
    <div className="container" style={{ marginTop: '32px', marginBottom: '60px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <Link to="/" style={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}><ChevronRight size={18} /> Back to Dashboard</Link>
      </div>

      <h2 style={{ fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '4px solid var(--primary-blue)', paddingBottom: '12px', marginBottom: '24px' }}>
        Classification Settings Grid
      </h2>

      <div style={{ display: 'flex', gap: '32px' }}>
        <div style={{ flex: '2' }}>
          <div style={{ background: '#fff', border: '1px solid var(--border-light)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-canvas)' }}>
                  <th style={{ textAlign: 'left', padding: '16px', borderBottom: '2px solid var(--border-light)', textTransform: 'uppercase', fontSize: '0.85rem' }}>Acronym</th>
                  <th style={{ textAlign: 'left', padding: '16px', borderBottom: '2px solid var(--border-light)', textTransform: 'uppercase', fontSize: '0.85rem' }}>Full Definition Node</th>
                  <th style={{ textAlign: 'center', padding: '16px', borderBottom: '2px solid var(--border-light)', textTransform: 'uppercase', fontSize: '0.85rem' }}>Active Standards</th>
                  <th style={{ textAlign: 'right', padding: '16px', borderBottom: '2px solid var(--border-light)', textTransform: 'uppercase', fontSize: '0.85rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.categories?.map(c => {
                  const count = data.standards?.filter(s => s.categoryId === c.id).length || 0;
                  return (
                    <tr key={c.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '16px', fontWeight: 700, fontFamily: 'monospace', color: 'var(--primary-blue)' }}>{c.acronym}</td>
                      <td style={{ padding: '16px', fontWeight: 500 }}>{c.fullName}</td>
                      <td style={{ padding: '16px', textAlign: 'center' }}><span style={{ background: 'var(--ice-blue)', color: 'var(--primary-blue)', padding: '4px 12px', fontWeight: 700 }}>{count}</span></td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                          <button onClick={() => handleEdit(c)} style={{ width: '70px', padding: '6px 12px', fontSize: '0.8rem', background: 'var(--text-muted)' }}>Edit</button>
                          <button onClick={() => handleDeleteRequest(c.id)} style={{ width: '70px', padding: '6px 12px', fontSize: '0.8rem', background: '#e53e3e' }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {deletingId && (
            <div style={{ marginTop: '24px', background: '#fff5f5', border: '1px solid #fc8181', padding: '24px', borderLeft: '5px solid #e53e3e' }}>
              <h3 style={{ color: '#c53030', marginBottom: '16px' }}>Relational Safety Gate Triggered</h3>
              <p style={{ marginBottom: '16px' }}>This category has active standard records attached. You must reassign them to a fallback classification node before deletion can proceed.</p>
              <select value={fallbackId} onChange={e => setFallbackId(e.target.value)} style={{ marginBottom: '16px' }}>
                <option value="">Select fallback category...</option>
                {data.categories?.filter(c => c.id !== deletingId).map(c => (
                  <option key={c.id} value={c.id}>{c.acronym} - {c.fullName}</option>
                ))}
              </select>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => executeDelete(deletingId, fallbackId)} disabled={!fallbackId} style={{ background: '#e53e3e' }}>Confirm Reassignment & Deletion</button>
                <button onClick={() => setDeletingId(null)} style={{ background: 'var(--text-muted)' }}>Cancel</button>
              </div>
            </div>
          )}
        </div>

        <div style={{ flex: '1' }}>
          <div className="card">
            <h3 className="mb-4 border-b" style={{ paddingBottom: '12px', textTransform: 'uppercase' }}>
              {editingId ? 'Modify Classification Node' : 'Append Classification Node'}
            </h3>
            <form onSubmit={handleSave}>
              <div className="mb-4">
                <label className="mb-2" style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Acronym Tag</label>
                <input required type="text" placeholder="e.g. ADM" value={acronym} onChange={e => setAcronym(e.target.value.toUpperCase())} style={{ fontFamily: 'monospace', fontWeight: 700 }} />
              </div>
              <div className="mb-6">
                <label className="mb-2" style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Full Node Description</label>
                <input required type="text" placeholder="e.g. Administrative" value={fullName} onChange={e => setFullName(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" style={{ flex: 1 }}>{editingId ? 'Update & Cascade' : 'Create Node'}</button>
                {editingId && <button type="button" onClick={() => {setEditingId(null); setAcronym(''); setFullName('');}} style={{ background: 'var(--text-muted)' }}>Cancel</button>}
              </div>
              {editingId && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '16px' }}>Notice: Modifying the acronym tag will cascade historically across all connected records immediately upon save.</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

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
        
        {/* Governmental aesthetic background overlay */}
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

export default function App() {
  const [data, setData] = useState({});
  const [session, setSession] = useState(null);

  const fetchData = async () => {
    try {
      const { data: cats, error: e1 } = await supabase.from('categories').select('*');
      if (e1) throw e1;
      const { data: stds, error: e2 } = await supabase.from('standards').select('*');
      if (e2) throw e2;
      const { data: hists, error: e3 } = await supabase.from('standard_history').select('*').order('created_at', { ascending: false });
      if (e3) throw e3;

      const formattedStandards = stds.map(std => {
        return {
          id: std.id,
          categoryId: std.category_id,
          itemId: std.item_id,
          title: std.title,
          desc: std.desc_body,
          year: std.ratification_year,
          history: hists.filter(h => h.standard_id === std.id).map(h => ({
            id: h.id,
            year: h.ratification_year,
            code: h.code_state,
            summary: h.summary
          }))
        };
      });

      const formattedCategories = cats.map(c => ({
        id: c.id,
        acronym: c.acronym,
        fullName: c.full_name
      }));

      setData({ categories: formattedCategories, standards: formattedStandards });
    } catch (e) {
      console.error('Data fetch failed', e);
    }
  };

  useEffect(() => {
    fetchData();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const role = session ? 'System Administrator' : 'Guest User';

  return (
    <Router>
      <Header session={session} />
      <Routes>
        <Route path="/" element={<Dashboard data={data} role={role} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/View-Code/:id" element={<ViewCode data={data} />} />
        <Route path="/Create-Code" element={
          role === 'System Administrator' ? <CreateEditCode data={data} refresh={fetchData} isEdit={false} /> : <div className="container mt-4">Access Denied</div>
        } />
        <Route path="/Edit-Code/:id" element={
          role === 'System Administrator' ? <CreateEditCode data={data} refresh={fetchData} isEdit={true} /> : <div className="container mt-4">Access Denied</div>
        } />
        <Route path="/Category-Management" element={
          role === 'System Administrator' ? <CategoryManagement data={data} refresh={fetchData} /> : <div className="container mt-4">Access Denied</div>
        } />
      </Routes>
    </Router>
  );
}
