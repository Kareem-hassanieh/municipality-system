import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import CitizenLayout from './layouts/CitizenLayout';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Pages
import Dashboard from './pages/Dashboard';
import Departments from './pages/Departments';
import Citizens from './pages/Citizens';
import Requests from './pages/Requests';
import Permits from './pages/Permits';
import Payments from './pages/Payments';
import Projects from './pages/Projects';
import Employees from './pages/Employees';
import Events from './pages/Events';

// Citizen Pages
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import MyRequests from './pages/citizen/MyRequests';
import MyPermits from './pages/citizen/MyPermits';
import MyPayments from './pages/citizen/MyPayments';
import MyProfile from './pages/citizen/MyProfile';

function ProtectedRoute({ children, layout = 'admin' }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (layout === 'citizen') {
    return <CitizenLayout>{children}</CitizenLayout>;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/departments" element={<ProtectedRoute><Departments /></ProtectedRoute>} />
      <Route path="/citizens" element={<ProtectedRoute><Citizens /></ProtectedRoute>} />
      <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
      <Route path="/permits" element={<ProtectedRoute><Permits /></ProtectedRoute>} />
      <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
      <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
      <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
      <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />

      {/* Citizen Routes */}
      <Route path="/citizen" element={<ProtectedRoute layout="citizen"><CitizenDashboard /></ProtectedRoute>} />
      <Route path="/citizen/requests" element={<ProtectedRoute layout="citizen"><MyRequests /></ProtectedRoute>} />
      <Route path="/citizen/permits" element={<ProtectedRoute layout="citizen"><MyPermits /></ProtectedRoute>} />
      <Route path="/citizen/payments" element={<ProtectedRoute layout="citizen"><MyPayments /></ProtectedRoute>} />
      <Route path="/citizen/profile" element={<ProtectedRoute layout="citizen"><MyProfile /></ProtectedRoute>} />

      {/* Default Redirect */}
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;