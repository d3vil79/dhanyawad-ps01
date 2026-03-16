import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

/*
  Accessible Button with:
  - Framer Motion tap (scale to 0.95)
  - CSS ripple effect
  - Haptic callback support
  - ARIA role/label support
*/

export function Button({
  children,
  onClick,
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'danger'
  size = 'md',          // 'sm' | 'md' | 'lg'
  icon = null,
  loading = false,
  disabled = false,
  ariaLabel,
  className = '',
  style = {},
  onHaptic,
  ...rest
}) {
  const [ripples, setRipples] = useState([]);
  const btnRef = useRef(null);

  const handleClick = (e) => {
    onHaptic?.();
    // Ripple
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples(r => [...r, { id, x, y }]);
    setTimeout(() => setRipples(r => r.filter(rip => rip.id !== id)), 700);
    onClick?.(e);
  };

  return (
    <motion.button
      ref={btnRef}
      className={`btn btn--${variant} btn--${size} ${className}`}
      style={{ position: 'relative', overflow: 'hidden', ...style }}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      onClick={!disabled && !loading ? handleClick : undefined}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading}
      {...rest}
    >
      {ripples.map(r => (
        <span
          key={r.id}
          style={{
            position: 'absolute',
            left: r.x,
            top: r.y,
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.4)',
            transform: 'translate(-50%,-50%) scale(0)',
            animation: 'ripple-out 0.6s ease-out forwards',
            pointerEvents: 'none',
          }}
        />
      ))}
      {loading ? <span className="btn-loader" aria-hidden="true" /> : null}
      {icon && <span className="btn-icon" aria-hidden="true">{icon}</span>}
      <span>{children}</span>
    </motion.button>
  );
}
