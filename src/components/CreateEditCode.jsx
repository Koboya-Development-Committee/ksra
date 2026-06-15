import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, Save, ShieldCheck } from 'lucide-react';
import { supabase } from '../supabaseClient';

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

export default CreateEditCode;
