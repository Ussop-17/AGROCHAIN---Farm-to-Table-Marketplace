
import React, { useState } from 'react';
import { Produce, Order, OrderStatus } from '../types';
import { Plus, Package, Calendar, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { generateProduceDescription } from '../services/geminiService';

interface FarmerDashboardProps {
  produce: Produce[];
  orders: Order[];
  onAddProduce: (p: Partial<Produce>) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const FarmerDashboard: React.FC<FarmerDashboardProps> = ({ produce, orders, onAddProduce, onUpdateOrderStatus }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Vegetables',
    quantity: 100,
    pricePerKg: 1.0,
    yieldDate: '',
    expireDate: '',
    location: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const description = await generateProduceDescription(formData.name, formData.category);
    onAddProduce({
      ...formData,
      description
    });
    setLoading(false);
    setShowModal(false);
    setFormData({
      name: '',
      category: 'Vegetables',
      quantity: 100,
      pricePerKg: 1.0,
      yieldDate: '',
      expireDate: '',
      location: ''
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Farmer Dashboard</h1>
          <p className="text-slate-500">Manage your harvests and pending requests.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-brand-gradient text-white px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-brand hover:opacity-90 transition-all font-bold"
        >
          <Plus className="h-5 w-5" /> Add Produce
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Listings */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Package className="text-emerald-600" /> Your Produce
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {produce.map((p) => (
              <div key={p.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg">{p.name}</h3>
                    <span className="text-brand-green font-bold text-xl">₹{p.pricePerKg}/kg</span>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2">{p.description}</p>
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Yield: {p.yieldDate}</span>
                    <span className="flex items-center gap-1"><Package className="h-3 w-3" /> Stock: {p.quantity}kg</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Requests */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <MapPin className="text-amber-600" /> Buyer Requests
          </h2>
          <div className="space-y-4">
            {orders.filter(o => o.status === OrderStatus.PENDING_FARMER).length === 0 ? (
              <div className="p-8 text-center bg-slate-100 rounded-xl text-slate-400 italic">
                No pending requests
              </div>
            ) : (
              orders.filter(o => o.status === OrderStatus.PENDING_FARMER).map(o => (
                <div key={o.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400">Order #{o.id.slice(0, 4)}</span>
                    <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Pending</span>
                  </div>
                  <h4 className="font-bold text-slate-800">{o.quantity}kg of {o.produceName}</h4>
                  <div className="text-sm text-slate-600">
                    <p>Buyer: {o.buyerName}</p>
                    <p>Price: <span className="font-bold text-brand-green">₹{o.totalProducePrice}</span></p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={() => onUpdateOrderStatus(o.id, OrderStatus.WAITING_DELIVERY)}
                      className="flex-1 bg-brand-green/10 text-brand-green border border-brand-green/20 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-green/20 transition-all flex items-center justify-center gap-1"
                    >
                      <CheckCircle className="h-4 w-4" /> Accept
                    </button>
                    <button 
                      onClick={() => onUpdateOrderStatus(o.id, OrderStatus.REJECTED)}
                      className="flex-1 bg-red-50 text-red-600 border border-red-200 py-2 rounded-lg text-sm font-semibold hover:bg-red-100 flex items-center justify-center gap-1"
                    >
                      <XCircle className="h-4 w-4" /> Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Produce Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold">Add New Produce</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Produce Name</label>
                  <input
                    required
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g. Organic Carrots"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option>Vegetables</option>
                    <option>Fruits</option>
                    <option>Grains</option>
                    <option>Dairy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Quantity (kg)</label>
                  <input
                    required
                    type="number"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                    value={formData.quantity}
                    onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Price per kg (₹)</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                    value={formData.pricePerKg}
                    onChange={e => setFormData({ ...formData, pricePerKg: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                  <input
                    required
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="City, State"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Yield Date</label>
                  <input
                    required
                    type="date"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                    value={formData.yieldDate}
                    onChange={e => setFormData({ ...formData, yieldDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
                  <input
                    required
                    type="date"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                    value={formData.expireDate}
                    onChange={e => setFormData({ ...formData, expireDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="pt-4">
                <button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-brand-gradient text-white font-bold py-4 rounded-xl shadow-brand hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {loading ? 'AI generating description...' : 'List Produce'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;
