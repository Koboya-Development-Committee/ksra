import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { supabase } from './supabaseClient';

import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ViewCode from './components/ViewCode';
import CreateEditCode from './components/CreateEditCode';
import CategoryManagement from './components/CategoryManagement';
import Login from './components/Login';
import Footer from './components/Footer';
import TOS from './components/TOS';
import PP from './components/PP';

export default function App() {
  const [data, setData] = useState({});
  const [session, setSession] = useState(null);
  const [role, setRole] = useState('Guest User');

  const fetchUserRole = async (user) => {
    if (!user) {
      setRole('Guest User');
      return;
    }
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) {
        // Fallback to metadata check if profiles query fails
        const isMetadataAdmin = user.user_metadata?.role === 'admin' || user.app_metadata?.role === 'admin';
        setRole(isMetadataAdmin ? 'System Administrator' : 'Basic User');
      } else if (data) {
        setRole(data.role === 'admin' ? 'System Administrator' : 'Basic User');
      }
    } catch (e) {
      const isMetadataAdmin = user.user_metadata?.role === 'admin' || user.app_metadata?.role === 'admin';
      setRole(isMetadataAdmin ? 'System Administrator' : 'Basic User');
    }
  };

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
      fetchUserRole(session?.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      fetchUserRole(session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header session={session} role={role} />
        <main style={{ flex: '1 0 auto' }}>
          <Routes>
            <Route path="/" element={<Dashboard data={data} role={role} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/tos" element={<TOS />} />
            <Route path="/pp" element={<PP />} />
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
        </main>
        <Footer />
      </div>
    </Router>
  );
}
