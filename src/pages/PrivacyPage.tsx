import React from 'react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-neutral-800 space-y-6">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37] block mb-1">
            Legal & Trust
          </span>
          <h1 className="font-serif-luxury text-4xl font-bold text-neutral-900">
            Privacy Policy
          </h1>
          <p className="text-xs text-neutral-400 mt-2">Last Updated: July 2026</p>
        </div>

        <section className="space-y-3 text-xs leading-relaxed text-neutral-600">
          <h2 className="font-serif-luxury text-lg font-bold text-neutral-900">1. Information We Collect</h2>
          <p>
            At SparklezSiege Jewellery, we respect your privacy and are committed to protecting your personal data. When you visit our website, make a purchase, or contact our concierge, we collect information such as your name, shipping address, email, phone number, and payment information processed securely via encrypted gateways.
          </p>

          <h2 className="font-serif-luxury text-lg font-bold text-neutral-900 mt-6">2. How We Use Your Information</h2>
          <p>
            We utilize your information solely to process orders, deliver insured courier packages, issue certificate authentications, and provide personalized customer care. We never sell, rent, or trade your personal data to third parties.
          </p>

          <h2 className="font-serif-luxury text-lg font-bold text-neutral-900 mt-6">3. Data Security & Encryption</h2>
          <p>
            All online transactions on SparklezSiege are protected by standard 256-bit Secure Socket Layer (SSL) encryption technology. Payment card information is handled in compliance with PCI-DSS standards.
          </p>

          <h2 className="font-serif-luxury text-lg font-bold text-neutral-900 mt-6">4. Contacting Us</h2>
          <p>
            If you have questions regarding this Privacy Policy or your personal data, please email privacy@sparklezsiege.com.
          </p>
        </section>
      </div>
    </div>
  );
};
