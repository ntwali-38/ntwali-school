import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Messages from './pages/Messages';
import Register from './pages/Register';
import SchoolDashboard from './pages/SchoolDashboard';
import SchoolDetail from './pages/SchoolDetail';
import SchoolMessages from './pages/SchoolMessages';
import SchoolProfile from './pages/SchoolProfile';
import Schools from './pages/Schools';
import StudentDashboard from './pages/StudentDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/schools" element={<ProtectedRoute><Schools /></ProtectedRoute>} />
      <Route path="/schools/:id" element={<ProtectedRoute><SchoolDetail /></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute allowedRoles={['user']}><Messages /></ProtectedRoute>} />
      <Route path="/student-dashboard" element={<ProtectedRoute allowedRoles={['user']}><StudentDashboard /></ProtectedRoute>} />
      <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard defaultTab="users" /></ProtectedRoute>} />
      <Route path="/admin/schools" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard defaultTab="schools" /></ProtectedRoute>} />
      <Route path="/admin/messages" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard defaultTab="messages" /></ProtectedRoute>} />
      <Route path="/school-dashboard" element={<ProtectedRoute allowedRoles={['school']}><SchoolDashboard /></ProtectedRoute>} />
      <Route path="/school/profile" element={<ProtectedRoute allowedRoles={['school']}><SchoolProfile /></ProtectedRoute>} />
      <Route path="/school/messages" element={<ProtectedRoute allowedRoles={['school']}><SchoolMessages /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
