'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useWishlistStore } from '@/store/useWishlistStore';
import ProductCard from '@/components/ProductCard';
import { Link } from '@/navigation';
import { Heart, ArrowLeft } from 'lucide-react';

export default function WishlistPage() {
  const t = useTranslations('Wishlist');
  const items = useWishlistStore((state) => state.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="min-h-screen pt-32 pb-16 px-4 max-w-7xl mx-auto text-center font-serif text-stone-500 animate-pulse">
        Favoriler yükleniyor...
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold uppercase tracking-wider mb-2 border border-rose-200">
            <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
            <span>Koleksiyonunuz</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C1B1A]">
            {t('title')}
          </h1>
          <p className="text-stone-500 font-light text-sm mt-1">
            {t('subtitle')}
          </p>
        </div>

        <Link
          href="/#collections"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-700 hover:text-[#1C1B1A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#C5A059]" />
          <span>Koleksiyona Dön</span>
        </Link>
      </div>

      {/* Wishlist Items Grid or Empty View */}
      {items.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/80 max-w-xl mx-auto space-y-6 shadow-sm">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto border border-rose-200">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#1C1B1A]">
            {t('empty')}
          </h2>
          <p className="text-stone-500 text-sm font-light">
            Sitedeki kalp simgelerine tıklayarak beğendiğiniz ürünleri buraya ekleyebilirsiniz.
          </p>
          <Link
            href="/#collections"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#1C1B1A] text-[#FAF8F5] font-medium text-sm rounded-2xl shadow-lg hover:bg-[#2D2B2A] transition-all cursor-pointer"
          >
            <span>Koleksiyonu İncele</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
