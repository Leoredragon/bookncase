'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Product } from '@/types/database.types';
import { ShoppingBag, Check, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { Link } from '@/navigation';
import { motion } from 'framer-motion';

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const locale = useLocale();
  const t = useTranslations('Product');
  const [added, setAdded] = useState(false);
  const [mounted, setMounted] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isFavorite = mounted ? isInWishlist(product.id) : false;

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

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group flex flex-col justify-between h-full bg-white rounded-3xl p-4 shadow-xs hover:shadow-2xl border border-stone-200/70 transition-shadow duration-300"
    >
      <Link href={`/product/${product.id}`} className="block space-y-4">
        {/* Product Image Container */}
        <div className="relative aspect-4/5 w-full overflow-hidden rounded-2xl bg-stone-100 mb-4">
          <img
            src={product.image_url || DEFAULT_IMAGE}
            alt={localizedTitle}
            className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
          />

          {/* Stock Tag */}
          {product.stock < 5 && product.stock > 0 && (
            <span className="absolute top-3 left-3 bg-[#C5A059] text-white text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-xs">
              Son {product.stock} adet
            </span>
          )}

          {/* Wishlist Heart Button */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-md hover:bg-white text-stone-700 hover:text-rose-600 transition-all shadow-md cursor-pointer z-10"
            aria-label="Toggle Wishlist"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorite ? 'fill-rose-600 text-rose-600' : 'text-stone-600'
              }`}
            />
          </button>
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
    </motion.div>
  );
}
