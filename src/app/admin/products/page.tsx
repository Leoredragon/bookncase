'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types/database.types';
import { Plus, Trash2, Edit3, Image as ImageIcon, CheckCircle, RefreshCw, X, Images, Globe, Layers, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'tr' | 'en' | 'nl' | 'details'>('tr');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [titleTr, setTitleTr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [titleNl, setTitleNl] = useState('');
  const [descTr, setDescTr] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descNl, setDescNl] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [imageUrl, setImageUrl] = useState('');
  const [galleryText, setGalleryText] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setProducts(data as Product[]);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setTitleTr('');
    setTitleEn('');
    setTitleNl('');
    setDescTr('');
    setDescEn('');
    setDescNl('');
    setPrice('');
    setStock('10');
    setImageUrl('');
    setGalleryText('');
    setActiveTab('tr');
  };

  const openAddModal = () => {
    resetForm();
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setTitleTr(p.title_tr || p.title || '');
    setTitleEn(p.title_en || '');
    setTitleNl(p.title_nl || '');
    setDescTr(p.description_tr || p.description || '');
    setDescEn(p.description_en || '');
    setDescNl(p.description_nl || '');
    setPrice(p.price ? String(p.price) : '');
    setStock(p.stock ? String(p.stock) : '0');
    setImageUrl(p.image_url || '');
    setGalleryText(p.gallery_urls ? p.gallery_urls.join(', ') : '');
    setActiveTab('tr');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleTr.trim() || !price) {
      setActiveTab('tr');
      return;
    }

    setSubmitting(true);
    setSuccessMsg('');

    try {
      const galleryArray = galleryText
        ? galleryText.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      const mainImg = imageUrl.trim() || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800';

      const payload = {
        title: titleTr.trim(),
        title_tr: titleTr.trim(),
        title_en: titleEn.trim() || titleTr.trim(),
        title_nl: titleNl.trim() || titleTr.trim(),
        description: descTr.trim(),
        description_tr: descTr.trim(),
        description_en: descEn.trim() || descTr.trim(),
        description_nl: descNl.trim() || descTr.trim(),
        price: parseFloat(price),
        stock: parseInt(stock, 10) || 0,
        image_url: mainImg,
        gallery_urls: galleryArray.length > 0 ? galleryArray : [mainImg]
      };

      if (editingProduct) {
        const { error } = await (supabase.from('products') as any)
          .update(payload)
          .eq('id', editingProduct.id);

        if (error) {
          alert(`Güncelleme hatası: ${error.message}`);
        } else {
          setSuccessMsg('Ürün başarıyla güncellendi!');
          setIsModalOpen(false);
          fetchProducts();
        }
      } else {
        const { error } = await (supabase.from('products') as any).insert([payload]);

        if (error) {
          alert(`Ekleme hatası: ${error.message}`);
        } else {
          setSuccessMsg('Yeni ürün kataloğa eklendi!');
          setIsModalOpen(false);
          fetchProducts();
        }
      }
    } catch (err: any) {
      console.error('Submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;

    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (!error) {
        setProducts(products.filter((p) => p.id !== id));
      } else {
        alert(`Silme hatası: ${error.message}`);
      }
    } catch (err: any) {
      console.error('Delete error:', err);
    }
  };

  const getStockBadge = (stockCount: number) => {
    if (stockCount <= 0) {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
          Stok Tükendi
        </span>
      );
    }
    if (stockCount < 10) {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
          Kritik Stok: {stockCount}
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
        {stockCount} Adet Stokta
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* SaaS Dashboard Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1B1A] tracking-tight">
            Ürün Kataloğu
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm font-light">
            Toplam <span className="font-semibold text-stone-800">{products.length}</span> ürün yönetiliyor.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={fetchProducts}
            className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-stone-700 hover:bg-stone-100 transition-colors shadow-2xs cursor-pointer min-h-[44px]"
            title="Yenile"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={openAddModal}
            className="flex-1 sm:flex-none py-3.5 px-6 rounded-2xl bg-[#1C1B1A] text-[#FAF8F5] font-semibold text-xs sm:text-sm shadow-xl hover:bg-[#2D2B2A] transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
          >
            <Plus className="w-4 h-4 text-[#C5A059]" />
            <span>Yeni Ürün Ekle</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Grid-based Product Cards (No Table) */}
      {loading ? (
        <div className="text-center py-20 text-stone-400 font-serif animate-pulse">
          Ürünler yükleniyor...
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center text-stone-400 font-serif border border-stone-200/80 shadow-xs">
          Kayıtlı ürün bulunamadı. "Yeni Ürün Ekle" butonuna basarak ekleyebilirsiniz.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <motion.div
              key={p.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Product Image Box */}
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-stone-100 border border-stone-200/60">
                  <img
                    src={
                      p.image_url ||
                      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800'
                    }
                    alt={p.title}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute top-3 right-3">
                    {getStockBadge(p.stock)}
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-1.5 px-1">
                  <h3 className="font-serif font-bold text-lg text-[#1C1B1A] line-clamp-1">
                    {p.title_tr || p.title}
                  </h3>
                  <div className="text-xs text-stone-400 font-medium">
                    EN: {p.title_en || '-'} | NL: {p.title_nl || '-'}
                  </div>
                  <div className="text-base font-bold text-[#1C1B1A] pt-1">
                    ₺{p.price?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-5 border-t border-stone-100 mt-4">
                <button
                  onClick={() => openEditModal(p)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-stone-50 border border-stone-200/80 text-stone-700 hover:bg-stone-100 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer min-h-[40px]"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Düzenle</span>
                </button>

                <button
                  onClick={() => handleDelete(p.id)}
                  className="p-2.5 rounded-xl bg-rose-50 border border-rose-200/60 text-rose-600 hover:bg-rose-100 text-xs transition-colors cursor-pointer min-h-[40px]"
                  title="Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Tabbed Form Modal with framer-motion */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 my-8 max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-stone-200/60 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-[#1C1B1A] text-[#C5A059] rounded-xl">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-serif font-bold text-[#1C1B1A]">
                    {editingProduct ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
                  </h2>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-2xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab('tr')}
                  className={`flex-1 py-2.5 px-3 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'tr'
                      ? 'bg-[#1C1B1A] text-[#FAF8F5] shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Türkçe (TR)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('en')}
                  className={`flex-1 py-2.5 px-3 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'en'
                      ? 'bg-[#1C1B1A] text-[#FAF8F5] shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  English (EN)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('nl')}
                  className={`flex-1 py-2.5 px-3 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'nl'
                      ? 'bg-[#1C1B1A] text-[#FAF8F5] shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Nederlands (NL)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('details')}
                  className={`flex-1 py-2.5 px-3 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'details'
                      ? 'bg-[#1C1B1A] text-[#FAF8F5] shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Fiyat & Görseller
                </button>
              </div>

              {/* Form Content by Active Tab */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tab 1: TR */}
                {activeTab === 'tr' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                        Ürün Adı (Türkçe) *
                      </label>
                      <input
                        type="text"
                        required
                        value={titleTr}
                        onChange={(e) => setTitleTr(e.target.value)}
                        placeholder="Örn: Deri A5 Defter"
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-1 focus:ring-[#1C1B1A] focus:border-[#1C1B1A] outline-none text-sm bg-stone-50/40"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                        Açıklama (Türkçe)
                      </label>
                      <textarea
                        rows={4}
                        value={descTr}
                        onChange={(e) => setDescTr(e.target.value)}
                        placeholder="Ürün detaylı açıklaması..."
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-1 focus:ring-[#1C1B1A] focus:border-[#1C1B1A] outline-none text-sm bg-stone-50/40 resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* Tab 2: EN */}
                {activeTab === 'en' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                        Product Title (English)
                      </label>
                      <input
                        type="text"
                        value={titleEn}
                        onChange={(e) => setTitleEn(e.target.value)}
                        placeholder="e.g. Leather A5 Notebook"
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-1 focus:ring-[#1C1B1A] focus:border-[#1C1B1A] outline-none text-sm bg-stone-50/40"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                        Description (English)
                      </label>
                      <textarea
                        rows={4}
                        value={descEn}
                        onChange={(e) => setDescEn(e.target.value)}
                        placeholder="Detailed product description..."
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-1 focus:ring-[#1C1B1A] focus:border-[#1C1B1A] outline-none text-sm bg-stone-50/40 resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* Tab 3: NL */}
                {activeTab === 'nl' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                        Product Titel (Nederlands)
                      </label>
                      <input
                        type="text"
                        value={titleNl}
                        onChange={(e) => setTitleNl(e.target.value)}
                        placeholder="bijv. Leren A5 Notitieboek"
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-1 focus:ring-[#1C1B1A] focus:border-[#1C1B1A] outline-none text-sm bg-stone-50/40"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                        Beschrijving (Nederlands)
                      </label>
                      <textarea
                        rows={4}
                        value={descNl}
                        onChange={(e) => setDescNl(e.target.value)}
                        placeholder="Gedetailleerde productbeschrijving..."
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-1 focus:ring-[#1C1B1A] focus:border-[#1C1B1A] outline-none text-sm bg-stone-50/40 resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* Tab 4: Details & Images */}
                {activeTab === 'details' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                          Fiyat (TL) *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="650"
                          className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-1 focus:ring-[#1C1B1A] focus:border-[#1C1B1A] outline-none text-sm bg-stone-50/40"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                          Stok Adedi
                        </label>
                        <input
                          type="number"
                          value={stock}
                          onChange={(e) => setStock(e.target.value)}
                          placeholder="10"
                          className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-1 focus:ring-[#1C1B1A] focus:border-[#1C1B1A] outline-none text-sm bg-stone-50/40"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                        Ana Görsel URL
                      </label>
                      <div className="relative">
                        <ImageIcon className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                        <input
                          type="url"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 focus:ring-1 focus:ring-[#1C1B1A] focus:border-[#1C1B1A] outline-none text-sm bg-stone-50/40"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2 flex items-center gap-1.5">
                        <Images className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>Galeri Görselleri (Virgülle ayrılmış linkler)</span>
                      </label>
                      <textarea
                        rows={3}
                        value={galleryText}
                        onChange={(e) => setGalleryText(e.target.value)}
                        placeholder="https://img1.jpg, https://img2.jpg"
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-1 focus:ring-[#1C1B1A] focus:border-[#1C1B1A] outline-none text-xs font-mono bg-stone-50/40 resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* Modal Footer Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200/60">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 rounded-xl bg-stone-100 text-stone-700 text-xs font-semibold hover:bg-stone-200 transition-colors cursor-pointer min-h-[44px]"
                  >
                    İptal
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-3 rounded-xl bg-[#1C1B1A] text-[#FAF8F5] text-xs font-semibold hover:bg-stone-900 transition-all cursor-pointer min-h-[44px] disabled:opacity-50 shadow-md"
                  >
                    {submitting ? 'Kaydediliyor...' : editingProduct ? 'Ürünü Güncelle' : 'Ürünü Kaydet'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
