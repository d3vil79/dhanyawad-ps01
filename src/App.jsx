import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainAppLayout } from './layouts/MainAppLayout';
import Home from './pages/Home';
import MapDiscovery from './pages/MapDiscovery';
import FacilityDetails from './pages/FacilityDetails';
import SubmitReview from './pages/SubmitReview';
import UserProfile from './pages/UserProfile';
import { useLocationStore } from './contexts/useLocationStore';

export default function App() {
  const { fetchLocation } = useLocationStore();

  // Request GPS on first load
  useEffect(() => {
    fetchLocation();
  }, []);

  return (
    <BrowserRouter>
      <MainAppLayout>
        <Routes>
          <Route path="/"             element={<Home />} />
          <Route path="/map"          element={<MapDiscovery />} />
          <Route path="/facility/:id" element={<FacilityDetails />} />
          <Route path="/review"       element={<SubmitReview />} />
          <Route path="/profile"      element={<UserProfile />} />
          <Route path="*" element={
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              height: '70vh', textAlign: 'center', padding: 24,
            }}>
              <p style={{ fontSize: 64, marginBottom: 16 }}>🏥</p>
              <h1 style={{ fontWeight: 'var(--fw-extrabold)', marginBottom: 8, color: 'var(--clr-text-primary)' }}>Page Not Found</h1>
              <p style={{ color: 'var(--clr-text-muted)', marginBottom: 24 }}>The page you're looking for doesn't exist.</p>
              <a href="/" style={{
                padding: '12px 24px', borderRadius: 'var(--r-lg)',
                background: 'var(--clr-primary)', color: '#fff',
                fontWeight: 'var(--fw-semibold)', textDecoration: 'none',
              }}>Go Home</a>
            </div>
          } />
        </Routes>
      </MainAppLayout>
    </BrowserRouter>
  );
}
