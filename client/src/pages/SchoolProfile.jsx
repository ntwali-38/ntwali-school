import { useEffect, useState } from 'react';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';

const districts = ['Kigali', 'Gasabo', 'Kicukiro', 'Nyarugenge', 'Bugesera', 'Rulindo', 'Gakenke', 'Musanze', 'Burera', 'Gicumbi', 'Rwamagana', 'Nyagatare', 'Gatsibo', 'Kayonza', 'Kirehe', 'Ngoma', 'Rubavu', 'Rutsiro', 'Karongi', 'Ngororero', 'Nyabihu', 'Nyamasheke', 'Rusizi', 'Muhanga', 'Huye', 'Nyanza', 'Ruhango', 'Kamonyi', 'Rwamiko', 'Nyaruguru'];
const programOptions = ['General Education', 'STEM', 'Arts', 'Technical Education', 'Business', 'Science', 'Home Economics', 'Engineering', 'American Curriculum'];

function SchoolProfile() {
  const [form, setForm] = useState({ school_name: '', location: '', description: '', min_fee: 0, max_fee: 0, programs: '', contact_email: '', contact_phone: '+250', website: '' });
  const [toast, setToast] = useState('');
  const [exists, setExists] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get('/school/profile');
      if (data.profile) {
        setExists(true);
        setForm(data.profile);
      }
    };
    load();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    if (exists) await api.put('/school/profile', form);
    else await api.post('/school/profile', form);
    setToast('Profile saved');
    setTimeout(() => setToast(''), 3000);
    setExists(true);
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="content">
        <form className="card profile-form" onSubmit={save}>
          <h2>School Profile</h2>
          <input className="input" placeholder="School Name" value={form.school_name || ''} onChange={(e) => setForm((p) => ({ ...p, school_name: e.target.value }))} />
          <select className="input" value={form.location || ''} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}>
            <option value="">Select location</option>
            {districts.map((district) => <option key={district} value={district}>{district}</option>)}
          </select>
          <textarea className="input textarea" rows="4" placeholder="Description" value={form.description || ''} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          <input className="input" type="number" placeholder="Minimum Annual Fee (RWF)" value={form.min_fee || 0} onChange={(e) => setForm((p) => ({ ...p, min_fee: Number(e.target.value || 0) }))} />
          <input className="input" type="number" placeholder="Maximum Annual Fee (RWF)" value={form.max_fee || 0} onChange={(e) => setForm((p) => ({ ...p, max_fee: Number(e.target.value || 0) }))} />
          <div className="check-list">
            {programOptions.map((item) => (
              <label key={item}>
                <input
                  type="checkbox"
                  checked={(form.programs || '').split(',').map((p) => p.trim()).includes(item)}
                  onChange={(e) => {
                    const current = (form.programs || '').split(',').map((p) => p.trim()).filter(Boolean);
                    const next = e.target.checked ? [...current, item] : current.filter((p) => p !== item);
                    setForm((p) => ({ ...p, programs: next.join(', ') }));
                  }}
                />
                {item}
              </label>
            ))}
          </div>
          <input className="input" placeholder="Contact Email" value={form.contact_email || ''} onChange={(e) => setForm((p) => ({ ...p, contact_email: e.target.value }))} />
          <input className="input" placeholder="Contact Phone" value={form.contact_phone || ''} onChange={(e) => setForm((p) => ({ ...p, contact_phone: e.target.value }))} />
          <input className="input" placeholder="Website URL" value={form.website || ''} onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))} />
          <button className="btn-primary">Save</button>
        </form>
        {toast && <div className="toast success-toast">{toast}</div>}
      </main>
    </div>
  );
}

export default SchoolProfile;
