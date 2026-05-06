import { useEffect, useState } from 'react';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import SchoolCard from '../components/SchoolCard';
import { useAuth } from '../context/AuthContext';

const districts = ['Kigali', 'Gasabo', 'Kicukiro', 'Nyarugenge', 'Bugesera', 'Rulindo', 'Gakenke', 'Musanze', 'Burera', 'Gicumbi', 'Rwamagana', 'Nyagatare', 'Gatsibo', 'Kayonza', 'Kirehe', 'Ngoma', 'Rubavu', 'Rutsiro', 'Karongi', 'Ngororero', 'Nyabihu', 'Nyamasheke', 'Rusizi', 'Muhanga', 'Huye', 'Nyanza', 'Ruhango', 'Kamonyi', 'Ngororero North', 'Nyabugogo'];

function Home() {
  const { user } = useAuth();
  const [schools, setSchools] = useState([]);
  const [filters, setFilters] = useState({ location: '', minFee: '', maxFee: '' });

  const loadSchools = async (payload) => {
    const { data } = payload ? await api.post('/schools/search', payload) : await api.get('/schools');
    setSchools(data);
  };

  useEffect(() => { loadSchools(); }, []);

  const onSearch = async (e) => {
    e.preventDefault();
    await loadSchools(filters);
  };

  const unique = schools.filter((s, i, arr) => arr.findIndex((x) => x.id === s.id) === i).slice(0, 6);

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="content">
        <section className="card banner">
          <h1>Welcome back, {user?.name || 'User'}</h1>
        </section>
        <form className="card form-row" onSubmit={onSearch}>
          <select className="input" value={filters.location} onChange={(e) => setFilters((p) => ({ ...p, location: e.target.value }))}>
            <option value="">All locations</option>
            {districts.map((district) => <option key={district} value={district}>{district}</option>)}
          </select>
          <input className="input" type="number" placeholder="Min Fee" value={filters.minFee} onChange={(e) => setFilters((p) => ({ ...p, minFee: e.target.value }))} />
          <input className="input" type="number" placeholder="Max Fee" value={filters.maxFee} onChange={(e) => setFilters((p) => ({ ...p, maxFee: e.target.value }))} />
          <button className="btn-primary" type="submit">Search</button>
        </form>
        <h2>Featured Schools</h2>
        <div className="school-grid">
          {unique.map((school) => <SchoolCard key={school.id} school={school} />)}
        </div>
      </main>
    </div>
  );
}

export default Home;
