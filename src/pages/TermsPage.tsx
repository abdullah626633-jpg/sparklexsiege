import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-neutral-800 space-y-6">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#FF9F61] block mb-1">
            Terms of Service
          </span>
          <h1 className="font-serif-luxury text-4xl font-bold text-neutral-900">
            Terms & Conditions
          </h1>
          <p className="text-xs text-neutral-400 mt-2">Last Updated: July 2026</p>
        </div>

        <section className="space-y-3 text-xs leading-relaxed text-neutral-600">
          <h2 className="font-serif-luxury text-lg font-bold text-neutral-900">1. Acceptance of Terms</h2>
          <p>
            By accessing or purchasing from SparklezSiege, you agree to comply with these Terms and Conditions. All products displayed are subject to availability and authentication verification.
          </p>

          <h2 className="font-serif-luxury text-lg font-bold text-neutral-900 mt-6">2. Pricing & Product Accuracy</h2>
          <p>
            Prices for our jewellery pieces are listed in USD ($) and are subject to change. We make every effort to display the colors, weights, carat dimensions, and gemstone cuts accurately.
          </p>

          <h2 className="font-serif-luxury text-lg font-bold text-neutral-900 mt-6">3. Shipping & Insured Delivery</h2>
          <p>
            All shipments are sent via signature-required insured courier. SparklezSiege accepts responsibility for items until they are signed for at your designated shipping destination.
          </p>

          <h2 className="font-serif-luxury text-lg font-bold text-neutral-900 mt-6">4. Intellectual Property</h2>
          <p>
            All designs, brand trademarks, logos, photography, and text content on SparklezSiege belong exclusively to SparklezSiege Jewellery.
          </p>
        </section>
      </div>
    </div>
  );
};
