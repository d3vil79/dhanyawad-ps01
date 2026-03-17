import { useState, useEffect } from 'react';
import { FACILITIES } from '../services/mockData';
import { useAccessibilityStore } from '../contexts/useAccessibilityStore';
import { useHaptics } from './useHaptics';

/**
 * useEmergencyAlerts
 * 
 * Simulated hook that checks for emergency accessibility alerts
 * in the user's saved/favorited facilities and triggers notifications.
 */
export function useEmergencyAlerts() {
  const [activeAlert, setActiveAlert] = useState(null);
  const { speak } = useAccessibilityStore();
  const { tap } = useHaptics();

  useEffect(() => {
    // In a real app, this would be a WebSocket or Push API subscription.
    // For the demo, we check 5 seconds after mount if any saved facility has an emergency.
    
    const checkAlerts = () => {
      const savedWithEmergency = FACILITIES.find(f => f.saved && f.liveStatus?.alerts?.some(a => a.type === 'emergency'));
      
      if (savedWithEmergency) {
        const emergency = savedWithEmergency.liveStatus.alerts.find(a => a.type === 'emergency');
        setActiveAlert({
          facilityName: savedWithEmergency.name,
          facilityId: savedWithEmergency.id,
          message: emergency.message,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        
        speak(`Security Alert for ${savedWithEmergency.name}: ${emergency.message}`);
        tap();
      }
    };

    const timer = setTimeout(checkAlerts, 5000);
    return () => clearTimeout(timer);
  }, []);

  const dismissAlert = () => {
    tap();
    setActiveAlert(null);
  };

  return { activeAlert, dismissAlert };
}
