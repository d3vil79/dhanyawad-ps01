import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

export function AuthLayout() {
  // Generate random stars for the background
  const stars = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }));

  return (
    <div style={{
      position: 'relative',
      minHeight: '100dvh',
      width: '100%',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      background: 'radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%)', // Stellar backdrop
    }}>
      {/* Stars Layer */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          animate={{ opacity: [0.1, 0.8, 0.1], scale: [1, 1.2, 1] }}
          transition={{ duration: star.duration, repeat: Infinity, delay: star.delay, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            backgroundColor: '#fff',
            borderRadius: '50%',
            boxShadow: '0 0 8px 2px rgba(255,255,255,0.4)',
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Massive Nebula Orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2], rotate: [0, 90, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute', top: '-20%', right: '-10%',
          width: '70vw', height: '70vw', borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 60%)',
          filter: 'blur(60px)',
        }}
      />
      
      <motion.div
        animate={{ scale: [1, 1.5, 1], opacity: [0.15, 0.35, 0.15], x: [0, -100, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', bottom: '-20%', left: '-15%',
          width: '60vw', height: '60vw', borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 60%)',
          filter: 'blur(50px)',
        }}
      />

      {/* Grid overlay for depth */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
        maskImage: 'radial-gradient(circle at center, transparent 30%, black 100%)',
        WebkitMaskImage: 'radial-gradient(circle at center, transparent 30%, black 100%)',
      }} />

      {/* Premium Glassmorphic Card */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'relative', zIndex: 10,
          width: '100%', maxWidth: 480,
          background: 'rgba(12, 16, 28, 0.65)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: 32,
          padding: '48px 40px',
          boxShadow: '0 30px 60px -15px rgba(0,0,0,0.8), inset 0 2px 20px rgba(255,255,255,0.05)',
          color: '#f8fafc',
        }}
      >
        <Outlet />
      </motion.div>
    </div>
  );
}
