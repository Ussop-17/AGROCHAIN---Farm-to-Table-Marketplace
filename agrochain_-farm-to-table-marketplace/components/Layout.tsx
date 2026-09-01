
import React from 'react';
import { UserRole } from '../types';
import { LogOut, Leaf, ShoppingBag, Truck, UserCircle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  role: UserRole;
  userName: string;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, role, userName, onLogout }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-brand-gradient rounded-lg shadow-md">
                <Leaf className="text-white h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                AgroChain
              </span>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-2 text-slate-600">
                <UserCircle className="h-5 w-5" />
                <span className="font-medium">{userName}</span>
                <span className="px-2 py-0.5 bg-slate-100 text-xs rounded-full border border-slate-200 uppercase tracking-wider font-semibold">
                  {role}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden sm:inline font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          &copy; 2024 AgroChain Marketplace. Connecting Farmers & Families.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
