'use client';

import { useState } from 'react';
import { Product } from '@/types/database.types';
import { useCartStore } from '@/store/useCartStore';
import { ShoppingBag, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function AddToCartButton({ product }: { product: Product }) {
  const t = useTranslations('Product');
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isOutOfStock}
      className={`w-full py-4 px-8 rounded-2xl font-semibold text-base transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer shadow-xl ${
        added
          ? 'bg-emerald-700 text-white scale-[0.99]'
          : isOutOfStock
          ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
          : 'bg-[#1C1B1A] text-[#FAF8F5] hover:bg-[#2D2B2A] hover:shadow-2xl active:scale-[0.98]'
      }`}
    >
      {added ? (
        <>
          <Check className="w-5 h-5 text-white" />
          <span>{t('added')}</span>
        </>
      ) : (
        <>
          <ShoppingBag className="w-5 h-5 text-[#C5A059]" />
          <span>{isOutOfStock ? t('outOfStock') : t('addToCart')}</span>
        </>
      )}
    </button>
  );
}
