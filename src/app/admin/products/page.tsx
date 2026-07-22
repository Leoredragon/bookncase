'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types/database.types';
import { Plus, Trash2, Edit3, Image as ImageIcon, CheckCircle, RefreshCw, X, Images } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
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
  };

  const openAddModal = () => {
    resetForm();
    setEditingProduct(null);
    setIsAddOpen(true);
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
    setIsAddOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleTr.trim() || !price) return;

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
        // Update existing product
        const { error } = await (supabase.from('products') as any)
          .update(payload)
          .eq('id', editingProduct.id);

        if (error) {
          alert(`Güncelleme hatası: ${error.message}`);
        } else {
          setSuccessMsg('Ürün başarıyla güncellendi!');
          setIsAddOpen(false);
          fetchProducts();
        }
      } else {
        // Create new product
        const { error } = await (supabase.from('products') as any).insert([payload]);

        if (error) {
          alert(`Ekleme hatası: ${error.message}`);
        } else {
          setSuccessMsg('Yeni ürün başarıyla eklendi!');
          setIsAddOpen(false);
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

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1B1A]">
            Ürün Yönetimi
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm font-light">
            Ürün kataloğunuzu ekleyin, düzenleyin ve güncelleyin.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={fetchProducts}
            className="p-3 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs font-medium hover:bg-stone-50 transition-colors shadow-2xs cursor-pointer"
            title="Yenile"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={openAddModal}
            className="flex-1 sm:flex-none py-3 px-5 rounded-xl bg-[#1C1B1A] text-[#FAF8F5] font-semibold text-xs sm:text-sm shadow-md hover:bg-[#2D2B2A] transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
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

      {/* Product List Content */}
      {loading ? (
        <div className="text-center py-16 text-stone-400 font-serif animate-pulse">
          Ürünler yükleniyor...
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center text-stone-400 font-serif border border-stone-200/80">
          Kayıtlı ürün bulunamadı. "Yeni Ürün Ekle" butonuna basarak ekleyebilirsiniz.
        </div>
      ) : (
        <>
          {/* Mobile Card View (hidden on md and up) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs flex gap-4 items-center"
              >
                <img
                  src={p.image_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400'}
                  alt={p.title}
                  className="w-20 h-24 object-cover rounded-xl bg-stone-100 shrink-0 border border-stone-200"
                />

                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="font-serif font-bold text-base text-[#1C1B1A] truncate">
                    {p.title_tr || p.title}
                  </h3>
                  <div className="text-xs text-stone-500 font-semibold">
                    ₺{p.price?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[11px] text-stone-400">
                    Stok: <span className="font-medium text-stone-700">{p.stock} adet</span>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="px-3 py-1.5 rounded-lg bg-stone-100 text-stone-800 hover:bg-stone-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer min-h-[36px]"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Düzenle</span>
                    </button>

                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs cursor-pointer min-h-[36px]"
                      title="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View (hidden on mobile) */}
          <div className="hidden md:block bg-white rounded-3xl p-6 shadow-xs border border-stone-200/80">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 text-xs font-semibold uppercase tracking-wider text-stone-500">
                    <th className="py-3.5 px-4">Görsel</th>
                    <th className="py-3.5 px-4">Ürün Adı</th>
                    <th className="py-3.5 px-4">Fiyat</th>
                    <th className="py-3.5 px-4">Stok</th>
                    <th className="py-3.5 px-4 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-sm">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <img
                          src={p.image_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400'}
                          alt={p.title}
                          className="w-12 h-14 object-cover rounded-lg bg-stone-100 border border-stone-200"
                        />
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-stone-900">{p.title_tr || p.title}</div>
                        <div className="text-xs text-stone-400">
                          EN: {p.title_en || '-'} | NL: {p.title_nl || '-'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-stone-900">
                        ₺{p.price?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          p.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {p.stock} Adet
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                            title="Düzenle"
                          >
                            <Edit3 className="w-4 h-4 text-[#C5A059]" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Add / Edit Form Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-200/60 pb-4">
              <h2 className="text-xl font-serif font-bold text-[#1C1B1A]">
                {editingProduct ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
              </h2>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-2 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Multilingual Titles */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                  Ürün Adları (TR / EN / NL)
                </label>
                <input
                  type="text"
                  required
                  value={titleTr}
                  onChange={(e) => setTitleTr(e.target.value)}
                  placeholder="Başlık (Türkçe) *"
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm bg-stone-50/50"
                />
                <input
                  type="text"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="Başlık (İngilizce)"
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm bg-stone-50/50"
                />
                <input
                  type="text"
                  value={titleNl}
                  onChange={(e) => setTitleNl(e.target.value)}
                  placeholder="Başlık (Flemenkçe)"
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm bg-stone-50/50"
                />
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                    Fiyat (TL) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="650"
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm bg-stone-50/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                    Stok Adedi
                  </label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="10"
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm bg-stone-50/50"
                  />
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                  Ana Görsel URL
                </label>
                <div className="relative">
                  <ImageIcon className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 text-sm bg-stone-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1 flex items-center gap-1">
                  <Images className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Galeri Görselleri (Virgülle ayrılmış URL'ler)</span>
                </label>
                <textarea
                  rows={2}
                  value={galleryText}
                  onChange={(e) => setGalleryText(e.target.value)}
                  placeholder="https://img1.jpg, https://img2.jpg"
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 text-xs font-mono bg-stone-50/50 resize-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                  Açıklama (TR)
                </label>
                <textarea
                  rows={2}
                  value={descTr}
                  onChange={(e) => setDescTr(e.target.value)}
                  placeholder="Ürün açıklaması..."
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm bg-stone-50/50 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200/60">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-6 py-3 rounded-xl bg-stone-100 text-stone-700 text-sm font-medium hover:bg-stone-200 cursor-pointer min-h-[44px]"
                >
                  İptal
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 rounded-xl bg-[#1C1B1A] text-[#FAF8F5] font-semibold text-sm hover:bg-[#2D2B2A] transition-all cursor-pointer min-h-[44px] disabled:opacity-50"
                >
                  {submitting ? 'Kaydediliyor...' : editingProduct ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
