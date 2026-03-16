import { useAuthStore } from '../../contexts/useAuthStore';
import { Building2, Users, AlertTriangle, Settings, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function HospitalDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-[100dvh] bg-slate-50 pb-24">
      {/* Header */}
      <header className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 text-white pb-12 rounded-b-[2.5rem] shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-indigo-200 text-sm font-medium">Facility Administrator</p>
            <h1 className="text-2xl font-extrabold">{user?.name}</h1>
          </div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md"
          >
            <Building2 className="text-white" />
          </motion.div>
        </div>
        <p className="opacity-90 leading-tight">Manage accessibility reports, respond to patients, and update routing closures.</p>
      </header>

      {/* Quick Stats Grid */}
      <div className="px-5 -mt-6">
        <div className="grid grid-cols-2 gap-4">
          <StatCard icon={Users} color="text-blue-600" bg="bg-blue-100" label="Checked In" val="142" />
          <StatCard icon={Activity} color="text-emerald-600" bg="bg-emerald-100" label="A11y Score" val="9.2" />
          <StatCard icon={AlertTriangle} color="text-amber-600" bg="bg-amber-100" label="Active Alerts" val="2" />
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between" onClick={() => navigate('/profile')}>
            <Settings className="text-slate-400 mb-2" />
            <div>
              <p className="font-bold text-slate-800">Settings</p>
              <button 
                onClick={(e) => { e.stopPropagation(); logout(); navigate('/auth/login'); }}
                className="text-xs text-red-500 font-semibold mt-1"
              >Sign Out</button>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="p-5 mt-4">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Facility Status & Pings</h2>
        
        <div className="space-y-3">
          <motion.div whileTap={{ scale: 0.98 }} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-amber-500 flex gap-4 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
               <AlertTriangle className="text-amber-500" size={20} />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm">Wheelchair Ramp Temporarily Closed</p>
              <p className="text-xs text-slate-500 mt-1">Global routing alert active. Tap to resolve or update the OSRM node closure path.</p>
            </div>
          </motion.div>

          <motion.div whileTap={{ scale: 0.98 }} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-indigo-500 flex gap-4 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
               <Users className="text-indigo-500" size={20} />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm">Patient Arrival Ping</p>
              <p className="text-xs text-slate-500 mt-1">A patient with Severe Visual Impairment is routing to this hospital. ETA: 14 mins. Ensure braille signage is clear.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, color, bg, label, val }) {
  return (
    <motion.div whileHover={{ y: -2 }} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
      <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mb-3`}>
        <Icon className={color} size={16} />
      </div>
      <p className="text-2xl font-black text-slate-800">{val}</p>
      <p className="text-xs font-semibold text-slate-500">{label}</p>
    </motion.div>
  );
}
