import { Link } from 'react-router-dom';
import StarRating from './StarRating';

function SchoolCard({ school }) {
  const programs = (school.programs || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 3);

  return (
    <article className="card school-card">
      <h3>{school.name}</h3>
      <p className="muted">{school.location}</p>
      <StarRating rating={4} />
      <p className="fee-text">{school.min_fee} — {school.max_fee} RWF</p>
      <div className="program-list">
        {programs.map((program) => (
          <span key={program} className="pill">{program}</span>
        ))}
      </div>
      <Link className="btn-primary" to={`/schools/${school.id}`}>View Details</Link>
    </article>
  );
}

export default SchoolCard;
