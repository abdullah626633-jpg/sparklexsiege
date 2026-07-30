import React from 'react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-neutral-800 space-y-6">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#FF9F61] block mb-1">
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
            At SparklezSiege Jewellery, we respect your privacy and are committed to protecting your personal data. When you visit our website, place a Cash on Delivery order, or contact our customer support, we collect information such as your name, delivery address, phone number, and email address solely for order delivery and customer care.
          </p>

          <h2 className="font-serif-luxury text-lg font-bold text-neutral-900 mt-6">2. How We Use Your Information</h2>
          <p>
            We utilize your information solely to process orders, deliver courier packages across Pakistan, send email notifications, and provide personalized customer care. We never sell, rent, or trade your personal data to third parties.
          </p>

          <h2 className="font-serif-luxury text-lg font-bold text-neutral-900 mt-6">3. Cash on Delivery Security</h2>
          <p>
            We offer Cash on Delivery (COD) as our exclusive payment method across Pakistan. No credit card information or banking details are collected or stored on our website.
          </p>

          <h2 className="font-serif-luxury text-lg font-bold text-neutral-900 mt-6">4. Contacting Us</h2>
          <p>
            If you have questions regarding this Privacy Policy or your personal data, please email <a href="mailto:Sparklezsiege@gmail.com" className="text-[#FF9F61] underline">Sparklezsiege@gmail.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
};
