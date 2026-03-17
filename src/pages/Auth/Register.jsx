import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Stethoscope, Building2, Shield, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../../contexts/useAuthStore';
import { useHaptics } from '../../hooks/useHaptics';

const ROLES = [
  { id: 'patient', label: 'Patient', icon: User, color: '#3b82f6', desc: 'Find accessible care' },
  { id: 'doctor', label: 'Doctor', icon: Stethoscope, color: '#10b981', desc: 'Manage patients' },
  { id: 'hospital', label: 'Hospital', icon: Building2, color: '#8b5cf6', desc: 'Facility admin' },
  { id: 'admin', label: 'System Admin', icon: Shield, color: '#f59e0b', desc: 'Platform control' }
];

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuthStore();
  const { tap, success, error: hapticError } = useHaptics();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: '', name: '', email: '', password: '', extraField: ''
  });

  const handleRoleSelect = (roleId) => {
    tap();
    setFormData(prev => ({ ...prev, role: roleId }));
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    tap();
    if (!formData.email || !formData.password || !formData.name) {
      hapticError();
      return;
    }
    
    setLoading(true);
    try {
      const user = await registerUser(formData);
      success();
      const roleRoutes = { doctor: '/dashboard/doctor', hospital: '/dashboard/hospital', admin: '/dashboard/admin' };
      navigate(roleRoutes[user?.role] || '/');
    } catch(err) {
      hapticError();
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '8px',
    background: 'rgba(15, 23, 42, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#FFFFFF',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box'
  };

  return (
    <div style={{ padding: '16px', maxWidth: 400, margin: '40px auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
          Create Account
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>
          {step === 1 ? 'Select your account type to proceed' : `Complete your ${formData.role} registration`}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}
          >
            {ROLES.map(role => (
              <motion.button
                key={role.id}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(30, 41, 59, 0.8)' }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleRoleSelect(role.id)}
                style={{
                  background: 'rgba(15, 23, 42, 0.5)',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  color: '#FFFFFF',
                  border: `1px solid ${role.color}40`,
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ padding: '12px', borderRadius: '9999px', background: `${role.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <role.icon size={28} color={role.color} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ display: 'block', fontWeight: 700, fontSize: '16px', marginBottom: '2px' }}>
                    {role.label}
                  </span>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>{role.desc}</span>
                </div>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.form
            key="step2"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <div>
              <input type="text" placeholder="Full Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)'} onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'} />
            </div>
            <div>
              <input type="email" placeholder="Email Address" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)'} onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'} />
            </div>
            <div>
              <input type="password" placeholder="Password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)'} onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'} />
            </div>

            {/* Dynamic Role-Specific Field */}
            {formData.role === 'doctor' && (
              <input type="text" placeholder="Medical License Number" required value={formData.extraField} onChange={e => setFormData({...formData, extraField: e.target.value})} 
                style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)'} onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'} />
            )}
            {formData.role === 'hospital' && (
              <input type="text" placeholder="Facility Name" required value={formData.extraField} onChange={e => setFormData({...formData, extraField: e.target.value})} 
                style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)'} onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'} />
            )}
            {formData.role === 'admin' && (
              <input type="text" placeholder="Admin Access Code" required value={formData.extraField} onChange={e => setFormData({...formData, extraField: e.target.value})} 
                style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)'} onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'} />
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => { tap(); setStep(1); }}
                style={{
                  width: '48px', height: '48px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)', color: '#FFFFFF', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
              >
                <ArrowLeft size={20} />
              </button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                style={{
                  flex: 1, padding: '16px', color: '#FFFFFF', border: 'none', borderRadius: '12px',
                  fontWeight: 'bold', fontSize: '16px', cursor: 'pointer',
                  boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  transition: 'background-color 0.2s ease',
                  background: loading ? '#475569' : '#2563eb'
                }}
                onMouseEnter={(e) => !loading && (e.currentTarget.style.background = '#1d4ed8')}
                onMouseLeave={(e) => !loading && (e.currentTarget.style.background = '#2563eb')}
              >
                {loading ? 'Creating Account...' : <>Complete Signup <ArrowRight size={18} /></>}
              </motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
      
      {step === 1 && (
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>
            Already have an account?{' '}
            <button 
              onClick={() => { tap(); navigate('/auth/login'); }}
              style={{ background: 'transparent', border: 'none', color: '#93c5fd', fontWeight: 'bold', cursor: 'pointer', padding: '4px' }}
              onMouseEnter={(e) => e.target.style.color = '#bfdbfe'}
              onMouseLeave={(e) => e.target.style.color = '#93c5fd'}
            >
              Sign In
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
