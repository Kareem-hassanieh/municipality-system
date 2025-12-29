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

// Admin Protected Route
function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

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

  if (!isAdmin) {
    return <Navigate to="/citizen" />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}

// Citizen Protected Route
function CitizenRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

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

  return <CitizenLayout>{children}</CitizenLayout>;
}

// Smart Redirect based on role
function SmartRedirect() {
  const { isAuthenticated, isAdmin, loading } = useAuth();

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

  return isAdmin ? <Navigate to="/dashboard" /> : <Navigate to="/citizen" />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin Routes */}
      <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
      <Route path="/departments" element={<AdminRoute><Departments /></AdminRoute>} />
      <Route path="/citizens" element={<AdminRoute><Citizens /></AdminRoute>} />
      <Route path="/requests" element={<AdminRoute><Requests /></AdminRoute>} />
      <Route path="/permits" element={<AdminRoute><Permits /></AdminRoute>} />
      <Route path="/payments" element={<AdminRoute><Payments /></AdminRoute>} />
      <Route path="/projects" element={<AdminRoute><Projects /></AdminRoute>} />
      <Route path="/employees" element={<AdminRoute><Employees /></AdminRoute>} />
      <Route path="/events" element={<AdminRoute><Events /></AdminRoute>} />

      {/* Citizen Routes */}
      <Route path="/citizen" element={<CitizenRoute><CitizenDashboard /></CitizenRoute>} />
      <Route path="/citizen/requests" element={<CitizenRoute><MyRequests /></CitizenRoute>} />
      <Route path="/citizen/permits" element={<CitizenRoute><MyPermits /></CitizenRoute>} />
      <Route path="/citizen/payments" element={<CitizenRoute><MyPayments /></CitizenRoute>} />
      <Route path="/citizen/profile" element={<CitizenRoute><MyProfile /></CitizenRoute>} />

      {/* Default - Smart Redirect */}
      <Route path="/" element={<SmartRedirect />} />
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