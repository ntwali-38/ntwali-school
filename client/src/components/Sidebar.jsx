import { LayoutDashboard, LogOut, Mail, School, Settings, UserCircle, Users } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Sidebar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const initials = (user?.name || 'User')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const dashboardPath = user?.role === 'admin' ? '/admin-dashboard' : user?.role === 'school' ? '/school-dashboard' : '/student-dashboard';
  const isActive = (path) => pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const roleBadgeClass = user?.role === 'admin' ? 'role-badge role-admin' : user?.role === 'school' ? 'role-badge role-school' : 'role-badge role-student';

  const links = user?.role === 'admin'
    ? [
        { to: '/admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/schools', label: 'Schools', icon: School },
        { to: '/admin/users', label: 'Manage Users', icon: Users },
        { to: '/admin/schools', label: 'Manage Schools', icon: Settings },
        { to: '/admin/messages', label: 'Messages', icon: Mail }
      ]
    : user?.role === 'school'
      ? [
          { to: '/school-dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/school/profile', label: 'My Profile', icon: UserCircle },
          { to: '/school/messages', label: 'Messages', icon: Mail }
        ]
      : [
          { to: '/student-dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/schools', label: 'Schools', icon: School },
          { to: '/messages', label: 'Messages', icon: Mail }
        ];

  return (
    <aside className="sidebar">
      <div>
        <h2 className="sidebar-logo">School Connect Rwanda</h2>
        <div className="profile-card">
          <div className="avatar">{initials}</div>
          <div className="profile-text">
            <h4>{user?.name}</h4>
            <p>{user?.email}</p>
            <span className={roleBadgeClass}>{user?.role}</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.to}
                className={`side-link ${isActive(link.to) ? 'active' : ''}`}
                onClick={() => navigate(link.to)}
              >
                <Icon size={16} />
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
      <button className="logout-btn" onClick={handleLogout}>
        <LogOut size={16} />
        <span>Logout</span>
      </button>
    </aside>
  );
}

export default Sidebar;
