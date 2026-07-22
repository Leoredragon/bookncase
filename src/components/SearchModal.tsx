'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight } from 'lucide-react';
import { Link } from '@/navigation';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types/database.types';

const DEMO_SEARCH_PRODUCTS: Product[] = [
  {
    id: 'demo-1',
    title: 'El Yapımı Deri A5 Defter',
    title_tr: 'El Yapımı Deri A5 Defter',
    title_en: 'Handcrafted Leather A5 Notebook',
    title_nl: 'Handgemaakt Leren A5 Notitieboek',
    description: 'Hakiki İtalyan derisinden üretilmiş, dolma kalem dostu 120gr fildişi kağıt.',
    price: 650,
    image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
    stock: 12,
    created_at: new Date().toISOString()
  },
  {
    id: 'demo-2',
    title: 'Süet Defter & Tablet Kılıfı',
    title_tr: 'Süet Defter & Tablet Kılıfı',
    title_en: 'Suede Book & Tablet Case',
    title_nl: 'Suède Boek & Tablet Hoes',
    description: 'Yumuşak süet dokusu ve koruyucu iç astarı ile defterleriniz ve tabletiniz için ideal.',
    price: 850,
    image_url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=600',
    stock: 8,
    created_at: new Date().toISOString()
  },
  {
    id: 'demo-3',
    title: 'Vintage Deri Ajanda',
    title_tr: 'Vintage Deri Ajanda',
    title_en: 'Vintage Leather Planner',
    title_nl: 'Vintage Leren Agenda',
    description: 'Değiştirilebilir iç defter mekanizmasına sahip zamansız bir organizatör.',
    price: 920,
    image_url: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&q=80&w=600',
    stock: 5,
    created_at: new Date().toISOString()
  },
  {
    id: 'demo-4',
    title: 'Minimalist Deri Kalemlik & Kılıf',
    title_tr: 'Minimalist Deri Kalemlik & Kılıf',
    title_en: 'Minimalist Leather Pen Case',
    title_nl: 'Minimalistische Leren Pen Hoes',
    description: 'Zarif pirinç fermuarı ve el dikişli deri detayları ile özel kalemlik.',
    price: 390,
    image_url: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=600',
    stock: 15,
    created_at: new Date().toISOString()
  }
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const t = useTranslations('Search');
  const locale = useLocale();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .ilike('title', `%${query.trim()}%`);

        if (!error && data && data.length > 0) {
          setResults(data as Product[]);
        } else {
          // Fallback search in demo items
          const filtered = DEMO_SEARCH_PRODUCTS.filter((p) => {
            const rawTitle =
              locale === 'en'
                ? p.title_en || p.title
                : locale === 'nl'
                ? p.title_nl || p.title
                : p.title_tr || p.title;
            return String(rawTitle).toLowerCase().includes(query.trim().toLowerCase());
          });
          setResults(filtered);
        }
      } catch {
        const filtered = DEMO_SEARCH_PRODUCTS.filter((p) => {
          const rawTitle =
            locale === 'en'
              ? p.title_en || p.title
              : locale === 'nl'
              ? p.title_nl || p.title
              : p.title_tr || p.title;
          return String(rawTitle).toLowerCase().includes(query.trim().toLowerCase());
        });
        setResults(filtered);
      } finally {
        setSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, locale]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-[#FAF8F5]/98 backdrop-blur-2xl flex flex-col p-4 sm:p-8"
        >
          {/* Header Bar */}
          <div className="max-w-4xl w-full mx-auto flex items-center justify-between pt-4 pb-6 border-b border-stone-200">
            <span className="font-serif font-bold text-xl text-[#1C1B1A]">
              Book n Case <span className="text-xs text-[#C5A059] font-sans font-normal ml-2">Search</span>
            </span>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-stone-200/60 text-stone-700 transition-colors cursor-pointer"
              aria-label="Close search"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search Input Box */}
          <div className="max-w-3xl w-full mx-auto pt-8">
            <div className="relative">
              <Search className="w-6 h-6 text-[#C5A059] absolute left-4 top-4" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('placeholder')}
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-stone-300 text-lg text-[#1C1B1A] placeholder-stone-400 outline-none focus:ring-2 focus:ring-[#C5A059]/30 shadow-lg"
              />
            </div>
          </div>

          {/* Results Area */}
          <div className="max-w-3xl w-full mx-auto flex-1 overflow-y-auto pt-6 space-y-4">
            {searching ? (
              <div className="text-center py-12 text-stone-400 font-serif animate-pulse">
                Aranıyor...
              </div>
            ) : query.trim() && results.length === 0 ? (
              <div className="text-center py-12 text-stone-500 font-serif">
                {t('noResults')}
              </div>
            ) : (
              <div className="divide-y divide-stone-200/60">
                {results.map((product) => {
                  const localizedTitle =
                    locale === 'en'
                      ? product.title_en || product.title
                      : locale === 'nl'
                      ? product.title_nl || product.title
                      : product.title_tr || product.title;

                  return (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      onClick={onClose}
                      className="flex items-center gap-4 py-4 px-2 hover:bg-white/80 rounded-2xl transition-colors group"
                    >
                      <img
                        src={
                          product.image_url ||
                          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400'
                        }
                        alt={localizedTitle}
                        className="w-14 h-16 object-cover rounded-xl bg-stone-100 border border-stone-200/80"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif font-semibold text-stone-900 group-hover:text-[#C5A059] transition-colors truncate">
                          {localizedTitle}
                        </h4>
                        <p className="text-xs text-stone-500 line-clamp-1 font-light">
                          {product.description}
                        </p>
                      </div>
                      <div className="text-right font-semibold text-stone-900 flex items-center gap-2">
                        <span>₺{product.price?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                        <ArrowRight className="w-4 h-4 text-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
