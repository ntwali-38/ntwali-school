import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Globe, Mail, MapPin, Phone } from 'lucide-react';
import api from '../api/axios';
import MessageModal from '../components/MessageModal';
import Sidebar from '../components/Sidebar';
import StarRating from '../components/StarRating';

function SchoolDetail() {
  const { id } = useParams();
  const [school, setSchool] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get(`/schools/${id}`);
      setSchool(data);
    };
    load();
  }, [id]);

  if (!school) return <div className="auth-page">Loading...</div>;

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="content school-detail-layout">
        <section className="card detail-left">
          <h1 className="school-title">{school.name}</h1>
          <span className="location-badge"><MapPin size={14} /> {school.location}</span>
          <StarRating rating={4} />
          <p className="detail-paragraph">{school.description || 'No description available.'}</p>
          <h3>Programs Offered</h3>
          <div className="program-list">
            {(school.programs || '').split(',').map((program) => (
              <span className="pill" key={program.trim()}>{program.trim()}</span>
            ))}
          </div>
          <h3>Fee Range</h3>
          <p className="fee-display">{school.min_fee} — {school.max_fee} RWF</p>
          <p className="muted">Annual tuition fee</p>
          <hr className="divider" />
          <h3>About</h3>
          <p className="detail-paragraph">{school.description || 'No additional information available.'}</p>
          <Link to="/schools" className="btn-secondary">Back to Schools</Link>
        </section>
        <aside className="detail-right">
          <div className="card contact-card">
            <h3>Contact This School</h3>
            <p><Mail size={16} /> {school.contact_email || '-'}</p>
            <p><Phone size={16} /> {school.contact_phone || '-'}</p>
            <p><Globe size={16} /> {school.website || '-'}</p>
            <button className="btn-primary full" onClick={() => setShowModal(true)}>Send Message</button>
            <button className="btn-outline full">Save School</button>
          </div>
        </aside>
        {showModal && <MessageModal schoolId={school.id} onClose={(message) => { setShowModal(false); if (message) setToast(message); }} />}
        {toast && <div className="toast">{toast}</div>}
      </main>
    </div>
  );
}

export default SchoolDetail;
