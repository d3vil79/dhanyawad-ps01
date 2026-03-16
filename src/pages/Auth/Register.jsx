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
  const { register } = useAuthStore();
  const { tap, success, error } = useHaptics();
  
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
      error();
      return;
    }
    
    setLoading(true);
    try {
      await register(formData);
      success();
      navigate('/');
    } catch(err) {
      error();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-extrabold mb-2 text-white">
          Create Account
        </h1>
        <p className="text-slate-400 text-sm">
          {step === 1 ? 'Select your account type to proceed' : `Complete your ${formData.role} registration`}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-2 gap-3"
          >
            {ROLES.map(role => (
              <motion.button
                key={role.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleRoleSelect(role.id)}
                className="bg-slate-900/50 rounded-xl p-5 flex flex-col items-center gap-3 cursor-pointer text-white transition-colors hover:bg-slate-800/80"
                style={{ border: `1px solid ${role.color}40` }}
              >
                <div className="p-3 rounded-full" style={{ background: `${role.color}20` }}>
                  <role.icon size={28} color={role.color} />
                </div>
                <div className="text-center">
                  <span className="block font-bold text-base mb-0.5">
                    {role.label}
                  </span>
                  <span className="text-[11px] text-slate-400">{role.desc}</span>
                </div>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.form
            key="step2"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            className="flex flex-col gap-4"
          >
            <div>
              <input type="text" placeholder="Full Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3.5 rounded-lg bg-slate-900/60 border border-white/10 text-white text-base outline-none transition-colors duration-200 focus:border-blue-500/50" />
            </div>
            <div>
              <input type="email" placeholder="Email Address" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3.5 rounded-lg bg-slate-900/60 border border-white/10 text-white text-base outline-none transition-colors duration-200 focus:border-blue-500/50" />
            </div>
            <div>
              <input type="password" placeholder="Password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3.5 rounded-lg bg-slate-900/60 border border-white/10 text-white text-base outline-none transition-colors duration-200 focus:border-blue-500/50" />
            </div>

            {/* Dynamic Role-Specific Field */}
            {formData.role === 'doctor' && (
              <input type="text" placeholder="Medical License Number" required value={formData.extraField} onChange={e => setFormData({...formData, extraField: e.target.value})} className="w-full px-4 py-3.5 rounded-lg bg-slate-900/60 border border-white/10 text-white text-base outline-none transition-colors duration-200 focus:border-blue-500/50" />
            )}
            {formData.role === 'hospital' && (
              <input type="text" placeholder="Facility Name" required value={formData.extraField} onChange={e => setFormData({...formData, extraField: e.target.value})} className="w-full px-4 py-3.5 rounded-lg bg-slate-900/60 border border-white/10 text-white text-base outline-none transition-colors duration-200 focus:border-blue-500/50" />
            )}
            {formData.role === 'admin' && (
              <input type="text" placeholder="Admin Access Code" required value={formData.extraField} onChange={e => setFormData({...formData, extraField: e.target.value})} className="w-full px-4 py-3.5 rounded-lg bg-slate-900/60 border border-white/10 text-white text-base outline-none transition-colors duration-200 focus:border-blue-500/50" />
            )}

            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={() => { tap(); setStep(1); }}
                className="w-12 rounded-lg border border-white/10 bg-white/5 text-white cursor-pointer flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className={`flex-1 p-4 text-white border-none rounded-xl font-bold text-base cursor-pointer shadow-[0_8px_16px_-4px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2.5 transition-colors ${loading ? 'bg-slate-600' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {loading ? 'Creating Account...' : <>Complete Signup <ArrowRight size={18} /></>}
              </motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
      
      {step === 1 && (
        <div className="text-center mt-6">
          <p className="text-slate-400 text-sm">
            Already have an account?{' '}
            <button 
              onClick={() => { tap(); navigate('/auth/login'); }}
              className="bg-transparent border-none text-blue-300 font-bold cursor-pointer p-1 hover:text-blue-200"
            >
              Sign In
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
