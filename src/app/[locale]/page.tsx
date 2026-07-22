import { setRequestLocale, getTranslations } from 'next-intl/server';
import Hero from '@/components/Hero';
import ProductList from '@/components/ProductList';
import { Suspense } from 'react';
import { Link } from '@/navigation';
import { ArrowRight, Compass, MapPin, Mail } from 'lucide-react';

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Collections');
  const tProduct = await getTranslations('Product');
  const tAbout = await getTranslations('About');
  const tContact = await getTranslations('Contact');

  return (
    <main className="min-h-screen">
      <Hero />

      {/* Collections Section */}
      <section id="collections" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-12 sm:mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A059] bg-[#C5A059]/10 px-3.5 py-1.5 rounded-full inline-block">
            {t('badge')}
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#1C1B1A] tracking-tight">
            {t('title')}
          </h2>
          <p className="text-stone-600 font-light text-base sm:text-lg">
            {t('subtitle')}
          </p>
        </div>

        <Suspense
          fallback={
            <div className="text-center py-16 text-stone-500 font-serif animate-pulse">
              {tProduct('loading')}
            </div>
          }
        >
          <ProductList />
        </Suspense>
      </section>

      {/* Hakkımızda (About) Teaser Section */}
      <section id="about" className="bg-[#1C1B1A] text-[#FAF8F5] py-20 sm:py-28 my-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF8F5]/10 text-[#C5A059] text-xs font-semibold uppercase tracking-widest border border-[#C5A059]/30">
            <Compass className="w-3.5 h-3.5" />
            <span>Düzce Atölyesi</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-[#FAF8F5]">
            {tAbout('heroTitle')}
          </h2>

          <p className="text-stone-300 font-serif text-lg sm:text-xl font-light leading-relaxed max-w-3xl mx-auto">
            "{tAbout('story')}"
          </p>

          <div className="pt-4">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#C5A059] text-[#1C1B1A] font-semibold text-sm hover:bg-[#b08d4b] transition-all shadow-xl"
            >
              <span>Hikayemizin Tamamını Oku</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* İletişim (Contact) Teaser Section */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="bg-white rounded-3xl p-8 sm:p-14 border border-stone-200/80 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A059] bg-[#C5A059]/10 px-3.5 py-1.5 rounded-full inline-block">
              İletişim
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C1B1A]">
              {tContact('title')}
            </h2>
            <p className="text-stone-600 font-light text-base">
              {tContact('subtitle')}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-2 text-xs font-medium text-stone-700">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C5A059]" />
                <span>{tContact('addressValue')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C5A059]" />
                <span>{tContact('emailValue')}</span>
              </div>
            </div>
          </div>

          <Link
            href="/contact"
            className="px-8 py-4 rounded-2xl bg-[#1C1B1A] text-[#FAF8F5] font-semibold text-sm hover:bg-[#2D2B2A] transition-all shadow-lg shrink-0 flex items-center gap-2"
          >
            <span>İletişim Formuna Git</span>
            <ArrowRight className="w-4 h-4 text-[#C5A059]" />
          </Link>
        </div>
      </section>
    </main>
  );
}
