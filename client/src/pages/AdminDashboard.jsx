import { useEffect, useState } from 'react';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import StatsCard from '../components/StatsCard';

const initialSchoolForm = { name: '', location: '', min_fee: '', max_fee: '', programs: '', description: '' };

function AdminDashboard({ defaultTab = 'overview' }) {
  const [tab, setTab] = useState(defaultTab);
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [schools, setSchools] = useState([]);
  const [messages, setMessages] = useState([]);
  const [schoolProfiles, setSchoolProfiles] = useState([]);
  const [schoolForm, setSchoolForm] = useState(initialSchoolForm);
  const [schoolModal, setSchoolModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);

  const load = async () => {
    const [statsRes, usersRes, schoolsRes, messagesRes] = await Promise.all([
      api.get('/auth/stats'),
      api.get('/auth/admin/users'),
      api.get('/schools'),
      api.get('/auth/messages')
    ]);
    setStats(statsRes.data);
    setUsers(usersRes.data.users || []);
    const uniqueSchools = (schoolsRes.data || []).filter((s, i, arr) => arr.findIndex((x) => x.id === s.id) === i);
    setSchools(uniqueSchools);
    setMessages(messagesRes.data.messages || []);
    const { data: profilesRes } = await api.get('/admin/school-profiles');
    setSchoolProfiles(profilesRes.profiles || []);
  };

  useEffect(() => { setTab(defaultTab); }, [defaultTab]);
  useEffect(() => { load(); }, [defaultTab]);
  const filteredMessages = statusFilter === 'all' ? messages : messages.filter((m) => m.status === statusFilter);
  const recentActivity = messages.slice(0, 5);

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="content">
        <h1>Admin Dashboard</h1>
        <div className="tab-row">
          {['overview', 'users', 'schools', 'school profiles', 'messages'].map((name) => (
            <button key={name} className={tab === name ? 'btn-primary' : 'btn-secondary'} onClick={() => setTab(name)}>
              {name[0].toUpperCase() + name.slice(1)}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <>
            <div className="stats-grid">
              <StatsCard label="Total Users" value={stats.totalUsers || 0} />
              <StatsCard label="Total Schools" value={stats.totalSchools || 0} />
              <StatsCard label="Total Messages" value={stats.totalMessages || 0} />
              <StatsCard label="Active Today" value={Math.min(stats.totalUsers || 0, 24)} />
            </div>
            <section className="card">
              <h3>Recent Activity</h3>
              <ul>
                {recentActivity.map((item) => (
                  <li key={item.id}>{item.sender_name} sent "{item.subject}" to {item.school_name}</li>
                ))}
              </ul>
            </section>
          </>
        )}

        {tab === 'users' && (
          <section className="card table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined Date</th><th>Actions</th></tr></thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td><td>{u.email}</td><td>{u.role}</td><td>{new Date(u.created_at).toLocaleDateString()}</td>
                    <td>
                      <button className="btn-secondary" onClick={async () => { await api.put(`/auth/admin/users/${u.id}/role`, { role: u.role === 'admin' ? 'user' : 'admin' }); load(); }}>
                        {u.role === 'admin' ? 'Make User' : 'Make Admin'}
                      </button>
                      <button className="btn-danger" onClick={() => setConfirmDelete(u)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {tab === 'schools' && (
          <section className="card table-wrap">
            <div className="row-between">
              <h3>Schools</h3>
              <button className="btn-primary" onClick={() => setSchoolModal(true)}>Add School</button>
            </div>
            <table>
              <thead><tr><th>Name</th><th>Location</th><th>Fee Range</th><th>Programs</th><th>Actions</th></tr></thead>
              <tbody>
                {schools.map((s) => (
                  <tr key={s.id}>
                    <td>{s.name}</td><td>{s.location}</td><td>{s.min_fee}-{s.max_fee}</td><td>{s.programs}</td>
                    <td>
                      <button className="btn-secondary" onClick={() => { setSchoolForm(s); setSchoolModal(true); }}>Edit</button>
                      <button className="btn-danger" onClick={async () => { await api.delete(`/schools/${s.id}`); load(); }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {tab === 'messages' && (
          <section className="card table-wrap">
            <div className="row-between">
              <h3>Messages</h3>
              <select className="input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All</option><option value="unread">Unread</option><option value="read">Read</option><option value="replied">Replied</option>
              </select>
            </div>
            <table>
              <thead><tr><th>From</th><th>To</th><th>Subject</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {filteredMessages.map((m) => (
                  <tr key={m.id} onClick={() => setSelectedMessage(m)}>
                    <td>{m.sender_name}</td><td>{m.school_name}</td><td>{m.subject}</td><td>{m.status}</td><td>{new Date(m.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {tab === 'school profiles' && (
          <section className="card table-wrap">
            <h3>School Profiles</h3>
            <table>
              <thead><tr><th>School Name</th><th>Owner Email</th><th>Location</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {schoolProfiles.map((profile) => (
                  <tr key={profile.id}>
                    <td>{profile.school_name}</td>
                    <td>{profile.owner_email}</td>
                    <td>{profile.location}</td>
                    <td>{profile.status}</td>
                    <td>
                      <button className="btn-secondary" onClick={async () => { await api.put(`/admin/school-profiles/${profile.id}/approve`); load(); }}>Approve</button>
                      <button className="btn-danger" onClick={async () => { await api.put(`/admin/school-profiles/${profile.id}/reject`); load(); }}>Reject</button>
                      <button className="btn-primary" onClick={() => setSelectedMessage({ subject: profile.school_name, message: profile.description || 'No details available' })}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {confirmDelete && (
          <div className="modal-overlay">
            <div className="modal-card">
              <h3>Confirm Delete</h3>
              <p>Delete {confirmDelete.name}?</p>
              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setConfirmDelete(null)}>Cancel</button>
                <button className="btn-danger" onClick={async () => { await api.delete(`/auth/admin/users/${confirmDelete.id}`); setConfirmDelete(null); load(); }}>Delete</button>
              </div>
            </div>
          </div>
        )}

        {schoolModal && (
          <div className="modal-overlay">
            <div className="modal-card">
              <h3>{schoolForm.id ? 'Edit School' : 'Add School'}</h3>
              <div className="modal-form">
                {['name', 'location', 'min_fee', 'max_fee', 'programs', 'description', 'contact_email', 'contact_phone', 'website'].map((field) => (
                  <input key={field} className="input" placeholder={field} value={schoolForm[field] || ''} onChange={(e) => setSchoolForm((p) => ({ ...p, [field]: e.target.value }))} />
                ))}
              </div>
              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => { setSchoolModal(false); setSchoolForm(initialSchoolForm); }}>Cancel</button>
                <button className="btn-primary" onClick={async () => {
                  if (schoolForm.id) await api.put(`/schools/${schoolForm.id}`, schoolForm);
                  else await api.post('/schools', schoolForm);
                  setSchoolModal(false);
                  setSchoolForm(initialSchoolForm);
                  load();
                }}>Save</button>
              </div>
            </div>
          </div>
        )}

        {selectedMessage && (
          <div className="modal-overlay">
            <div className="modal-card">
              <h3>{selectedMessage.subject}</h3>
              <p>{selectedMessage.message}</p>
              <button className="btn-secondary" onClick={() => setSelectedMessage(null)}>Close</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
