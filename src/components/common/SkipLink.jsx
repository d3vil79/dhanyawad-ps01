import { motion } from 'framer-motion';

export default function SkipLink() {
  return (
    <motion.a
      href="#main-content"
      style={{
        position: 'absolute',
        top: -100,
        left: 20,
        background: 'var(--clr-primary)',
        color: '#fff',
        padding: '12px 24px',
        borderRadius: 'var(--r-md)',
        zIndex: 5000,
        fontWeight: 'var(--fw-bold)',
        textDecoration: 'none',
        boxShadow: 'var(--shadow-lg)'
      }}
      whileFocus={{ top: 20 }}
    >
      Skip to content
    </motion.a>
  );
}
