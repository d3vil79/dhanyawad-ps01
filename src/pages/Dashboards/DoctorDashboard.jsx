import { useAuthStore } from '../../contexts/useAuthStore';
import { User, Activity, Clock, FileText, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function DoctorDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-[100dvh] bg-slate-50 pb-24">
      {/* Header */}
      <header className="bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white pb-12 rounded-b-[2.5rem] shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-emerald-200 text-sm font-medium">Physician Portal</p>
            <h1 className="text-2xl font-extrabold">{user?.name}</h1>
          </div>
          <motion.div 
            whileTap={{ scale: 0.9 }}
            onClick={() => { logout(); navigate('/auth/login'); }}
            className="px-4 py-2 bg-white/10 rounded-full font-bold text-sm cursor-pointer hover:bg-white/20"
          >
            Sign Out
          </motion.div>
        </div>
        <p className="opacity-90 leading-tight">Your daily patient queue and accessibility accommodations are ready.</p>
      </header>

      {/* Stats/Actions */}
      <div className="px-5 -mt-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
             <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2"><User size={24}/></div>
             <p className="text-3xl font-black text-slate-800">12</p>
             <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-1">Today's Queue</p>
          </div>
          <div className="space-y-4">
            <ActionBtn icon={FileText} label="Approve Scripts" color="text-indigo-600" bg="bg-indigo-50" />
            <ActionBtn icon={Activity} label="Vitals Sync" color="text-rose-600" bg="bg-rose-50" />
          </div>
        </div>
      </div>

      {/* Patient Queue */}
      <div className="p-5 mt-4">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Upcoming Appointments</h2>
        
        <div className="space-y-3">
          <QueueItem time="09:00 AM" name="Sarah Jenkins" a11y="Requires ASL Interpreter" status="Checked In" />
          <QueueItem time="10:15 AM" name="Marcus Tullius" a11y="Severe Cognitive Overload Risk" status="En Route (8 mins)" />
          <QueueItem time="11:30 AM" name="Elena V." a11y="Standard Vision Needs" status="Scheduled" />
        </div>
      </div>
    </div>
  );
}

function ActionBtn({ icon: Icon, label, color, bg }) {
  return (
    <motion.button whileHover={{ scale: 1.02 }} className={`${bg} border border-slate-100 p-4 rounded-xl flex items-center gap-3 w-full shadow-sm`}>
      <Icon className={color} size={18} />
      <span className="font-bold text-slate-700 text-sm">{label}</span>
    </motion.button>
  );
}

function QueueItem({ time, name, a11y, status }) {
  return (
    <motion.div whileTap={{ scale: 0.98 }} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 cursor-pointer">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
           <Clock size={14} className="text-emerald-600" />
           <p className="font-bold text-slate-800 text-sm">{time}</p>
        </div>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${status.includes('Checked In') ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
          {status}
        </span>
      </div>
      <p className="text-lg font-bold text-slate-800">{name}</p>
      <div className="flex items-center gap-1.5 mt-2 text-rose-600 bg-rose-50 px-2 py-1.5 rounded-md w-fit">
        <CheckCircle size={12} />
        <p className="text-xs font-semibold">{a11y}</p>
      </div>
    </motion.div>
  );
}
