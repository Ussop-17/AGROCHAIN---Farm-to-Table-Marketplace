
import React, { useState, useEffect } from 'react';
import { UserRole, User, Produce, Order, OrderStatus } from './types';
import { MOCK_PRODUCE, MOCK_ORDERS } from './constants';
import Layout from './components/Layout';
import FarmerDashboard from './components/FarmerDashboard';
import BuyerMarketplace from './components/BuyerMarketplace';
import DeliveryPortal from './components/DeliveryPortal';
import Login from './components/Login';
import Signup from './components/Signup';
import { Leaf, UserCircle, Truck, ShoppingBag, X } from 'lucide-react';

const InfoPopup: React.FC<{ title: string; content: string; onClose: () => void }> = ({ title, content, onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
    <div className="bg-white rounded-[2rem] shadow-2xl p-8 max-w-md w-full relative border border-slate-100 animate-in fade-in zoom-in duration-200">
      <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors">
        <X className="h-6 w-6" />
      </button>
      <div className="space-y-4">
        <div className="p-3 bg-brand-green/10 rounded-2xl w-fit">
          <Leaf className="h-6 w-6 text-brand-green" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h3>
        <p className="text-slate-600 leading-relaxed font-medium">{content}</p>
        <button 
          onClick={onClose}
          className="w-full py-4 bg-brand-gradient text-white font-bold rounded-2xl shadow-brand hover:opacity-90 transition-all mt-4"
        >
          Got it!
        </button>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | null>(null);
  const [storedUsers, setStoredUsers] = useState<User[]>([]);
  const [infoPopup, setInfoPopup] = useState<{ title: string; content: string } | null>(null);
  
  const [produce, setProduce] = useState<Produce[]>(MOCK_PRODUCE);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

  // Persistence (Simulation)
  useEffect(() => {
    const savedProduce = localStorage.getItem('agro_produce');
    const savedOrders = localStorage.getItem('agro_orders');
    const savedUsers = localStorage.getItem('agro_users');
    
    if (savedProduce) setProduce(JSON.parse(savedProduce));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    if (savedUsers) setStoredUsers(JSON.parse(savedUsers));
  }, []);

  useEffect(() => {
    localStorage.setItem('agro_produce', JSON.stringify(produce));
    localStorage.setItem('agro_orders', JSON.stringify(orders));
    localStorage.setItem('agro_users', JSON.stringify(storedUsers));
  }, [produce, orders, storedUsers]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setSelectedRole(null);
    setAuthMode(null);
  };

  const handleSignup = (user: User) => {
    setStoredUsers(prev => [...prev, user]);
    setAuthMode('login');
    alert('Signup successful! Please log in with your new account.');
  };

  const showInfo = (type: 'features' | 'marketplace' | 'about') => {
    const content = {
      features: {
        title: "Platform Features",
        content: "Our platform offers real-time inventory tracking, secure payment gateways, AI-driven price suggestions, and direct farm-to-consumer logistics integration."
      },
      marketplace: {
        title: "Agro Marketplace",
        content: "Discover fresh, locally-sourced produce directly from verified farmers. Our marketplace ensures transparency in pricing and quality for every purchase."
      },
      about: {
        title: "About AgroChain",
        content: "AgroChain is a decentralized ecosystem built to empower small-scale farmers and provide consumers with healthy, transparently-sourced food options."
      }
    }[type];
    setInfoPopup(content);
  };

  const addProduce = (newProduce: Partial<Produce>) => {
    if (!currentUser) return;
    const p: Produce = {
      id: `p-${Date.now()}`,
      farmerId: currentUser.id,
      farmerName: currentUser.name,
      name: newProduce.name || '',
      category: newProduce.category || 'Vegetables',
      quantity: newProduce.quantity || 0,
      pricePerKg: newProduce.pricePerKg || 0,
      yieldDate: newProduce.yieldDate || '',
      expireDate: newProduce.expireDate || '',
      location: newProduce.location || '',
      description: newProduce.description
    };
    setProduce(prev => [p, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { 
      ...o, 
      status, 
      deliveryId: status === OrderStatus.IN_TRANSIT ? currentUser?.id : o.deliveryId 
    } : o));
  };

  const placeOrder = (o: Partial<Order>) => {
    const newOrder: Order = {
      id: `o-${Date.now()}`,
      produceId: o.produceId!,
      produceName: o.produceName!,
      buyerId: o.buyerId!,
      buyerName: o.buyerName!,
      farmerId: o.farmerId!,
      quantity: o.quantity!,
      totalProducePrice: o.totalProducePrice!,
      transportationCost: o.transportationCost!,
      distance: o.distance!,
      pickupLocation: o.pickupLocation!,
      deliveryLocation: o.deliveryLocation!,
      status: o.status!,
      createdAt: new Date().toISOString()
    };
    setOrders(prev => [newOrder, ...prev]);
    
    // Deduct quantity from produce
    setProduce(prev => prev.map(p => p.id === o.produceId ? { ...p, quantity: p.quantity - o.quantity! } : p));
  };

  if (!currentUser && authMode === 'login' && selectedRole) {
    return (
      <Login 
        role={selectedRole} 
        onLogin={handleLogin} 
        onBack={() => { setAuthMode(null); setSelectedRole(null); }} 
        onSwitchToSignup={() => setAuthMode('signup')}
        storedUsers={storedUsers}
      />
    );
  }

  if (!currentUser && authMode === 'signup' && selectedRole) {
    return (
      <Signup 
        role={selectedRole} 
        onSignup={handleSignup} 
        onBack={() => { setAuthMode(null); setSelectedRole(null); }} 
        onSwitchToLogin={() => setAuthMode('login')}
      />
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-white">
        {infoPopup && <InfoPopup {...infoPopup} onClose={() => setInfoPopup(null)} />}
        
        {/* Navigation */}
        <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
            <div className="p-2 bg-brand-gradient rounded-xl shadow-lg">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">AgroChain</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
            <button onClick={() => showInfo('features')} className="hover:text-brand-green transition-colors uppercase tracking-widest text-[10px]">Features</button>
            <button onClick={() => showInfo('marketplace')} className="hover:text-brand-green transition-colors uppercase tracking-widest text-[10px]">Marketplace</button>
            <button onClick={() => showInfo('about')} className="hover:text-brand-green transition-colors uppercase tracking-widest text-[10px]">About Us</button>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-4 mr-2 border-r border-slate-100 pr-6">
              <button onClick={() => { setSelectedRole(UserRole.FARMER); setAuthMode('login'); }} className="text-[10px] font-black uppercase tracking-tighter text-slate-400 hover:text-brand-green transition-colors">Farmer Portals</button>
              <button onClick={() => { setSelectedRole(UserRole.DELIVERY); setAuthMode('login'); }} className="text-[10px] font-black uppercase tracking-tighter text-slate-400 hover:text-brand-green transition-colors">Logistics Portals</button>
            </div>
            <button 
              onClick={() => { setSelectedRole(UserRole.BUYER); setAuthMode('login'); }}
              className="text-sm font-bold text-slate-500 hover:text-brand-green"
            >
              Log In
            </button>
            <button 
              onClick={() => { setSelectedRole(UserRole.BUYER); setAuthMode('signup'); }}
              className="bg-brand-gradient text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-brand hover:opacity-90 transition-all font-bold"
            >
              Sign Up
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-8 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-green/10 text-brand-green text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                <span className="flex h-2 w-2 rounded-full bg-brand-green animate-pulse"></span>
                Fresh Harvest Available
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
                Empowering India's <span className="text-brand-gradient">Agriculture</span> Digitally
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed max-w-xl font-medium">
                Connect directly with verified local farmers. High-quality harvests, 
                transparent pricing, and secure logistics delivered to your doorstep.
              </p>
            </div>

            <div className="flex flex-col sm:row gap-4">
              <button 
                onClick={() => { setSelectedRole(UserRole.BUYER); setAuthMode('signup'); }}
                className="bg-brand-gradient text-white px-10 py-5 rounded-2xl text-lg font-bold shadow-brand hover:scale-[1.03] active:scale-100 transition-all flex items-center justify-center gap-2 group"
              >
                Join Marketplace <span className="text-xl group-hover:translate-x-1 transition-transform">›</span>
              </button>
            </div>

            <div className="pt-8 border-t border-slate-100 italic">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mb-6">Explore Portals</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button 
                  onClick={() => { setSelectedRole(UserRole.FARMER); setAuthMode('login'); }}
                  className="flex flex-col items-center gap-3 p-6 rounded-3xl border-2 border-slate-50 hover:border-brand-green hover:bg-slate-50 transition-all group"
                >
                  <div className="p-3 bg-emerald-50 rounded-2xl group-hover:bg-brand-green group-hover:text-white transition-all shadow-sm">
                    <UserCircle className="h-6 w-6" />
                  </div>
                  <span className="font-bold text-slate-800 text-sm">Farmers</span>
                </button>
                <button 
                  onClick={() => { setSelectedRole(UserRole.BUYER); setAuthMode('login'); }}
                  className="flex flex-col items-center gap-3 p-6 rounded-3xl border-2 border-slate-50 hover:border-brand-green hover:bg-slate-50 transition-all group"
                >
                  <div className="p-3 bg-green-50 rounded-2xl group-hover:bg-brand-green group-hover:text-white transition-all shadow-sm">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <span className="font-bold text-slate-800 text-sm">Buyers</span>
                </button>
                <button 
                  onClick={() => { setSelectedRole(UserRole.DELIVERY); setAuthMode('login'); }}
                  className="flex flex-col items-center gap-3 p-6 rounded-3xl border-2 border-slate-50 hover:border-brand-green hover:bg-slate-50 transition-all group"
                >
                  <div className="p-3 bg-emerald-50 rounded-2xl group-hover:bg-brand-green group-hover:text-white transition-all shadow-sm">
                    <Truck className="h-6 w-6" />
                  </div>
                  <span className="font-bold text-slate-800 text-sm">Logistics</span>
                </button>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-brand-green opacity-20 blur-3xl rounded-[4rem]"></div>
            <div className="relative rounded-[4rem] overflow-hidden shadow-2xl border-[12px] border-white ring-1 ring-slate-100">
              <img 
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200" 
                alt="Fresh Farm Produce" 
                className="w-full h-[600px] object-cover hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-10 left-10 p-8 bg-white/95 backdrop-blur-md rounded-[2.5rem] shadow-2xl max-w-sm border border-white">
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(i => <Leaf key={i} className="h-4 w-4 text-brand-green fill-brand-green" />)}
                </div>
                <p className="font-bold text-slate-900 leading-relaxed text-lg">"AgroChain changed my life. I get 20% more value for my crops now."</p>
                <div className="mt-4 flex items-center gap-4">
                  <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
                  <div>
                    <p className="text-sm font-black text-slate-900">— Satish Mandloi</p>
                    <p className="text-[10px] text-brand-green font-black uppercase tracking-widest">Verified Farmer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <Layout 
      role={currentUser.role} 
      userName={currentUser.name} 
      onLogout={() => setCurrentUser(null)}
    >
      {currentUser.role === UserRole.FARMER && (
        <FarmerDashboard 
          produce={produce.filter(p => p.farmerId === currentUser.id)}
          orders={orders.filter(o => o.farmerId === currentUser.id)}
          onAddProduce={addProduce}
          onUpdateOrderStatus={updateOrderStatus}
        />
      )}

      {currentUser.role === UserRole.BUYER && (
        <BuyerMarketplace 
          produce={produce.filter(p => p.quantity > 0)}
          orders={orders}
          onPlaceOrder={placeOrder}
          buyerName={currentUser.name}
          buyerId={currentUser.id}
        />
      )}

      {currentUser.role === UserRole.DELIVERY && (
        <DeliveryPortal 
          orders={orders}
          onAcceptDelivery={(id) => updateOrderStatus(id, OrderStatus.IN_TRANSIT)}
          onCompleteDelivery={(id) => updateOrderStatus(id, OrderStatus.DELIVERED)}
          deliveryId={currentUser.id}
        />
      )}
    </Layout>
  );
};

export default App;
