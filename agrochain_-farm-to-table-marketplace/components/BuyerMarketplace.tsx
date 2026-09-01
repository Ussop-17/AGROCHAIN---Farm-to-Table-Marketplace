
import React, { useState } from 'react';
import { Produce, Order, OrderStatus } from '../types';
import { Search, ShoppingCart, Info, CheckCircle2, Navigation } from 'lucide-react';
import { suggestDeliveryPricing } from '../services/geminiService';

interface BuyerMarketplaceProps {
  produce: Produce[];
  orders: Order[];
  onPlaceOrder: (o: Partial<Order>) => void;
  buyerName: string;
  buyerId: string;
}

const BuyerMarketplace: React.FC<BuyerMarketplaceProps> = ({ produce, orders, onPlaceOrder, buyerName, buyerId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduce, setSelectedProduce] = useState<Produce | null>(null);
  const [purchaseQty, setPurchaseQty] = useState(1);

  const filteredProduce = produce.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOrder = async () => {
    if (!selectedProduce) return;
    
    // Simulate distance/cost
    const distance = Math.floor(Math.random() * 100) + 10;
    const transportCost = await suggestDeliveryPricing(distance, purchaseQty);
    
    onPlaceOrder({
      produceId: selectedProduce.id,
      produceName: selectedProduce.name,
      buyerId: buyerId,
      buyerName: buyerName,
      farmerId: selectedProduce.farmerId,
      quantity: purchaseQty,
      totalProducePrice: selectedProduce.pricePerKg * purchaseQty,
      transportationCost: transportCost,
      distance: distance,
      pickupLocation: selectedProduce.location,
      deliveryLocation: 'Current User Location',
      status: OrderStatus.PENDING_FARMER
    });
    
    setSelectedProduce(null);
    setPurchaseQty(1);
    alert('Order request sent to farmer!');
  };

  return (
    <div className="space-y-8">
      <div className="relative">
        <h1 className="text-3xl font-bold text-slate-900">Fresh Marketplace</h1>
        <p className="text-slate-500">Discover quality produce directly from local farms.</p>
        
        <div className="mt-6 flex gap-4 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input 
              type="text" 
              placeholder="Search vegetables, fruits, grains..." 
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-brand-green/20 focus:border-brand-green shadow-sm"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProduce.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col">
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{p.name}</h3>
                  <p className="text-brand-green text-sm font-bold">{p.farmerName}</p>
                </div>
                <div className="bg-brand-gradient text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  ₹{p.pricePerKg}/kg
                </div>
              </div>
              <p className="text-slate-600 text-sm mb-4 line-clamp-2">{p.description}</p>
              
              <div className="mt-auto space-y-4">
                <div className="flex items-center gap-4 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
                  <span className="flex items-center gap-1"><Navigation className="h-3 w-3" /> {p.location}</span>
                  <span className="flex items-center gap-1"><Info className="h-3 w-3" /> Exp: {p.expireDate}</span>
                </div>
                
                <button 
                  onClick={() => setSelectedProduce(p)}
                  className="w-full bg-brand-gradient text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-brand hover:opacity-90 transition-all font-bold"
                >
                  <ShoppingCart className="h-5 w-5" /> Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Purchase Modal */}
      {selectedProduce && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold">Purchase Request</h3>
              <button onClick={() => setSelectedProduce(null)} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex gap-4">
                <div>
                  <h4 className="font-bold text-lg">{selectedProduce.name}</h4>
                  <p className="text-slate-500 text-sm">Farmer: {selectedProduce.farmerName}</p>
                  <p className="text-emerald-600 font-bold">₹{selectedProduce.pricePerKg}/kg</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Quantity to Buy (kg)</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" 
                    min="1" 
                    max={selectedProduce.quantity} 
                    value={purchaseQty}
                    onChange={e => setPurchaseQty(Number(e.target.value))}
                    className="flex-1 accent-emerald-600"
                  />
                  <span className="font-bold text-lg w-16 text-center">{purchaseQty}kg</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Available: {selectedProduce.quantity}kg</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Stock Total:</span>
                  <span className="font-bold">₹{(selectedProduce.pricePerKg * purchaseQty).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Estimated Transport:</span>
                  <span>Calculated on Acceptance</span>
                </div>
                <div className="border-t border-slate-200 pt-3 flex justify-between font-black text-xl text-brand-green">
                  <span>Subtotal:</span>
                  <span>₹{(selectedProduce.pricePerKg * purchaseQty).toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={handleOrder}
                className="w-full bg-brand-gradient text-white font-bold py-4 rounded-xl shadow-brand hover:scale-[1.02] active:scale-[0.98] transition-all text-lg"
              >
                Send Request to Farmer
              </button>
              <p className="text-center text-xs text-slate-400">Farmer must accept the request before delivery begins.</p>
            </div>
          </div>
        </div>
      )}

      {/* Track Orders Section */}
      <div className="mt-12 space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <CheckCircle2 className="text-emerald-600" /> Your Orders
        </h2>
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Produce</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Total Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.filter(o => o.buyerId === buyerId).map(o => (
                <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800">{o.produceName}</td>
                  <td className="px-6 py-4 font-medium">{o.quantity}kg</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      o.status === OrderStatus.PENDING_FARMER ? 'bg-amber-100 text-amber-700' :
                      o.status === OrderStatus.WAITING_DELIVERY ? 'bg-blue-100 text-blue-700' :
                      o.status === OrderStatus.IN_TRANSIT ? 'bg-purple-100 text-purple-700' :
                      'bg-brand-green/10 text-brand-green'
                    }`}>
                      {o.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-black text-brand-green">₹{o.totalProducePrice + o.transportationCost}</td>
                </tr>
              ))}
              {orders.filter(o => o.buyerId === buyerId).length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-400 italic">No orders yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BuyerMarketplace;
