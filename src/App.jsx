import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { MainAppLayout } from './layouts/MainAppLayout';
import { AuthLayout } from './layouts/AuthLayout';
import Home from './pages/Home';
import MapDiscovery from './pages/MapDiscovery';
import FacilityDetails from './pages/FacilityDetails';
import SubmitReview from './pages/SubmitReview';
import UserProfile from './pages/UserProfile';
import MedicalRecords from './pages/MedicalRecords';
import QnA from './pages/QnA';
import EducationHub from './pages/EducationHub';
import CompanionConnect from './pages/CompanionConnect';
import InterpreterBooking from './pages/InterpreterBooking';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import DoctorDashboard from './pages/Dashboards/DoctorDashboard';
import HospitalDashboard from './pages/Dashboards/HospitalDashboard';
import AdminDashboard from './pages/Dashboards/AdminDashboard';
import SkipLink from './components/common/SkipLink';
import { useLocationStore } from './contexts/useLocationStore';
import { useAuthStore } from './contexts/useAuthStore';

// ── Auth guard wrapper ────────────────────────────────────────────────────────
function ProtectedLayout() {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  return (
    <MainAppLayout>
      <Outlet />
    </MainAppLayout>
  );
}

export default function App() {
  const { fetchLocation } = useLocationStore();
  const { restoreSession } = useAuthStore();

  useEffect(() => {
    fetchLocation();
    restoreSession();
  }, []);

  return (
    <BrowserRouter>
      <SkipLink />
      <Routes>
        {/* ── Auth Routes ─────────────────────────────────── */}
        <Route element={<AuthLayout />}>
          <Route path="/auth/login"    element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
        </Route>

        {/* ── Protected App Routes ────────────────────────── */}
        <Route element={<ProtectedLayout />}>
          <Route path="/"                element={<Home />} />
          <Route path="/map"             element={<MapDiscovery />} />
          <Route path="/facility/:id"    element={<FacilityDetails />} />
          <Route path="/review"          element={<SubmitReview />} />
          <Route path="/profile"         element={<UserProfile />} />
          <Route path="/medical-records" element={<MedicalRecords />} />
          <Route path="/qna"             element={<QnA />} />
          <Route path="/education"       element={<EducationHub />} />
          <Route path="/companion"       element={<CompanionConnect />} />
          <Route path="/interpreter"     element={<InterpreterBooking />} />
          <Route path="/dashboard/doctor"   element={<DoctorDashboard />} />
          <Route path="/dashboard/hospital" element={<HospitalDashboard />} />
          <Route path="/dashboard/admin"    element={<AdminDashboard />} />
        </Route>

        {/* ── Fallback ─────────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
