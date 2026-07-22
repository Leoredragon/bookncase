import { setRequestLocale, getTranslations } from 'next-intl/server';
import Hero from '@/components/Hero';
import ProductList from '@/components/ProductList';
import { Suspense } from 'react';

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Collections');
  const tProduct = await getTranslations('Product');

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
    </main>
  );
}
