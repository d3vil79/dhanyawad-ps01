import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { useAuthStore } from './contexts/useAuthStore.js';

// Restore session from stored JWT token before first render
useAuthStore.getState().restoreSession().finally(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
