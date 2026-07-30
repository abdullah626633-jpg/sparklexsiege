import React from 'react';
import { ShieldAlert, RefreshCw, CheckCircle, Clock, MessageCircle, AlertTriangle, Truck } from 'lucide-react';

export const ExchangePolicyPage: React.FC = () => {
  const whatsappUrl = `https://wa.me/923039117733?text=${encodeURIComponent(
    'Hello SparklezSiege! I would like to inquire about an exchange or return.'
  )}`;

  return (
    <div className="bg-white min-h-screen py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-neutral-800 space-y-8">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#FF9F61] block mb-2">
            SparklezSiege Customer Guarantee
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-neutral-900">
            Exchange & Return Policy
          </h1>
          <p className="text-sm text-neutral-500 mt-3 max-w-xl mx-auto">
            Your satisfaction and peace of mind are our highest priorities. Learn about our 7-day damaged item exchange and general return guidelines.
          </p>
        </div>

        {/* 7-Day Guarantee Highlight Banner */}
        <div className="bg-gradient-to-r from-[#002D2F] via-[#003B3E] to-[#002D2F] text-white p-6 sm:p-8 rounded-2xl shadow-xl border border-[#FF9F61]/30 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 bg-[#FF9F61]/20 text-[#FF9F61] px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4" />
                <span>Damaged Item Exchange & Easy Returns</span>
              </div>
              <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-white">
                7-Day Exchange & Return Window
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 max-w-lg leading-relaxed">
                If your product arrives damaged or defective, we offer a free replacement exchange within <strong>7 days</strong> of delivery. For standard returns, customer must cover the return delivery charges.
              </p>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-5 py-3 rounded-xl font-medium text-sm transition-all shadow-md shrink-0 hover:scale-105"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Contact via WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Policy Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="border border-neutral-200 rounded-2xl p-6 bg-neutral-50/50 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#002D2F] text-[#FF9F61] flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-serif-luxury text-lg font-bold text-neutral-900">1. 7-Day Request Window</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              All exchange and return claims must be filed within <strong>7 calendar days</strong> from the date of package delivery. Requests after 7 days cannot be processed.
            </p>
          </div>

          <div className="border border-neutral-200 rounded-2xl p-6 bg-neutral-50/50 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#002D2F] text-[#FF9F61] flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-serif-luxury text-lg font-bold text-neutral-900">2. Damaged Product Exchange</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              If your jewelry arrives physically damaged, broken, or defective, send us a photo/video proof within 7 days. We will exchange and send a fresh replacement at no extra charge.
            </p>
          </div>

          <div className="border border-neutral-200 rounded-2xl p-6 bg-neutral-50/50 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#002D2F] text-[#FF9F61] flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-serif-luxury text-lg font-bold text-neutral-900">3. Return Policy & Delivery Charges</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              If a customer wishes to return an item for personal reasons (change of mind, size preference, etc.), <strong>the customer is required to pay for all return delivery charges</strong>.
            </p>
          </div>

          <div className="border border-neutral-200 rounded-2xl p-6 bg-neutral-50/50 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#002D2F] text-[#FF9F61] flex items-center justify-center font-bold">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h3 className="font-serif-luxury text-lg font-bold text-neutral-900">4. Item Condition Requirements</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Returned products must be unworn, unused, in original condition, and sent back in the original SparklezSiege luxury gift box along with all tags and invoice.
            </p>
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <section className="bg-neutral-900 text-white rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="font-serif-luxury text-xl font-bold text-[#FF9F61]">
            How to File an Exchange or Return Request
          </h2>
          <ol className="space-y-4 text-xs sm:text-sm text-neutral-300">
            <li className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#FF9F61] text-neutral-950 font-bold text-xs flex items-center justify-center">1</span>
              <span><strong>Contact Customer Support:</strong> Message our team on WhatsApp at <a href="https://wa.me/923039117733" target="_blank" rel="noopener noreferrer" className="text-[#FF9F61] underline font-semibold">0303 9117733</a> within 7 days of package receipt.</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#FF9F61] text-neutral-950 font-bold text-xs flex items-center justify-center">2</span>
              <span><strong>Provide Order Details:</strong> Share your Order Number, photos/videos (if damaged), and specify whether you need an exchange or a return.</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#FF9F61] text-neutral-950 font-bold text-xs flex items-center justify-center">3</span>
              <span><strong>Dispatch & Fees:</strong> For damaged items, replacement is dispatched free of charge. For standard returns, customer pays the return delivery fee for courier shipping.</span>
            </li>
          </ol>
        </section>
      </div>
    </div>
  );
};

