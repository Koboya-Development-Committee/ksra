import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { supabase } from './supabaseClient';

import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ViewCode from './components/ViewCode';
import CreateEditCode from './components/CreateEditCode';
import CategoryManagement from './components/CategoryManagement';
import Login from './components/Login';

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

      const formattedStandards = stds.map(std => ({
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
      }));

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
