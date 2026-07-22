import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  const t = useTranslations('Hero');

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background Image with Ambient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=2000"
          alt="Book n Case Luxury Notebooks"
          className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.05]"
        />
        {/* Soft Vignette & Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5]/95 via-[#FAF8F5]/75 to-transparent sm:via-[#FAF8F5]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-transparent to-[#FAF8F5]/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl text-left space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1C1B1A]/90 text-[#FAF8F5] text-xs font-medium tracking-widest uppercase shadow-md border border-[#C5A059]/40 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{t('badge')}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-[#1C1B1A] leading-[1.1] tracking-tight">
            {t('title')}
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-stone-700 font-light leading-relaxed max-w-xl">
            {t('description')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <Link
              href="/#collections"
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#1C1B1A] text-[#FAF8F5] font-medium text-base rounded-2xl shadow-xl hover:bg-[#2D2B2A] transition-all duration-300 transform hover:-translate-y-0.5 border border-stone-800 cursor-pointer"
            >
              <span>{t('cta')}</span>
              <ArrowRight className="w-4 h-4 text-[#C5A059] group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/#about"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#FAF8F5]/80 hover:bg-[#FAF8F5] text-[#1C1B1A] font-medium text-base rounded-2xl border border-stone-300/80 transition-all duration-300 backdrop-blur-md hover:shadow-md cursor-pointer"
            >
              {t('secondaryCta')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
