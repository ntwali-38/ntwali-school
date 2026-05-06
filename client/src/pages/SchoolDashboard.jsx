import { Fragment, useEffect, useState } from 'react';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import StatsCard from '../components/StatsCard';

function SchoolDashboard() {
  const [messages, setMessages] = useState([]);
  const [replyById, setReplyById] = useState({});
  const [activity, setActivity] = useState([]);
  const [status, setStatus] = useState('pending');

  const load = async () => {
    const [{ data: profileRes }, { data: messagesRes }] = await Promise.all([
      api.get('/school/profile'),
      api.get('/school/messages')
    ]);
    setMessages(messagesRes.messages || []);
    setActivity((messagesRes.messages || []).slice(0, 5).map((m) => `Message received: ${m.subject}`));
    setStatus(profileRes.profile?.status || 'pending');
  };

  useEffect(() => { load(); }, []);

  const handleReply = async (id) => {
    await api.post(`/messages/${id}/reply`, { reply: replyById[id] || '' });
    setReplyById((prev) => ({ ...prev, [id]: '' }));
    load();
  };

  const statusText = status === 'approved' ? 'Profile Live' : status === 'rejected' ? 'Rejected — Contact Admin' : 'Pending Review';

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="content">
        <div className="stats-grid">
          <StatsCard label="Messages Received" value={messages.length} />
          <StatsCard label="Profile Views" value={0} />
          <StatsCard label="Students Interested" value={0} />
        </div>
        <section className="card row-between">
          <div>
            <h3>Profile Status</h3>
            <span className={`status ${status === 'approved' ? 'replied' : status === 'rejected' ? 'danger-status' : 'unread'}`}>{statusText}</span>
          </div>
          <button className="btn-primary" onClick={() => window.location.href = '/school/profile'}>Edit Profile</button>
        </section>
        <section className="card table-wrap">
          <h3>My Messages</h3>
          <table>
            <thead><tr><th>Student Name</th><th>Subject</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {messages.map((message) => (
                <Fragment key={message.id}>
                  <tr>
                    <td>{message.student_name}</td>
                    <td>{message.subject}</td>
                    <td>{new Date(message.created_at).toLocaleDateString()}</td>
                    <td><span className={`status ${message.status}`}>{message.status}</span></td>
                    <td><button className="btn-secondary" onClick={() => setReplyById((prev) => ({ ...prev, [message.id]: prev[message.id] ? '' : ' ' }))}>Reply</button></td>
                  </tr>
                  {replyById[message.id] !== undefined && (
                    <tr key={`${message.id}-reply`}>
                      <td colSpan="5">
                        <textarea className="input textarea" value={replyById[message.id]} onChange={(e) => setReplyById((prev) => ({ ...prev, [message.id]: e.target.value }))} />
                        <button className="btn-primary" onClick={() => handleReply(message.id)}>Send Reply</button>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </section>
        <section className="card">
          <h3>Recent Activity</h3>
          <ul>{activity.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
      </main>
    </div>
  );
}

export default SchoolDashboard;
