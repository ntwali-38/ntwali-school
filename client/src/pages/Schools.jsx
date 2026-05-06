import { useEffect, useState } from 'react';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import SchoolCard from '../components/SchoolCard';

const districts = ['Kigali', 'Gasabo', 'Kicukiro', 'Nyarugenge', 'Bugesera', 'Rulindo', 'Gakenke', 'Musanze', 'Burera', 'Gicumbi', 'Rwamagana', 'Nyagatare', 'Gatsibo', 'Kayonza', 'Kirehe', 'Ngoma', 'Rubavu', 'Rutsiro', 'Karongi', 'Ngororero', 'Nyabihu', 'Nyamasheke', 'Rusizi', 'Muhanga', 'Huye', 'Nyanza', 'Ruhango', 'Kamonyi', 'Rwamiko', 'Nyaruguru'];
const programOptions = ['General Education', 'STEM', 'Arts', 'Technical', 'Business', 'Science'];

function Schools() {
  const [schools, setSchools] = useState([]);
  const [filters, setFilters] = useState({ location: '', minFee: 0, maxFee: 5000000, program: [] });

  const loadSchools = async (payload) => {
    const { data } = payload ? await api.post('/schools/search', payload) : await api.get('/schools');
    const unique = data.filter((s, i, arr) => arr.findIndex((x) => x.id === s.id) === i);
    setSchools(unique);
  };

  useEffect(() => { loadSchools(); }, []);

  const applyFilters = async () => {
    await loadSchools({
      location: filters.location,
      minFee: filters.minFee,
      maxFee: filters.maxFee,
      program: filters.program.join(', ')
    });
  };

  const clearFilters = async () => {
    const reset = { location: '', minFee: 0, maxFee: 5000000, program: [] };
    setFilters(reset);
    await loadSchools();
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="content split-content">
        <aside className="card filter-panel">
          <h3>Filters</h3>
          <select className="input" value={filters.location} onChange={(e) => setFilters((p) => ({ ...p, location: e.target.value }))}>
            <option value="">All districts</option>
            {districts.map((district) => <option key={district} value={district}>{district}</option>)}
          </select>
          <input className="input" type="range" min="0" max="5000000" step="10000" value={filters.minFee} onChange={(e) => setFilters((p) => ({ ...p, minFee: Number(e.target.value) }))} />
          <input className="input" type="range" min="0" max="5000000" step="10000" value={filters.maxFee} onChange={(e) => setFilters((p) => ({ ...p, maxFee: Number(e.target.value) }))} />
          <input className="input" type="number" value={filters.minFee} onChange={(e) => setFilters((p) => ({ ...p, minFee: Number(e.target.value || 0) }))} />
          <input className="input" type="number" value={filters.maxFee} onChange={(e) => setFilters((p) => ({ ...p, maxFee: Number(e.target.value || 0) }))} />
          <div className="check-list">
            {programOptions.map((program) => (
              <label key={program}>
                <input
                  type="checkbox"
                  checked={filters.program.includes(program)}
                  onChange={(e) => setFilters((p) => ({
                    ...p,
                    program: e.target.checked ? [...p.program, program] : p.program.filter((item) => item !== program)
                  }))}
                />
                {program}
              </label>
            ))}
          </div>
          <button className="btn-primary" onClick={applyFilters}>Apply Filters</button>
          <button className="btn-secondary" onClick={clearFilters}>Clear</button>
        </aside>
        <section>
          <h2>Showing {schools.length} schools</h2>
          <div className="school-grid schools-grid">
            {schools.map((school) => <SchoolCard key={school.id} school={school} />)}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Schools;
