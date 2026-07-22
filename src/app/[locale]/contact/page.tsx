'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Mail, Clock, Send, CheckCircle2, Sparkles } from 'lucide-react';

export default function ContactPage() {
  const t = useTranslations('Contact');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setShowToast(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');

      setTimeout(() => setShowToast(false), 4000);
    }, 800);
  };

  return (
    <main className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-4 z-50 bg-[#1C1B1A] text-[#FAF8F5] px-6 py-4 rounded-2xl shadow-2xl border border-[#C5A059]/40 flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-medium">{t('successToast')}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A059] bg-[#C5A059]/10 px-3.5 py-1.5 rounded-full inline-block">
          Atölye Kapılarımız Açık
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#1C1B1A] tracking-tight">
          {t('title')}
        </h1>
        <p className="text-stone-600 font-light text-base sm:text-lg">
          {t('subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Contact Information */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-8 sm:p-10 shadow-xs border border-stone-200/80 space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-bold text-[#1C1B1A]">
              Book n Case Atölye
            </h2>
            <p className="text-xs text-stone-500 font-light leading-relaxed">
              Özel kişiselleştirilmiş siparişleriniz ve kurumsal hediyelik talepleriniz için doğrudan bize ulaşabilirsiniz.
            </p>
          </div>

          <div className="space-y-6 pt-4 border-t border-stone-100">
            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#1C1B1A] text-[#C5A059] rounded-2xl shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  {t('addressTitle')}
                </h4>
                <p className="text-base font-serif font-semibold text-stone-900">
                  {t('addressValue')}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#1C1B1A] text-[#C5A059] rounded-2xl shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  {t('emailTitle')}
                </h4>
                <a
                  href={`mailto:${t('emailValue')}`}
                  className="text-base font-semibold text-stone-900 hover:text-[#C5A059] transition-colors"
                >
                  {t('emailValue')}
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#1C1B1A] text-[#C5A059] rounded-2xl shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  {t('hoursTitle')}
                </h4>
                <p className="text-sm font-medium text-stone-800">
                  {t('hoursValue')}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 text-xs text-stone-400 font-mono">
            Düzce • Türkiye Handcrafted Stationeries
          </div>
        </div>

        {/* Right Column: Minimalist Contact Form (Underline Only) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 shadow-xs border border-stone-200/80 space-y-6">
          <h2 className="text-2xl font-serif font-bold text-[#1C1B1A] border-b border-stone-200/60 pb-4">
            Bize Yazın
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500">
                  {t('formName')} *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ahmet Yılmaz"
                  className="w-full bg-transparent border-b border-stone-300 focus:border-[#C5A059] text-stone-900 text-sm py-3 outline-none transition-colors rounded-none placeholder-stone-400"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500">
                  {t('formEmail')} *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ahmet@example.com"
                  className="w-full bg-transparent border-b border-stone-300 focus:border-[#C5A059] text-stone-900 text-sm py-3 outline-none transition-colors rounded-none placeholder-stone-400"
                />
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500">
                {t('formSubject')}
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Özel Sipariş / Bilgi Talebi"
                className="w-full bg-transparent border-b border-stone-300 focus:border-[#C5A059] text-stone-900 text-sm py-3 outline-none transition-colors rounded-none placeholder-stone-400"
              />
            </div>

            {/* Message */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500">
                {t('formMessage')} *
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Mesajınızı buraya yazabilirsiniz..."
                className="w-full bg-transparent border-b border-stone-300 focus:border-[#C5A059] text-stone-900 text-sm py-3 outline-none transition-colors rounded-none placeholder-stone-400 resize-none"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#1C1B1A] text-[#FAF8F5] font-semibold text-sm rounded-2xl shadow-xl hover:bg-[#2D2B2A] transition-all cursor-pointer disabled:opacity-50"
              >
                <span>{submitting ? t('sending') : t('sendButton')}</span>
                <Send className="w-4 h-4 text-[#C5A059] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
