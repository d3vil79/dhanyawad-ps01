import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, AlertCircle } from 'lucide-react';
import { useVoiceCommand } from '../../hooks/useVoiceCommand';
import { useHaptics } from '../../hooks/useHaptics';

export function VoiceNavigatorOrb() {
  const navigate = useNavigate();
  const location = useLocation();
  const { tap, success } = useHaptics();

  const handleCommand = (cmd) => {
    if (!cmd) return;
    const lower = cmd.toLowerCase();

    // Map keywords to routes
    if (lower.includes('home') || lower.includes('dashboard')) {
      success();
      navigate('/');
    } else if (lower.includes('map') || lower.includes('discover') || lower.includes('navigate')) {
       success();
      navigate('/map');
    } else if (lower.includes('profile') || lower.includes('settings')) {
       success();
      navigate('/profile');
    } else if (lower.includes('record') || lower.includes('medical') || lower.includes('prescriptions')) {
       success();
      navigate('/medical-records');
    } else if (lower.includes('help') || lower.includes('question') || lower.includes('q&a') || lower.includes('q and a')) {
       success();
      navigate('/qna');
    } else if (lower.includes('sign out') || lower.includes('log out') || lower.includes('logout')) {
       success();
       // Triggering actual logout is handled in dashboard/profile, but we can bounce them to login
      navigate('/auth/login');
    }
  };

  const { listening, transcript, error, startListening, stopListening } = useVoiceCommand({
    onFinalResult: handleCommand
  });

  // Stop listening if we navigate away manually
  useEffect(() => {
    if (listening) stopListening();
  }, [location.pathname, stopListening]);

  return (
    <div className="fixed bottom-24 right-6 z-[250] flex flex-col items-end gap-3 pointer-events-none">
      
      {/* Transcript / Error Bubble */}
      <AnimatePresence>
        {(listening || error) && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto max-w-[200px] p-3 rounded-2xl shadow-lg border text-sm backdrop-blur-md ${
              error 
                ? 'bg-red-500/90 text-white border-red-400' 
                : 'bg-slate-900/90 text-white border-slate-700'
            }`}
          >
            {error ? (
               <div className="flex items-start gap-2">
                 <AlertCircle size={16} className="shrink-0 mt-0.5" />
                 <p className="leading-tight">{error}</p>
               </div>
            ) : (
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                 <p className="leading-tight italic opacity-90">
                   {transcript || "Listening for command..."}
                 </p>
               </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mic Orb Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          tap();
          listening ? stopListening() : startListening();
        }}
        className={`pointer-events-auto h-14 w-14 rounded-full flex items-center justify-center shadow-xl border-4 transition-colors duration-300 ${
          listening 
            ? 'bg-red-500 border-red-200 text-white animate-pulse' 
            : 'bg-blue-600 border-blue-100 text-white hover:bg-blue-700'
        }`}
      >
        {listening ? <MicOff size={24} /> : <Mic size={24} />}
      </motion.button>
    </div>
  );
}
