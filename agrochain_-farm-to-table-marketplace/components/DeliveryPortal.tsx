
import React from 'react';
import { Order, OrderStatus } from '../types';
import { Truck, MapPin, Package, DollarSign, ArrowRight, CheckCircle } from 'lucide-react';

interface DeliveryPortalProps {
  orders: Order[];
  onAcceptDelivery: (orderId: string) => void;
  onCompleteDelivery: (orderId: string) => void;
  deliveryId: string;
}

const DeliveryPortal: React.FC<DeliveryPortalProps> = ({ orders, onAcceptDelivery, onCompleteDelivery, deliveryId }) => {
  const availableContracts = orders.filter(o => o.status === OrderStatus.WAITING_DELIVERY);
  const myActiveDeliveries = orders.filter(o => o.status === OrderStatus.IN_TRANSIT && o.deliveryId === deliveryId);

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Logistics Portal</h1>
        <p className="text-slate-500">Manage transportation contracts and track active shipments.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Available Contracts */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Truck className="text-brand-green" /> Open Contracts
            </h2>
            <span className="bg-brand-green/10 text-brand-green px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              {availableContracts.length} AVAILABLE
            </span>
          </div>

          <div className="space-y-4">
            {availableContracts.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-400">
                <Truck className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No new delivery contracts available at the moment.</p>
              </div>
            ) : (
              availableContracts.map(o => (
                <div key={o.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-slate-800">{o.produceName}</h3>
                      <p className="text-slate-500 text-sm">Weight: <span className="font-bold text-slate-700">{o.quantity}kg</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-brand-green">₹{o.transportationCost}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Delivery Earnings</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-y border-slate-50">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-1 bg-amber-50 rounded-md">
                        <MapPin className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Pickup</p>
                        <p className="text-sm font-semibold">{o.pickupLocation}</p>
                        <p className="text-xs text-slate-500">From: {o.farmerName}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-1 bg-blue-50 rounded-md">
                        <MapPin className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Destination</p>
                        <p className="text-sm font-semibold">{o.deliveryLocation}</p>
                        <p className="text-xs text-slate-500">To: {o.buyerName}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <div className="text-sm text-slate-500 flex items-center gap-2">
                      <ArrowRight className="h-4 w-4" /> {o.distance}km total distance
                    </div>
                    <button 
                      onClick={() => onAcceptDelivery(o.id)}
                      className="bg-brand-gradient text-white font-bold px-6 py-2.5 rounded-xl shadow-brand hover:opacity-90 transition-all"
                    >
                      Accept Contract
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* My Active Shipments */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Package className="text-blue-600" /> In Transit
          </h2>
          
          <div className="space-y-4">
            {myActiveDeliveries.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center text-slate-400">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>You have no active deliveries.</p>
              </div>
            ) : (
              myActiveDeliveries.map(o => (
                <div key={o.id} className="bg-brand-green/5 border border-brand-green/10 rounded-2xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-slate-800">{o.produceName} ({o.quantity}kg)</h4>
                    <span className="flex items-center gap-1 text-xs font-bold text-brand-green">
                      <span className="h-2 w-2 bg-brand-green rounded-full animate-pulse" />
                      MOVING
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="h-1.5 flex-1 bg-brand-green/20 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-green w-3/4 rounded-full" />
                      </div>
                      <span className="font-bold text-brand-green">75%</span>
                    </div>
                    <p className="text-xs text-brand-green font-bold">Estimated time remaining: 25 mins</p>
                  </div>

                  <button 
                    onClick={() => onCompleteDelivery(o.id)}
                    className="w-full bg-white text-brand-green border border-brand-green/20 font-bold py-3.5 rounded-xl hover:bg-brand-green/5 transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="h-5 w-5" /> Mark as Delivered
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPortal;
