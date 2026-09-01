
import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { Leaf, ShoppingBag, Truck, ArrowLeft, Lock, Phone } from 'lucide-react';

interface LoginProps {
  role: UserRole;
  onLogin: (user: User) => void;
  onBack: () => void;
  onSwitchToSignup: () => void;
  storedUsers: User[];
}

const Login: React.FC<LoginProps> = ({ role, onLogin, onBack, onSwitchToSignup, storedUsers }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const roleConfig = {
    [UserRole.FARMER]: {
      title: 'Farmer Login',
      subtitle: 'Access your farm dashboard and list produce',
      icon: <Leaf className="h-6 w-6" />,
      color: 'emerald',
      defaultName: 'Rajesh Kumar',
      idPrefix: 'f'
    },
    [UserRole.BUYER]: {
      title: 'Buyer Login',
      subtitle: 'Browse fresh produce and manage orders',
      icon: <ShoppingBag className="h-6 w-6" />,
      color: 'blue',
      defaultName: 'Priya Sharma',
      idPrefix: 'b'
    },
    [UserRole.DELIVERY]: {
      title: 'Logistics Login',
      subtitle: 'View available contracts and track earnings',
      icon: <Truck className="h-6 w-6" />,
      color: 'amber',
      defaultName: 'Amit Singh',
      idPrefix: 'd'
    }
  };

  const config = roleConfig[role];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // First check stored users from signup
    const user = storedUsers.find(u => u.phone === phone && u.password === password && u.role === role);
    
    if (user) {
      onLogin(user);
    } else if (phone === '9876543210' && password === 'password') {
      // Default fallback demo user
      onLogin({
        id: `${config.idPrefix}1`,
        name: config.defaultName,
        role: role,
        location: 'Regional Hub',
        phone: '9876543210',
        password: 'password'
      });
    } else {
      setError('Invalid phone number or password for this role.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 bg-[grid:rgba(0,0,0,0.01)_20px_20px] relative overflow-hidden">
      {/* Top Left Logo */}
      <div className="absolute top-8 left-8 flex items-center gap-2 cursor-pointer z-10" onClick={onBack}>
        <div className="p-2 bg-brand-gradient rounded-xl shadow-lg">
          <Leaf className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold text-slate-900 tracking-tight">AgroChain</span>
      </div>

      <div className="w-full max-w-md space-y-8 relative">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-brand-green/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-brand-emerald/10 rounded-full blur-3xl"></div>

        <div className="flex flex-col items-center gap-4 relative">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-semibold text-sm"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </button>
        </div>

        <div className="relative bg-white/80 backdrop-blur-xl p-10 rounded-[3rem] shadow-2xl border border-white/50">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-100 rounded-2xl mb-6">
              <div className="text-brand-green">
                {config.icon}
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-slate-600">{config.title}</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
            <p className="text-slate-500 mt-2 font-medium">{config.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100 italic">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  required
                  type="tel"
                  placeholder="98765 43210"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none transition-all font-medium"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  required
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none transition-all font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-200 text-brand-green focus:ring-brand-green cursor-pointer transition-all" />
                <span className="text-sm text-slate-500 group-hover:text-slate-800 font-medium transition-colors">Stay signed in</span>
              </label>
              <button type="button" className="text-sm font-bold text-brand-green hover:opacity-80 transition-opacity">Forgot password?</button>
            </div>

            <button 
              type="submit"
              className="w-full py-5 rounded-2xl bg-brand-gradient text-white font-bold text-lg shadow-brand hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Sign In
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-500 text-sm font-medium">
              Don't have an account? <button onClick={onSwitchToSignup} className="font-bold text-brand-green hover:underline decoration-2 underline-offset-4 tracking-tight">Create {role.toLowerCase()} account</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
