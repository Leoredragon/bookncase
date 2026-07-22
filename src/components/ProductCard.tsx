'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Product } from '@/types/database.types';
import { ShoppingBag, Check } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { Link } from '@/navigation';

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const locale = useLocale();
  const t = useTranslations('Product');
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  // Dynamic language key resolution (e.g. title_tr, title_en, title_nl)
  const localizedTitle =
    (product[`title_${locale}` as keyof Product] as string) ||
    product.title_tr ||
    product.title ||
    '';

  const localizedDescription =
    (product[`description_${locale}` as keyof Product] as string) ||
    product.description_tr ||
    product.description ||
    '';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group flex flex-col justify-between h-full bg-white rounded-3xl p-4 shadow-xs hover:shadow-xl border border-stone-200/70 transition-all duration-300 transform hover:-translate-y-1">
      <Link href={`/product/${product.id}`} className="block space-y-4">
        {/* Product Image */}
        <div className="relative aspect-4/5 w-full overflow-hidden rounded-2xl bg-stone-100 mb-4">
          <img
            src={product.image_url || DEFAULT_IMAGE}
            alt={localizedTitle}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          {product.stock < 5 && product.stock > 0 && (
            <span className="absolute top-3 left-3 bg-[#C5A059] text-white text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-xs">
              Son {product.stock} adet
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-2 px-1 mb-4">
          <h3 className="text-xl font-serif font-semibold text-[#1C1B1A] group-hover:text-[#C5A059] transition-colors line-clamp-1">
            {localizedTitle}
          </h3>
          {localizedDescription && (
            <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed font-light">
              {localizedDescription}
            </p>
          )}
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-lg font-semibold text-[#1C1B1A]">
              ₺{product.price?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] font-medium text-stone-400">
              {isOutOfStock ? t('outOfStock') : t('inStock')}
            </span>
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={isOutOfStock}
        className={`w-full py-3.5 px-4 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer mt-2 ${
          added
            ? 'bg-emerald-700 text-white shadow-md scale-[0.99]'
            : isOutOfStock
            ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
            : 'bg-[#1C1B1A] text-[#FAF8F5] hover:bg-[#2D2B2A] shadow-md hover:shadow-lg active:scale-[0.98]'
        }`}
      >
        {added ? (
          <>
            <Check className="w-4 h-4 text-white" />
            <span>{t('added')}</span>
          </>
        ) : (
          <>
            <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
            <span>{isOutOfStock ? t('outOfStock') : t('addToCart')}</span>
          </>
        )}
      </button>
    </div>
  );
}
