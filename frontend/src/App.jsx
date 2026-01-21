import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import CitizenLayout from './layouts/CitizenLayout';

// Auth Pages
import Login from './pages/login';
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
import MyEvents from './pages/citizen/MyEvents';
import MyProjects from './pages/citizen/MyProjects';

// Loading Component
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="text-slate-600">Loading...</div>
    </div>
  );
}

// Public Route - Redirect if already logged in
function PublicRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? "/dashboard" : "/citizen"} replace />;
  }

  return children;
}

// Admin Protected Route
function AdminRoute({ children }) {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/citizen" replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}

// Citizen Protected Route
function CitizenRoute({ children }) {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <CitizenLayout>{children}</CitizenLayout>;
}

// Smart Redirect based on role
function SmartRedirect() {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={isAdmin ? "/dashboard" : "/citizen"} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

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
      <Route path="/citizen/events" element={<CitizenRoute><MyEvents /></CitizenRoute>} />
      <Route path="/citizen/projects" element={<CitizenRoute><MyProjects /></CitizenRoute>} />

      {/* Default */}
      <Route path="/" element={<SmartRedirect />} />
      <Route path="*" element={<SmartRedirect />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;