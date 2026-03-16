import { motion, AnimatePresence } from 'framer-motion';

export function MicButton({ listening, onClick, size = 64 }) {
  return (
    <motion.button
      onClick={onClick}
      aria-label={listening ? 'Stop voice search' : 'Start voice search'}
      aria-pressed={listening}
      style={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: '50%',
        border: 'none',
        background: listening
          ? 'linear-gradient(135deg, #DC2626, #EF4444)'
          : 'linear-gradient(135deg, #2563EB, #3B82F6)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: listening
          ? '0 4px 20px rgba(220,38,38,0.4)'
          : '0 4px 20px rgba(37,99,235,0.4)',
        zIndex: 1,
        fontSize: size * 0.38,
      }}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      {/* Pulse rings when listening */}
      <AnimatePresence>
        {listening && [0, 1, 2].map(i => (
          <motion.span
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: '2px solid rgba(220,38,38,0.5)',
            }}
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 2.2 + i * 0.4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              delay: i * 0.4,
              ease: 'easeOut',
            }}
          />
        ))}
      </AnimatePresence>
      🎤
    </motion.button>
  );
}
