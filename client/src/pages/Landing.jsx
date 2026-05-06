import { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin-dashboard', { replace: true });
      else if (user.role === 'school') navigate('/school-dashboard', { replace: true });
      else navigate('/student-dashboard', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const { data } = await api.get('/schools');
        const unique = (data || []).filter((s, i, arr) => arr.findIndex(x => x.id === s.id) === i);
        setSchools(unique.slice(0, 3));
      } catch (err) {
        console.error('Error fetching schools:', err);
      }
    };
    fetchSchools();
  }, []);

  if (user) return null;

  return (
    <div className="landing-new">
      {/* SECTION 1 — NAVBAR (inside hero) */}
      <header className="landing-nav">
        <div className="nav-container">
          <Link to="/" className="logo-white">School Connect Rwanda</Link>
          <nav className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/schools">Schools</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </nav>
          <Link to="/login" className="btn-login-nav">Login</Link>
        </div>
      </header>

      {/* SECTION 2 — HERO */}
      <section className="hero-landing">
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          zIndex: 1
        }} />
        <div className="hero-circle circle-tr"></div>
        <div className="hero-circle circle-bl"></div>

        <div className="hero-content">
          <div className="badge-pill">Rwanda's #1 School Discovery Platform</div>
          <h1 style={{ textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>Find Your Future School in <span className="accent-blue">Rwanda</span></h1>
          <p className="subtitle">
            Browse 500+ schools across 30 districts. Compare fees, programs,
            and connect directly with institutions — all in one place.
          </p>

          <div className="hero-actions">
            <Link to="/register" className="btn-get-started">Get Started Free</Link>
            <Link to="/register?type=school" className="btn-register-school">Register Your School</Link>
          </div>

          <div className="hero-search-bar">
            <div className="search-group">
              <input type="text" placeholder="Search by school name..." />
            </div>
            <div className="search-divider"></div>
            <div className="search-group">
              <input type="text" placeholder="District or location..." />
            </div>
            <div className="search-divider"></div>
            <div className="search-group">
              <input type="number" placeholder="Max fee (RWF)..." />
            </div>
            <button className="btn-search-hero">Search</button>
          </div>

          <div className="hero-stats-bar">
            <div className="stat-item">
              <span className="stat-num">500+</span>
              <span className="stat-label">Schools Listed</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">30</span>
              <span className="stat-label">Districts Covered</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">10,000+</span>
              <span className="stat-label">Students Registered</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">Free</span>
              <span className="stat-label">To Use</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — FEATURED SCHOOLS */}
      <section className="section-featured">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="label-blue">FEATURED SCHOOLS</span>
              <h2>Top Schools in Rwanda</h2>
            </div>
            <Link to="/schools" className="link-view-all">View all schools →</Link>
          </div>

          <div className="featured-grid">
            {schools.map(school => (
              <div key={school.id} className="school-card-landing">
                <div className="card-image">
                  <img src="https://images.unsplash.com/photo-1562774053-701939374585?w=600&fit=crop" alt={school.name} />
                </div>
                <div className="card-body">
                  <div className="card-top">
                    <img className="school-icon" src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=80&h=80&fit=crop" alt="icon" />
                    <span className="badge-approved">Approved</span>
                  </div>
                  <h3>{school.name}</h3>
                  <p className="location-muted">{school.location}</p>
                  <div className="star-rating">
                    <span className="star-filled">★★★★</span><span className="star-empty">☆</span>
                    <span className="rating-text">13</span>
                  </div>
                  <p className="fee-green">{school.min_fee.toLocaleString()} — {school.max_fee.toLocaleString()} RWF</p>
                  <div className="tag-list">
                    {(school.programs || '').split(',').slice(0, 2).map(p => (
                      <span key={p} className="tag-pill">{p.trim()}</span>
                    ))}
                  </div>
                  <Link to={`/schools/${school.id}`} className="btn-view-details">View Details</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — HOW IT WORKS */}
      <section className="section-how">
        <div className="container">
          <div className="text-center">
            <h2>Three steps to your future school</h2>
            <p className="subtitle-muted">Simple, fast, and completely free for students.</p>
          </div>

          <div className="how-grid">
            <div className="how-card">
              <div className="step-circle">1</div>
              <h4>Create Your Account</h4>
              <p>Sign up in seconds to start your journey. It's free and easy.</p>
            </div>
            <div className="how-card">
              <div className="step-circle">2</div>
              <h4>Search and Filter</h4>
              <p>Find the perfect match by filtering by location, fees, and more.</p>
            </div>
            <div className="how-card">
              <div className="step-circle">3</div>
              <h4>Connect Directly</h4>
              <p>Message schools directly and get all your questions answered.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — TESTIMONIALS */}
      <section className="section-testimonials">
        <div className="container">
          <div className="text-center">
            <span className="label-blue">TESTIMONIALS</span>
            <h2>What students and schools say</h2>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <p className="quote">"I found my dream school in under 10 minutes. The fee comparison feature saved me so much time and stress."</p>
              <div className="author-row">
                <div className="avatar-circle bg-blue">AM</div>
                <div>
                  <h6>Amina Mutoni</h6>
                  <span>Student Kigali</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <p className="quote">"Since listing on School Connect Rwanda, we received over 200 student inquiries. Best decision we made."</p>
              <div className="author-row">
                <div className="avatar-circle bg-green">JN</div>
                <div>
                  <h6>Jean Nkurunziza</h6>
                  <span>Director Huye Technical</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <p className="quote">"My parents and I could finally compare schools properly. We messaged three schools and chose the best one for me."</p>
              <div className="author-row">
                <div className="avatar-circle bg-purple">RK</div>
                <div>
                  <h6>Rukundo Kevin</h6>
                  <span>Student Musanze</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — SCHOOL CTA */}
      <section className="section-school-cta">
        <div className="container cta-flex">
          <div className="cta-left">
            <h2>Are you a school? List your institution for free</h2>
            <p>Join hundreds of schools already reaching thousands of students across Rwanda.</p>
            <ul className="cta-list">
              <li><span className="check-circle">✓</span> Reach students across all 30 districts</li>
              <li><span className="check-circle">✓</span> Manage your school profile anytime</li>
              <li><span className="check-circle">✓</span> Receive and reply to student messages</li>
              <li><span className="check-circle">✓</span> Completely free — no hidden fees</li>
            </ul>
          </div>
          <div className="cta-right">
            <button onClick={() => navigate('/register?type=school')} className="btn-register-cta">Register Your School</button>
          </div>
        </div>
      </section>

      {/* SECTION 7 — DISTRICTS */}
      <section className="section-districts">
        <div className="container">
          <span className="label-blue">DISTRICTS</span>
          <h2>Schools across all districts</h2>
          <div className="district-pills">
            {["Kigali", "Gasabo", "Kicukiro", "Nyarugenge", "Musanze", "Huye", "Rubavu", "Gisagara", "Nyagatare", "Rwamagana", "Kayonza", "Karongi", "Ngoma", "Bugesera", "Rulindo", "Gakenke", "Burera", "Gicumbi", "Kirehe", "Rusizi", "Nyamasheke", "Rutsiro", "Ngororero", "Nyabihu", "Muhanga", "Ruhango", "Nyanza", "Gisagara", "Nyaruguru", "Gatsibo"].map(d => (
              <button key={d} onClick={() => navigate(`/schools?location=${d}`)} className="district-pill">{d}</button>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8 — FOOTER */}
      <footer className="footer-new">
        <div className="container footer-grid">
          <div className="footer-col">
            <h5 className="logo-white">School Connect Rwanda</h5>
            <p className="footer-tagline">Connecting students and institutions nationwide since 2026.</p>
          </div>
          <div className="footer-col">
            <h6>Platform</h6>
            <Link to="/schools">Browse Schools</Link>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
            <Link to="/register?type=school">For Schools</Link>
          </div>
          <div className="footer-col">
            <h6>Company</h6>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Use</Link>
          </div>
          <div className="footer-col">
            <h6>Contact</h6>
            <p>info@schoolconnect.rw</p>
            <p>+250 795 585029</p>
            <p>Kigali Rwanda</p>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container bottom-flex">
            <span>© 2026 School Connect Rwanda. All rights reserved.</span>
            <span>MIT License — Educational use only</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
