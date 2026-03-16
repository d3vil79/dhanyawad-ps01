import { useCallback } from 'react';

export function useHaptics() {
  const vibrate = useCallback((pattern = [30]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }, []);

  const tap = useCallback(() => vibrate([25]), [vibrate]);
  const success = useCallback(() => vibrate([20, 50, 20]), [vibrate]);
  const error = useCallback(() => vibrate([80, 30, 80]), [vibrate]);
  const longPress = useCallback(() => vibrate([60]), [vibrate]);

  return { vibrate, tap, success, error: error, longPress };
}
