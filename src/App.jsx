import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainAppLayout } from './layouts/MainAppLayout';
import { AuthLayout } from './layouts/AuthLayout';
import Home from './pages/Home';
import MapDiscovery from './pages/MapDiscovery';
import FacilityDetails from './pages/FacilityDetails';
import SubmitReview from './pages/SubmitReview';
import UserProfile from './pages/UserProfile';
import MedicalRecords from './pages/MedicalRecords';
import QnA from './pages/QnA';
import CompanionConnect from './pages/CompanionConnect';
import InterpreterBooking from './pages/InterpreterBooking';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import DoctorDashboard from './pages/Dashboards/DoctorDashboard';
import HospitalDashboard from './pages/Dashboards/HospitalDashboard';
import AdminDashboard from './pages/Dashboards/AdminDashboard';
import { useLocationStore } from './contexts/useLocationStore';
import { useAuthStore } from './contexts/useAuthStore';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  return children;
}

function RoleBasedHome() {
  const { user } = useAuthStore();
  if (user?.role === 'doctor') return <DoctorDashboard />;
  if (user?.role === 'hospital') return <HospitalDashboard />;
  if (user?.role === 'admin') return <AdminDashboard />;
  return <Home />;
}

export default function App() {
  const { fetchLocation } = useLocationStore();

  // Request GPS on first load
  useEffect(() => {
    fetchLocation();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Protected App Routes */}
        <Route path="/" element={<ProtectedRoute><MainAppLayout /></ProtectedRoute>}>
          <Route index element={<RoleBasedHome />} />
          <Route path="map" element={<MapDiscovery />} />
          <Route path="facility/:id" element={<FacilityDetails />} />
          <Route path="review" element={<SubmitReview />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="medical-records" element={<MedicalRecords />} />
          <Route path="qna" element={<QnA />} />
          <Route path="companion" element={<CompanionConnect />} />
          <Route path="interpreter" element={<InterpreterBooking />} />
        </Route>

        <Route path="*" element={
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            height: '100vh', textAlign: 'center', padding: 24, background: 'var(--clr-bg)'
          }}>
            <p style={{ fontSize: 64, marginBottom: 16 }}>🏥</p>
            <h1 style={{ fontWeight: 'var(--fw-extrabold)', marginBottom: 8, color: 'var(--clr-text-primary)' }}>Page Not Found</h1>
            <p style={{ color: 'var(--clr-text-muted)', marginBottom: 24 }}>The page you're looking for doesn't exist.</p>
            <a href="/" style={{
              padding: '12px 24px', borderRadius: 'var(--r-lg)',
              background: 'var(--clr-primary)', color: '#fff',
              fontWeight: 'var(--fw-semibold)', textDecoration: 'none',
            }}>Return to Portal</a>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}
