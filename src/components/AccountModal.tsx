import React, { useState } from 'react';
import { X, User, Package, Lock, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [email, setEmail] = useState('victoria.siege@sparklezsiege.com');
  const [password, setPassword] = useState('••••••••••••');
  const [tab, setTab] = useState<'profile' | 'orders'>('profile');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10 p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-900 p-2 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isLoggedIn ? (
          <div>
            <div className="text-center mb-6">
              <span className="font-serif-luxury text-2xl font-bold text-neutral-900">
                Welcome to SparklezSiege
              </span>
              <p className="text-xs text-neutral-500 mt-1">
                Sign in to manage your orders & saved wishlist items.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsLoggedIn(true);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-hidden focus:border-[#FF9F61]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-hidden focus:border-[#FF9F61]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-neutral-900 hover:bg-[#FF9F61] text-white hover:text-neutral-950 font-semibold text-sm py-3 rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Sign In
              </button>
            </form>
          </div>
        ) : (
          <div>
            <div className="flex items-center space-x-3 pb-4 border-b border-neutral-100">
              <div className="w-12 h-12 rounded-full bg-[#FF9F61]/15 text-[#FF9F61] flex items-center justify-center font-bold text-lg">
                VS
              </div>
              <div>
                <h3 className="font-serif-luxury text-lg font-bold text-neutral-900">
                  Victoria Siege
                </h3>
                <p className="text-xs text-neutral-500">VIP Member</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-neutral-100 mt-4">
              <button
                onClick={() => setTab('profile')}
                className={`flex-1 py-2 text-xs font-semibold text-center border-b-2 cursor-pointer transition-colors ${
                  tab === 'profile'
                    ? 'border-[#FF9F61] text-[#FF9F61]'
                    : 'border-transparent text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Profile & Details
              </button>
              <button
                onClick={() => setTab('orders')}
                className={`flex-1 py-2 text-xs font-semibold text-center border-b-2 cursor-pointer transition-colors ${
                  tab === 'orders'
                    ? 'border-[#FF9F61] text-[#FF9F61]'
                    : 'border-transparent text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Recent Orders
              </button>
            </div>

            <div className="py-5">
              {tab === 'profile' ? (
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-neutral-400 block">Email:</span>
                    <span className="font-medium text-neutral-800">victoria.siege@sparklezsiege.com</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block">Default Shipping Address:</span>
                    <span className="font-medium text-neutral-800">
                      742 Evergreen Terrace, Beverly Hills, CA 90210
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block">Member Since:</span>
                    <span className="font-medium text-neutral-800">January 2025</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100 text-xs">
                    <div className="flex justify-between font-bold text-neutral-900 mb-1">
                      <span>Order #SKS-8892</span>
                      <span className="text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
                      </span>
                    </div>
                    <p className="text-neutral-500">July 10, 2026 • $1,250.00</p>
                    <p className="text-neutral-700 mt-1 font-medium">
                      Veritas Classic Diamond Tennis Bracelet
                    </p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsLoggedIn(false)}
              className="w-full mt-2 text-xs font-semibold text-neutral-500 hover:text-rose-600 transition-colors py-2 text-center"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
