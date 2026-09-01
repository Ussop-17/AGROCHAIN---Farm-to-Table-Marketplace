
import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { Leaf, ShoppingBag, Truck, ArrowLeft, Lock, Phone, User as UserIcon, MapPin } from 'lucide-react';

interface SignupProps {
  role: UserRole;
  onSignup: (user: User) => void;
  onBack: () => void;
  onSwitchToLogin: () => void;
}

const Signup: React.FC<SignupProps> = ({ role, onSignup, onBack, onSwitchToLogin }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');

  const roleConfig = {
    [UserRole.FARMER]: {
      title: 'Farmer Sign Up',
      subtitle: 'Create your farm profile and start selling',
      icon: <Leaf className="h-6 w-6" />,
      color: 'emerald',
    },
    [UserRole.BUYER]: {
      title: 'Buyer Sign Up',
      subtitle: 'Join the marketplace to buy fresh produce',
      icon: <ShoppingBag className="h-6 w-6" />,
      color: 'blue',
    },
    [UserRole.DELIVERY]: {
      title: 'Logistics Sign Up',
      subtitle: 'Join as a delivery partner and start earning',
      icon: <Truck className="h-6 w-6" />,
      color: 'amber',
    }
  };

  const config = roleConfig[role];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      role,
      location,
      phone,
      password
    };
    onSignup(newUser);
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

        <div className="flex flex-col items-center gap-4 relative">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-semibold text-sm"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </button>
        </div>

        <div className="relative bg-white/80 backdrop-blur-xl p-10 rounded-[3rem] shadow-2xl border border-white/50">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-100 rounded-2xl mb-6">
              <div className="text-brand-green">
                {config.icon}
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-slate-600">{config.title}</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Get Started</h1>
            <p className="text-slate-500 mt-2 font-medium">{config.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  required
                  type="text"
                  placeholder="Enter your name"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none transition-all font-medium text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  required
                  type="tel"
                  placeholder="98765 43210"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none transition-all font-medium text-sm"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  required
                  type="text"
                  placeholder="City, State"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none transition-all font-medium text-sm"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  required
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none transition-all font-medium text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-4 mt-4 rounded-2xl bg-brand-gradient text-white font-bold text-lg shadow-brand hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Create Account
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm font-medium">
              Already have an account? <button onClick={onSwitchToLogin} className="font-bold text-brand-green hover:underline decoration-2 underline-offset-4">Log in here</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
