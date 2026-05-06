import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';

function Messages() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get('/messages/my');
      setMessages(data.messages || []);
    };
    load();
  }, []);

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="content">
        <section className="card table-wrap">
          <h2>Messages</h2>
          <table>
            <thead><tr><th>School</th><th>Subject</th><th>Status</th><th>Date</th></tr></thead>
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
      </main>
    </div>
  );
}

export default Messages;
