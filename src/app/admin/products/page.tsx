'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types/database.types';
import { Plus, Trash2, Image as ImageIcon, CheckCircle, RefreshCw } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [titleTr, setTitleTr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [titleNl, setTitleNl] = useState('');
  const [descTr, setDescTr] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descNl, setDescNl] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [imageUrl, setImageUrl] = useState('');

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

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleTr.trim() || !price) return;

    setSubmitting(true);
    setSuccessMsg('');

    try {
      const newProduct = {
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
        image_url: imageUrl.trim() || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800'
      };

      const { error } = await (supabase.from('products') as any).insert([newProduct]);

      if (error) {
        console.error('Insert product error:', error);
        alert(`Ürün ekleme hatası: ${error.message}`);
      } else {
        setSuccessMsg('Ürün başarıyla eklendi!');
        // Reset form
        setTitleTr('');
        setTitleEn('');
        setTitleNl('');
        setDescTr('');
        setDescEn('');
        setDescNl('');
        setPrice('');
        setStock('10');
        setImageUrl('');
        fetchProducts();
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      console.error('Insert error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;

    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (!error) {
        setProducts(products.filter((p) => p.id !== id));
      } else {
        alert(`Silme hatası: ${error.message}`);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#1C1B1A]">
            Ürün Yönetimi
          </h1>
          <p className="text-stone-500 text-sm font-light">
            Mağazadaki ürünleri ekleyin, inceleyin veya silin.
          </p>
        </div>

        <button
          onClick={fetchProducts}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs font-medium hover:bg-stone-50 transition-colors shadow-2xs cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Yenile</span>
        </button>
      </div>

      {/* New Product Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200/80 space-y-6">
        <div className="flex items-center gap-3 border-b border-stone-200/60 pb-4">
          <div className="p-2 bg-[#1C1B1A] text-[#C5A059] rounded-xl">
            <Plus className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-serif font-semibold text-[#1C1B1A]">
            Yeni Ürün Ekle
          </h2>
        </div>

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleAddProduct} className="space-y-6">
          {/* Titles Group */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-[#C5A059] outline-none text-sm bg-stone-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                Ürün Adı (İngilizce - EN)
              </label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="Örn: Leather A5 Notebook"
                className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-[#C5A059] outline-none text-sm bg-stone-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                Ürün Adı (Flemenkçe - NL)
              </label>
              <input
                type="text"
                value={titleNl}
                onChange={(e) => setTitleNl(e.target.value)}
                placeholder="Örn: Leren A5 Notitieboek"
                className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-[#C5A059] outline-none text-sm bg-stone-50/50"
              />
            </div>
          </div>

          {/* Price, Stock, Image URL Group */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-[#C5A059] outline-none text-sm bg-stone-50/50"
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
                className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-[#C5A059] outline-none text-sm bg-stone-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                Görsel URL
              </label>
              <div className="relative">
                <ImageIcon className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 focus:border-[#C5A059] outline-none text-sm bg-stone-50/50"
                />
              </div>
            </div>
          </div>

          {/* Descriptions Group */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                Açıklama (TR)
              </label>
              <textarea
                rows={2}
                value={descTr}
                onChange={(e) => setDescTr(e.target.value)}
                placeholder="Ürün açıklaması..."
                className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-[#C5A059] outline-none text-sm bg-stone-50/50 resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                Açıklama (EN)
              </label>
              <textarea
                rows={2}
                value={descEn}
                onChange={(e) => setDescEn(e.target.value)}
                placeholder="Product description..."
                className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-[#C5A059] outline-none text-sm bg-stone-50/50 resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                Açıklama (NL)
              </label>
              <textarea
                rows={2}
                value={descNl}
                onChange={(e) => setDescNl(e.target.value)}
                placeholder="Product beschrijving..."
                className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-[#C5A059] outline-none text-sm bg-stone-50/50 resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3.5 rounded-xl bg-[#1C1B1A] text-[#FAF8F5] font-semibold text-sm shadow-md hover:bg-[#2D2B2A] transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Kaydediliyor...' : 'Ürünü Kaydet'}
            </button>
          </div>
        </form>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200/80 space-y-6">
        <h2 className="text-xl font-serif font-semibold text-[#1C1B1A] border-b border-stone-200/60 pb-4 flex items-center justify-between">
          <span>Mevcut Ürünler</span>
          <span className="text-sm font-sans font-normal text-stone-500">
            Toplam {products.length} ürün
          </span>
        </h2>

        {loading ? (
          <div className="text-center py-12 text-stone-400 font-serif animate-pulse">
            Ürünler yükleniyor...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-stone-400 font-serif">
            Veritabanında kayıtlı ürün bulunamadı. Yukarıdaki formdan ekleyebilirsiniz.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-xs font-semibold uppercase tracking-wider text-stone-500">
                  <th className="py-3 px-4">Görsel</th>
                  <th className="py-3 px-4">Ürün Adı (TR / EN / NL)</th>
                  <th className="py-3 px-4">Fiyat</th>
                  <th className="py-3 px-4">Stok</th>
                  <th className="py-3 px-4 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <img
                        src={product.image_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800'}
                        alt={product.title}
                        className="w-12 h-14 object-cover rounded-lg bg-stone-100 border border-stone-200"
                      />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-stone-900">{product.title_tr || product.title}</div>
                      <div className="text-xs text-stone-400 flex gap-2">
                        <span>EN: {product.title_en || '-'}</span>
                        <span>•</span>
                        <span>NL: {product.title_nl || '-'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-stone-900">
                      ₺{product.price?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {product.stock} Adet
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Ürünü Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
