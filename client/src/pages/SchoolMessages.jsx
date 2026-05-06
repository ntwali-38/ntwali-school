import { useEffect, useState } from 'react';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';

function SchoolMessages() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get('/school/messages');
      setMessages(data.messages || []);
    };
    load();
  }, []);

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="content">
        <section className="card table-wrap">
          <h2>School Messages</h2>
          <table>
            <thead><tr><th>Student</th><th>Subject</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {messages.map((m) => (
                <tr key={m.id}>
                  <td>{m.student_name}</td>
                  <td>{m.subject}</td>
                  <td><span className={`status ${m.status}`}>{m.status}</span></td>
                  <td>{new Date(m.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

export default SchoolMessages;
