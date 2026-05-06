import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import StatsCard from '../components/StatsCard';
import SchoolCard from '../components/SchoolCard';
import { useAuth } from '../context/AuthContext';

function StudentDashboard() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [messagesRes, schoolsRes] = await Promise.all([
        api.get('/messages/my'),
        api.get('/schools')
      ]);
      setMessages(messagesRes.data.messages || []);
      const unique = (schoolsRes.data || []).filter((s, i, arr) => arr.findIndex((x) => x.id === s.id) === i);
      setSchools(unique);
    };
    load();
  }, []);

  const recommended = [...schools].sort(() => 0.5 - Math.random()).slice(0, 3);

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="content">
        <h1>{user?.name} Dashboard</h1>
        <div className="stats-grid">
          <StatsCard label="Schools Browsed" value={schools.length} />
          <StatsCard label="Messages Sent" value={messages.length} />
          <StatsCard label="Saved Schools" value={0} />
        </div>

        <section className="card table-wrap">
          <h3>My Messages</h3>
          <table>
            <thead><tr><th>School Name</th><th>Subject</th><th>Status</th><th>Date Sent</th></tr></thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg.id}>
                  <td>{msg.school_name}</td>
                  <td>{msg.subject}</td>
                  <td><span className={`status ${msg.status}`}>{msg.status}</span></td>
                  <td>{new Date(msg.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="card">
          <h3>Recommended Schools</h3>
          <div className="school-grid">
            {recommended.map((school) => (
              <SchoolCard key={school.id} school={school} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default StudentDashboard;
