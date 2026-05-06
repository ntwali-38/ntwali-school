import { useState } from 'react';
import api from '../api/axios';

function MessageModal({ schoolId, onClose }) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/messages', { school_id: schoolId, subject, message });
      setSuccess(true);
      setTimeout(() => onClose('Message sent successfully'), 2000);
    } catch (error) {
      setError(error?.response?.data?.error || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3>Send Message</h3>
        {success ? (
          <div className="success-state">
            <p className="success-mark">✓</p>
            <p>Message sent!</p>
          </div>
        ) : (
        <form onSubmit={handleSubmit}>
          <input className="input" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
          <textarea className="input textarea" rows="4" placeholder="Write your message" value={message} onChange={(e) => setMessage(e.target.value)} required />
          {error && <p className="error">{error}</p>}
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={() => onClose()}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Sending...' : 'Send'}</button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
}

export default MessageModal;
