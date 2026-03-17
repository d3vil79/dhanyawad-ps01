import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Plus, CheckCircle, X } from 'lucide-react';
import { useHaptics } from '../../hooks/useHaptics';

export function ProofGallery({ initialProofs = [] }) {
  const [proofs, setProofs] = useState(initialProofs);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedProof, setSelectedProof] = useState(null);
  const { tap, success } = useHaptics();

  const handleUploadClick = () => {
    tap();
    setIsUploading(true);
    
    // Simulate an upload delay
    setTimeout(() => {
      const newProof = {
        id: 'p_new_' + Date.now(),
        type: 'image',
        url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80', // placeholder
        author: 'You',
        caption: 'Newly verified accessible entrance',
        date: new Date().toISOString().split('T')[0]
      };
      setProofs(prev => [newProof, ...prev]);
      setIsUploading(false);
      success();
    }, 1500);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-3)' }}>
        <h2 style={{ fontSize: 'var(--fs-base)', fontWeight: 'var(--fw-bold)', color: 'var(--clr-text-primary)' }}>
          📸 Verified Proofs ({proofs.length})
        </h2>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleUploadClick}
          disabled={isUploading}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'var(--clr-primary)', color: '#fff',
            border: 'none', borderRadius: 'var(--r-full)',
            padding: '6px 14px', fontSize: 'var(--fs-xs)',
            fontWeight: 'var(--fw-semibold)', cursor: isUploading ? 'default' : 'pointer',
            opacity: isUploading ? 0.7 : 1,
          }}
        >
          {isUploading ? (
            <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ display: 'inline-block' }}>
              <Plus size={14} />
            </motion.span>
          ) : (
            <><Camera size={14} /> Upload Proof</>
          )}
        </motion.button>
      </div>

      {proofs.length === 0 ? (
        <div style={{ background: 'var(--clr-surface)', border: '1px dashed var(--clr-border)', borderRadius: 'var(--r-xl)', padding: 'var(--sp-6)', textAlign: 'center' }}>
          <p style={{ color: 'var(--clr-text-muted)', fontSize: 'var(--fs-sm)' }}>No proofs uploaded yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 'var(--sp-3)', overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none', margin: '0 -16px', padding: '0 16px' }}>
          {proofs.map(proof => (
            <motion.button
              key={proof.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => { tap(); setSelectedProof(proof); }}
              style={{
                background: 'none', border: 'none', padding: 0,
                flexShrink: 0, width: 220, cursor: 'pointer', textAlign: 'left',
              }}
            >
              <div style={{ position: 'relative', width: '100%', height: 140, borderRadius: 'var(--r-lg)', overflow: 'hidden', marginBottom: 8 }}>
                <img src={proof.url} alt={proof.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {proof.author === 'Facility Admin' && (
                  <div style={{ position: 'absolute', top: 8, right: 8, background: 'var(--clr-secondary)', color: '#fff', borderRadius: 'var(--r-full)', padding: 4, display: 'flex' }}>
                    <CheckCircle size={12} />
                  </div>
                )}
              </div>
              <p style={{ fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-bold)', color: 'var(--clr-text-primary)',
                          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.3' }}>
                {proof.caption}
              </p>
              <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-muted)', marginTop: 2 }}>
                By {proof.author} • {proof.date}
              </p>
            </motion.button>
          ))}
        </div>
      )}

      {/* Fullscreen Proof Modal */}
      <AnimatePresence>
        {selectedProof && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 1000,
              display: 'flex', flexDirection: 'column',
            }}
          >
            <div style={{ padding: '20px 16px', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => { tap(); setSelectedProof(null); }}
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 40, height: 40, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px' }}>
              <img src={selectedProof.url} alt={selectedProof.caption} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>
            <div style={{ padding: '24px 16px 40px', color: '#fff' }}>
              <p style={{ fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-bold)', marginBottom: 4 }}>{selectedProof.caption}</p>
              <p style={{ fontSize: 'var(--fs-sm)', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 6 }}>
                By {selectedProof.author} {selectedProof.author === 'Facility Admin' && <CheckCircle size={14} color="var(--clr-secondary)" />} • Uploaded {selectedProof.date}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
