import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mic, Square, CheckCircle, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHaptics } from '../../hooks/useHaptics';
import { useVoiceCommand } from '../../hooks/useVoiceCommand';
import { useAccessibilityStore } from '../../contexts/useAccessibilityStore';
import { FACILITIES } from '../../services/mockData';
import { submitReview } from '../../services/api';

const QUICK_TAGS = [
  'Ramp available', 'Accessible washroom', 'ASL interpreter', 'Tactile paths',
  'Quiet area', 'Elevator working', 'Parking accessible', 'Kind staff',
  'Visual alerts', 'Audio guidance',
];

const visualizerHeights = Array.from({ length: 18 }).map(() => Math.random() * 22 + 6);
const visualizerDurations = Array.from({ length: 18 }).map(() => 0.45 + Math.random() * 0.3);

export default function SubmitReview() {
  const navigate = useNavigate();
  const { tap, success } = useHaptics();
  const { speak } = useAccessibilityStore();

  const [selectedFacility, setSelectedFacility] = useState(FACILITIES[0].id);
  const [score, setScore] = useState(7);
  const [selectedTags, setSelectedTags] = useState([]);
  const [textReview, setTextReview] = useState('');
  const [reviewerRole, setReviewerRole] = useState('Disabled Individual');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Voice review recording — appends final transcript to textarea
  const { listening, transcript, error: voiceError, startListening, stopListening } = useVoiceCommand({
    onFinalResult: (text) => {
      setTextReview(prev => (prev ? prev + ' ' : '') + text);
      speak(`Added to review: ${text}`);
    },
  });

  const toggleTag = (tag) => {
    tap();
    setSelectedTags(prev => {
      const next = prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag];
      speak(`${tag} ${next.includes(tag) ? 'selected' : 'deselected'}.`);
      return next;
    });
  };

  const handleVoice = () => {
    tap();
    if (listening) {
      stopListening();
    } else {
      speak('Recording started. Speak your review.', { force: true });
      startListening();
    }
  };

  const clearReview = () => {
    tap();
    setTextReview('');
    speak('Review text cleared.');
  };

  const handleSubmit = async () => {
    if (!textReview.trim() && selectedTags.length === 0) {
      speak('Please write a review or select at least one tag before submitting.');
      return;
    }
    tap();
    setSubmitting(true);
    speak('Submitting your review. Please wait.');
    await submitReview(selectedFacility, { score, tags: selectedTags, text: textReview, role: reviewerRole });
    success();
    speak('Review submitted successfully. Thank you for helping the community.');
    setSubmitting(false);
    setSubmitted(true);
  };

  const scoreColor = (s) => s >= 8 ? '#059669' : s >= 5 ? '#D97706' : '#DC2626';
  const scoreLabel = (s) => s >= 8 ? 'Excellent' : s >= 6 ? 'Good' : s >= 4 ? 'Moderate' : 'Poor';

  if (submitted) {
    return (
      <div style={{
        minHeight: '100dvh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 32, background: 'linear-gradient(160deg,#F0FDF4,#EFF6FF)',
      }}>
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          style={{ textAlign: 'center', maxWidth: 320 }}
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'var(--clr-secondary-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <CheckCircle size={40} color="var(--clr-secondary)" />
          </motion.div>
          <h2 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 'var(--fw-extrabold)', marginBottom: 8 }}>Review Submitted!</h2>
          <p style={{ color: 'var(--clr-text-secondary)', marginBottom: 28, lineHeight: 'var(--lh-relaxed)' }}>
            Thank you for helping the community find accessible healthcare. Your review makes a real difference. 🙏
          </p>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => { setSubmitted(false); setScore(7); setSelectedTags([]); setTextReview(''); tap(); }}
            style={{
              padding: '12px 28px', borderRadius: 'var(--r-lg)',
              background: 'var(--clr-primary)', color: '#fff',
              fontWeight: 'var(--fw-semibold)', border: 'none', cursor: 'pointer', marginRight: 12,
            }}
          >Submit Another</motion.button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => { tap(); navigate('/'); }}
            style={{
              padding: '12px 28px', borderRadius: 'var(--r-lg)',
              background: 'transparent', color: 'var(--clr-primary)',
              fontWeight: 'var(--fw-semibold)', border: '2px solid var(--clr-primary)', cursor: 'pointer',
            }}
          >Go Home</motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--clr-bg)', minHeight: '100dvh', paddingBottom: 100 }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(160deg,#EFF6FF,#F0FDF4)',
        padding: 'var(--sp-6) var(--sp-4) var(--sp-5)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => { tap(); navigate(-1); }}
            aria-label="Go back"
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: '#fff', border: '1px solid var(--clr-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
          >
            <ArrowLeft size={16} color="var(--clr-text-primary)" />
          </motion.button>
          <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 'var(--fw-extrabold)', color: 'var(--clr-text-primary)' }}>
            Submit Review
          </h1>
        </div>
        <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--clr-text-muted)', paddingLeft: 48 }}>
          Share your accessibility experience to help the community.
        </p>
      </div>

      <div style={{ padding: 'var(--sp-5) var(--sp-4)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>

        {/* Facility */}
        <section>
          <label htmlFor="facility-select" style={{ display: 'block', fontWeight: 'var(--fw-semibold)', marginBottom: 8 }}>
            Select Facility
          </label>
          <select
            id="facility-select"
            value={selectedFacility}
            onChange={e => { setSelectedFacility(e.target.value); tap(); speak(`Selected ${FACILITIES.find(f => f.id === e.target.value)?.name}`); }}
            style={{
              width: '100%', padding: '12px 16px',
              borderRadius: 'var(--r-lg)', border: '2px solid var(--clr-border)',
              background: 'var(--clr-bg-card)', color: 'var(--clr-text-primary)',
              fontSize: 'var(--fs-base)', appearance: 'none', cursor: 'pointer',
            }}
          >
            {FACILITIES.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </section>

        {/* Score Slider */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ fontWeight: 'var(--fw-semibold)' }}>Accessibility Score</h2>
            <motion.div key={score} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <span style={{ fontSize: 'var(--fs-2xl)', fontWeight: 'var(--fw-extrabold)', color: scoreColor(score) }}>
                {score}
              </span>
              <span style={{ fontSize: 'var(--fs-sm)', color: scoreColor(score), marginLeft: 4 }}>
                /10 · {scoreLabel(score)}
              </span>
            </motion.div>
          </div>
          <input
            type="range" min={1} max={10} value={score}
            onChange={e => { setScore(Number(e.target.value)); speak(`Score ${e.target.value} out of 10.`); }}
            onMouseUp={() => tap()}
            onTouchEnd={() => tap()}
            aria-label={`Accessibility score: ${score} out of 10`}
            aria-valuemin={1} aria-valuemax={10} aria-valuenow={score}
            style={{ width: '100%', height: 8, borderRadius: 4, accentColor: scoreColor(score), cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-muted)' }}>1 — Very Poor</span>
            <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-muted)' }}>10 — Excellent</span>
          </div>
        </section>

        {/* Quick Tags */}
        <section>
          <h2 style={{ fontWeight: 'var(--fw-semibold)', marginBottom: 12 }}>What did you verify?</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {QUICK_TAGS.map(tag => {
              const active = selectedTags.includes(tag);
              return (
                <motion.button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  aria-pressed={active}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: '8px 14px', borderRadius: 'var(--r-full)',
                    border: `2px solid ${active ? 'var(--clr-primary)' : 'var(--clr-border)'}`,
                    background: active ? 'var(--clr-primary-light)' : 'var(--clr-bg-card)',
                    color: active ? 'var(--clr-primary)' : 'var(--clr-text-secondary)',
                    fontWeight: active ? 'var(--fw-semibold)' : 'var(--fw-regular)',
                    fontSize: 'var(--fs-sm)', cursor: 'pointer',
                    transition: 'all var(--transition-base)',
                  }}
                >
                  {active ? '✓ ' : ''}{tag}
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* Reviewer Role Selection */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 'var(--fs-base)', fontWeight: 'var(--fw-bold)', color: 'var(--clr-text-primary)', marginBottom: 12 }}>
            Your Perspective
          </h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['Disabled Individual', 'Caregiver', 'Ally'].map(role => (
              <button
                key={role}
                type="button"
                onClick={() => { tap(); setReviewerRole(role); speak(`Perspective set to ${role}`); }}
                style={{
                  padding: '8px 16px', borderRadius: 'var(--r-full)',
                  background: reviewerRole === role ? 'var(--clr-primary)' : 'var(--clr-surface)',
                  color: reviewerRole === role ? '#fff' : 'var(--clr-text-secondary)',
                  border: '1.5px solid', borderColor: reviewerRole === role ? 'var(--clr-primary)' : 'var(--clr-border)',
                  fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-medium)', cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Text + Voice Review */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ fontWeight: 'var(--fw-semibold)' }}>Your Review</h2>
            {textReview && (
              <button
                onClick={clearReview}
                aria-label="Clear review text"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--clr-alert-red)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--fs-xs)' }}
              >
                <Trash2 size={13} /> Clear
              </button>
            )}
          </div>
          <textarea
            value={textReview}
            onChange={e => setTextReview(e.target.value)}
            onFocus={() => speak('Write your accessibility experience. Or use the voice recording button below.')}
            placeholder="Describe your accessibility experience… OR use the mic below to speak your review."
            aria-label="Write your review"
            rows={4}
            style={{
              width: '100%', padding: '12px 16px',
              borderRadius: 'var(--r-lg)',
              border: `2px solid ${listening ? 'var(--clr-alert-red)' : 'var(--clr-border)'}`,
              background: 'var(--clr-bg-card)', color: 'var(--clr-text-primary)',
              fontSize: 'var(--fs-base)', resize: 'vertical',
              lineHeight: 'var(--lh-relaxed)', fontFamily: 'inherit', outline: 'none',
              marginBottom: 12, transition: 'border-color var(--transition-base)',
            }}
          />

          {/* Live transcript preview */}
          <AnimatePresence>
            {listening && transcript && (
              <motion.div
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{
                  padding: '8px 12px', borderRadius: 'var(--r-md)',
                  background: '#FEF2F2', border: '1px solid var(--clr-alert-red)',
                  fontSize: 'var(--fs-sm)', color: 'var(--clr-alert-red)',
                  marginBottom: 12, fontStyle: 'italic',
                }}
                aria-live="polite"
              >
                🎤 "{transcript}"
              </motion.div>
            )}
          </AnimatePresence>

          {voiceError && (
            <p role="alert" style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-alert-red)', marginBottom: 8 }}>⚠ {voiceError}</p>
          )}

          {/* Voice Recorder Button */}
          <motion.button
            onClick={handleVoice}
            whileTap={{ scale: 0.95 }}
            aria-label={listening ? 'Stop recording' : 'Start voice recording'}
            aria-pressed={listening}
            style={{
              width: '100%', padding: '14px',
              borderRadius: 'var(--r-lg)',
              border: `2px solid ${listening ? 'var(--clr-alert-red)' : 'var(--clr-border)'}`,
              background: listening ? '#FEF2F2' : 'var(--clr-bg-card)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
              transition: 'all var(--transition-base)',
            }}
          >
            {listening ? (
              <>
                <Square size={16} color="var(--clr-alert-red)" aria-hidden="true" />
                <div style={{ display: 'flex', gap: 3, alignItems: 'center', height: 28 }}>
                  {Array.from({ length: 18 }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [8, visualizerHeights[i], 8] }}
                      transition={{ duration: visualizerDurations[i], repeat: Infinity, delay: i * 0.04, ease: 'easeInOut' }}
                      style={{ width: 3, borderRadius: 2, background: 'var(--clr-alert-red)' }}
                    />
                  ))}
                </div>
                <span style={{ color: 'var(--clr-alert-red)', fontWeight: 'var(--fw-semibold)', fontSize: 'var(--fs-sm)' }}>
                  Recording… tap to stop
                </span>
              </>
            ) : (
              <>
                <Mic size={18} color="var(--clr-text-secondary)" aria-hidden="true" />
                <span style={{ color: 'var(--clr-text-secondary)', fontWeight: 'var(--fw-medium)', fontSize: 'var(--fs-sm)' }}>
                  🎙 Record Voice Review
                </span>
              </>
            )}
          </motion.button>
        </section>

        {/* Submit */}
        <motion.button
          onClick={handleSubmit}
          disabled={submitting}
          whileTap={{ scale: 0.97 }}
          aria-busy={submitting}
          style={{
            width: '100%', padding: '16px', borderRadius: 'var(--r-xl)', border: 'none',
            background: 'linear-gradient(135deg,var(--clr-primary),var(--clr-primary-dark))',
            color: '#fff', fontWeight: 'var(--fw-bold)', fontSize: 'var(--fs-lg)',
            cursor: submitting ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 20px rgba(37,99,235,0.35)', opacity: submitting ? 0.8 : 1,
          }}
        >
          {submitting ? '⏳ Submitting…' : '✉ Submit Review'}
        </motion.button>
      </div>
    </div>
  );
}
