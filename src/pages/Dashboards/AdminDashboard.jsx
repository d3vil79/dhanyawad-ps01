import { useAuthStore } from '../../contexts/useAuthStore';
import { Shield, Server, Database, Activity, Map, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-[100dvh] bg-slate-900 pb-24 text-slate-100">
      {/* Header */}
      <header className="bg-slate-800 p-6 pb-10 shadow-lg border-b border-white/5">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-amber-500 text-xs font-bold tracking-widest uppercase mb-1 flex items-center gap-2"><Shield size={12}/> System Admin</p>
            <h1 className="text-2xl font-extrabold text-white">{user?.name}</h1>
          </div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center border border-amber-500/30"
          >
            <Server className="text-amber-500" />
          </motion.div>
        </div>
        <p className="opacity-80 text-sm leading-tight text-slate-400">Platform operational metrics and global data overrides.</p>
      </header>

      {/* Grid */}
      <div className="px-5 mt-6 grid grid-cols-2 gap-4">
        <Metric icon={Database} title="OSRM Nodes" val="842k" trend="+1.2%" />
        <Metric icon={Activity} title="API Latency" val="45ms" trend="-5ms" />
        <Metric icon={UsersIcon} title="Active Users" val="1.4m" trend="+12k" />
        <Metric icon={Map} title="Map Sync" val="Live" trend="0ms delay" />
      </div>

      {/* Tools */}
      <div className="p-5 mt-6">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Admin Tools</h2>
        
        <div className="space-y-3">
          <ToolCard title="Force Routing Cache Clear" desc="Rebuilds the local OSRM navigation grid cache for all users." />
          <ToolCard title="Review Audit Logs" desc="Investigate hospital accessibility score manipulation." />
          <ToolCard title="Update Nominatim Sync" desc="Manually trigger an OpenStreetMap POI re-index." />
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => { logout(); navigate('/auth/login'); }}
          className="w-full mt-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 font-bold rounded-xl flex items-center justify-center gap-2"
        >
          Terminate Session Context
        </motion.button>
      </div>
    </div>
  );
}

function Metric({ icon: Icon, title, val, trend }) {
  return (
    <div className="bg-slate-800 border border-white/5 p-4 rounded-2xl flex flex-col items-start">
      <Icon className="text-slate-500 mb-3" size={20} />
      <p className="text-2xl font-black text-white">{val}</p>
      <div className="flex justify-between w-full items-end mt-1">
        <p className="text-xs font-bold text-slate-500">{title}</p>
        <p className="text-[10px] font-mono text-emerald-400">{trend}</p>
      </div>
    </div>
  );
}

function ToolCard({ title, desc }) {
  return (
    <motion.button whileHover={{ x: 4 }} className="w-full text-left bg-slate-800 border border-white/5 p-4 rounded-xl flex items-center justify-between group">
      <div>
        <h3 className="text-sm font-bold text-slate-200">{title}</h3>
        <p className="text-xs text-slate-500 mt-1 font-medium">{desc}</p>
      </div>
      <ArrowRight size={16} className="text-slate-600 group-hover:text-amber-500 transition-colors" />
    </motion.button>
  );
}

// Fixed missing Users icon reference
function UsersIcon(props) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
}
