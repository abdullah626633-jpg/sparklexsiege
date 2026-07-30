import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="bg-white min-h-screen py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#FF9F61] block mb-2">
            Atelier Assistance
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-bold text-neutral-900 tracking-tight">
            Contact SparklezSiege
          </h1>
          <p className="text-sm text-neutral-500 font-light mt-3">
            Our luxury jewellery concierge is available to assist with sizing, bespoke styling advice, and order inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details (5 cols) */}
          <div className="lg:col-span-5 bg-neutral-50 p-8 sm:p-10 rounded-3xl border border-neutral-100 flex flex-col justify-between">
            <div>
              <h2 className="font-serif-luxury text-2xl font-bold text-neutral-900 mb-6">
                Concierge Contact
              </h2>

              <div className="space-y-6 text-xs">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-white text-[#FF9F61] rounded-2xl border border-neutral-100 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold text-neutral-900 block text-sm">Client Care Email</span>
                    <span className="text-neutral-600">concierge@sparklezsiege.com</span>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-white text-[#FF9F61] rounded-2xl border border-neutral-100 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold text-neutral-900 block text-sm">Direct Phone & WhatsApp</span>
                    <a
                      href="https://wa.me/923039117733"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-600 hover:text-[#FF9F61] transition-colors"
                    >
                      0303 9117733 (+92 303 9117733)
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-white text-[#FF9F61] rounded-2xl border border-neutral-100 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold text-neutral-900 block text-sm">Flagship Atelier</span>
                    <span className="text-neutral-600">450 Rodeo Drive, Suite 200, Beverly Hills, CA 90210</span>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-white text-[#FF9F61] rounded-2xl border border-neutral-100 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold text-neutral-900 block text-sm">Working Hours</span>
                    <span className="text-neutral-600">Monday - Saturday: 9:00 AM - 7:00 PM PST</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-200/60">
              <p className="text-[11px] text-neutral-500">
                Average email response time: Within 2 hours during business hours.
              </p>
            </div>
          </div>

          {/* Form (7 cols) */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200 shadow-xs">
            {submitted ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-serif-luxury text-2xl font-bold text-neutral-900">
                  Message Delivered!
                </h3>
                <p className="text-xs text-neutral-600 max-w-sm mx-auto">
                  Thank you for reaching out, <span className="font-bold text-neutral-900">{name}</span>. A luxury jewellery advisor will respond to your inquiry shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setEmail('');
                    setSubject('');
                    setMessage('');
                  }}
                  className="mt-4 text-xs font-bold text-[#FF9F61] underline cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="font-serif-luxury text-2xl font-bold text-neutral-900 mb-2">
                  Send Us A Message
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Victoria Siege"
                      className="w-full py-2.5 px-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:border-[#FF9F61]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Your Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. victoria@example.com"
                      className="w-full py-2.5 px-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:border-[#FF9F61]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Custom Ring Sizing Inquiry"
                    className="w-full py-2.5 px-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:border-[#FF9F61]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Your Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your question or styling preference..."
                    className="w-full py-2.5 px-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs h-32 focus:outline-hidden focus:border-[#FF9F61]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-neutral-900 hover:bg-[#FF9F61] text-white hover:text-neutral-950 font-bold text-sm py-3.5 rounded-2xl transition-colors cursor-pointer shadow-xs flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
