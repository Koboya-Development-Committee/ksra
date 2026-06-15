import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { supabase } from '../supabaseClient';

const CategoryManagement = ({ data, refresh }) => {
  const [acronym, setAcronym] = useState('');
  const [fullName, setFullName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [fallbackId, setFallbackId] = useState('');
  const [deletingId, setDeletingId] = useState(null);

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

export default CategoryManagement;
