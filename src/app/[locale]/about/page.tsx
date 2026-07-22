'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Sparkles, Leaf, Award, Compass, Heart } from 'lucide-react';
import { Link } from '@/navigation';

export default function AboutPage() {
  const t = useTranslations('About');

  return (
    <main className="min-h-screen pt-20 pb-24 overflow-hidden">
      {/* Full-width Hero Banner with Dark Aesthetic */}
      <div className="relative h-[65vh] min-h-[450px] w-full flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-0 z-0"
        >
          <img
            src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=2000"
            alt="Book n Case Atelier Craftsmanship"
            className="w-full h-full object-cover object-center filter brightness-[0.65] contrast-[1.1]"
          />
          {/* Subtle Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-transparent to-[#1C1B1A]/50" />
        </motion.div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-[#FAF8F5] space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1C1B1A]/80 border border-[#C5A059]/40 backdrop-blur-md text-xs uppercase tracking-widest text-[#C5A059]"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Atölye Düzce • Hikayemiz</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl sm:text-6xl font-serif font-bold tracking-tight text-[#FAF8F5]"
          >
            {t('heroTitle')}
          </motion.h1>
        </div>
      </div>

      {/* Brand Story Section with Generous Whitespace */}
      <section className="max-w-4xl mx-auto px-6 sm:px-8 py-20 sm:py-28 text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="w-12 h-0.5 bg-[#C5A059] mx-auto" />

          <p className="text-xl sm:text-3xl font-serif font-medium text-[#1C1B1A] leading-relaxed sm:leading-loose text-stone-800">
            "{t('story')}"
          </p>

          <div className="w-12 h-0.5 bg-[#C5A059] mx-auto" />
        </motion.div>
      </section>

      {/* Values Section (3 Columns) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-stone-200/80">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A059] bg-[#C5A059]/10 px-3.5 py-1.5 rounded-full inline-block">
            Standartlarımız
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C1B1A]">
            {t('valuesTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
          {/* Value 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-3xl p-8 shadow-xs hover:shadow-xl border border-stone-200/80 transition-all duration-300 text-center space-y-4"
          >
            <div className="w-16 h-16 bg-[#1C1B1A] text-[#C5A059] rounded-2xl flex items-center justify-center mx-auto shadow-md">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#1C1B1A]">
              {t('value1Title')}
            </h3>
            <p className="text-stone-600 font-light text-sm leading-relaxed">
              {t('value1Desc')}
            </p>
          </motion.div>

          {/* Value 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl p-8 shadow-xs hover:shadow-xl border border-stone-200/80 transition-all duration-300 text-center space-y-4"
          >
            <div className="w-16 h-16 bg-[#1C1B1A] text-[#C5A059] rounded-2xl flex items-center justify-center mx-auto shadow-md">
              <Leaf className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#1C1B1A]">
              {t('value2Title')}
            </h3>
            <p className="text-stone-600 font-light text-sm leading-relaxed">
              {t('value2Desc')}
            </p>
          </motion.div>

          {/* Value 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-3xl p-8 shadow-xs hover:shadow-xl border border-stone-200/80 transition-all duration-300 text-center space-y-4"
          >
            <div className="w-16 h-16 bg-[#1C1B1A] text-[#C5A059] rounded-2xl flex items-center justify-center mx-auto shadow-md">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#1C1B1A]">
              {t('value3Title')}
            </h3>
            <p className="text-stone-600 font-light text-sm leading-relaxed">
              {t('value3Desc')}
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
