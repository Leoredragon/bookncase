'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useCartStore } from '@/store/useCartStore';
import { supabase } from '@/lib/supabase';
import { Link } from '@/navigation';
import { Trash2, Plus, Minus, CheckCircle, ArrowLeft, ShoppingBag, ShieldCheck } from 'lucide-react';
import { Product } from '@/types/database.types';

export default function CheckoutPage() {
  const t = useTranslations('Checkout');
  const locale = useLocale();

  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();

  const [mounted, setMounted] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [placedOrderSummary, setPlacedOrderSummary] = useState({
    name: '',
    email: '',
    total: 0,
    itemCount: 0
  });

  useEffect(() => {
    setMounted(true);

    // Auto-fill logged in user email & name if available
    const fillLoggedInUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        if (data.user.email) setEmail(data.user.email);
        if (data.user.user_metadata?.full_name) {
          setFullName(data.user.user_metadata.full_name);
        }
      }
    };
    fillLoggedInUser();
  }, []);

  if (!mounted) {
    return (
      <main className="min-h-screen pt-32 pb-16 px-4 max-w-7xl mx-auto flex items-center justify-center">
        <div className="text-center font-serif text-stone-500 animate-pulse">
          Yükleniyor...
        </div>
      </main>
    );
  }

  const totalPrice = getTotalPrice();

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0 || !fullName.trim() || !email.trim()) return;

    setIsSubmitting(true);

    try {
      // Prepare records for Supabase orders table
      const orderRecords = items.map((item) => {
        const isDemo = item.product.id.startsWith('demo-');
        const productId = isDemo
          ? '00000000-0000-0000-0000-000000000001'
          : item.product.id;

        return {
          product_id: productId,
          quantity: item.quantity,
          total_price: item.product.price * item.quantity,
          customer_name: fullName.trim(),
          customer_email: email.trim(),
          status: 'pending'
        };
      });

      await (supabase.from('orders') as any).insert(orderRecords);

      setPlacedOrderSummary({
        name: fullName.trim(),
        email: email.trim(),
        total: totalPrice,
        itemCount: items.reduce((acc, i) => acc + i.quantity, 0)
      });

      clearCart();
      setIsOrderPlaced(true);
    } catch (err) {
      console.error('Order creation error:', err);
      setPlacedOrderSummary({
        name: fullName.trim(),
        email: email.trim(),
        total: totalPrice,
        itemCount: items.reduce((acc, i) => acc + i.quantity, 0)
      });
      clearCart();
      setIsOrderPlaced(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. Success Order Placed View
  if (isOrderPlaced) {
    return (
      <main className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto flex flex-col items-center justify-center text-center">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-stone-200/80 space-y-6 w-full">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200 shadow-xs">
            <CheckCircle className="w-10 h-10" />
          </div>

          <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A059] bg-[#C5A059]/10 px-3.5 py-1.5 rounded-full inline-block">
            Book n Case Handcrafted
          </span>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C1B1A]">
            {t('successTitle')}
          </h1>

          <p className="text-stone-600 font-light max-w-md mx-auto leading-relaxed">
            {t('successMessage')}
          </p>

          <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200/60 text-left space-y-3 my-6">
            <div className="flex justify-between text-sm text-stone-600 border-b border-stone-200/60 pb-2">
              <span>{t('fullName')}:</span>
              <span className="font-semibold text-stone-900">{placedOrderSummary.name}</span>
            </div>
            <div className="flex justify-between text-sm text-stone-600 border-b border-stone-200/60 pb-2">
              <span>{t('email')}:</span>
              <span className="font-semibold text-stone-900">{placedOrderSummary.email}</span>
            </div>
            <div className="flex justify-between text-sm text-stone-600 border-b border-stone-200/60 pb-2">
              <span>Ürün Sayısı:</span>
              <span className="font-semibold text-stone-900">{placedOrderSummary.itemCount} Adet</span>
            </div>
            <div className="flex justify-between text-base font-bold text-stone-900 pt-1">
              <span>{t('total')}:</span>
              <span className="text-[#C5A059]">₺{placedOrderSummary.total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <Link
            href="/profile/orders"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#1C1B1A] text-[#FAF8F5] font-medium rounded-2xl shadow-xl hover:bg-[#2D2B2A] transition-all cursor-pointer"
          >
            <span>Siparişlerimi Görüntüle</span>
          </Link>
        </div>
      </main>
    );
  }

  // 2. Empty Cart View
  if (items.length === 0) {
    return (
      <main className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto flex flex-col items-center justify-center text-center">
        <div className="bg-white rounded-3xl p-10 shadow-xl border border-stone-200/80 space-y-6 w-full">
          <div className="w-20 h-20 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#1C1B1A]">
            {t('emptyCart')}
          </h1>
          <p className="text-stone-500 font-light">
            Koleksiyonumuzdaki el yapımı defter ve kılıfları keşfederek alışverişe başlayın.
          </p>
          <Link
            href="/#collections"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#1C1B1A] text-[#FAF8F5] font-medium rounded-2xl shadow-lg hover:bg-[#2D2B2A] transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#C5A059]" />
            <span>{t('continueShopping')}</span>
          </Link>
        </div>
      </main>
    );
  }

  // 3. Checkout Form & Cart Items View
  return (
    <main className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Back Button & Title */}
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-[#1C1B1A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('continueShopping')}</span>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C1B1A]">
          {t('title')}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Side: Cart Items List & Summary */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200/80 space-y-6">
            <h2 className="text-xl font-serif font-semibold text-[#1C1B1A] border-b border-stone-200/60 pb-4 flex items-center justify-between">
              <span>{t('cartSummary')}</span>
              <span className="text-sm font-sans font-normal text-stone-500">
                {items.length} ürün
              </span>
            </h2>

            {/* Item Rows */}
            <div className="divide-y divide-stone-100">
              {items.map(({ product, quantity }) => {
                const localizedTitle =
                  (product[`title_${locale}` as keyof Product] as string) ||
                  product.title_tr ||
                  product.title;

                return (
                  <div key={product.id} className="py-4 flex gap-4 items-center">
                    <img
                      src={
                        product.image_url ||
                        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800'
                      }
                      alt={localizedTitle}
                      className="w-20 h-24 object-cover rounded-xl bg-stone-100 shrink-0 border border-stone-200/60"
                    />

                    <div className="flex-1 min-w-0 space-y-1">
                      <h3 className="font-serif font-semibold text-base text-[#1C1B1A] truncate">
                        {localizedTitle}
                      </h3>
                      <p className="text-sm text-stone-500 font-medium">
                        ₺{product.price?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 pt-2">
                        <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="p-1 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                            aria-label="Azalt"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-semibold text-stone-800">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="p-1 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                            aria-label="Artır"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(product.id)}
                          className="p-1 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                          aria-label="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="text-right font-semibold text-base text-[#1C1B1A]">
                      ₺{(product.price * quantity).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Calculations */}
            <div className="border-t border-stone-200/60 pt-4 space-y-3">
              <div className="flex justify-between text-sm text-stone-600">
                <span>{t('subtotal')}</span>
                <span>₺{totalPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm text-stone-600">
                <span>{t('shipping')}</span>
                <span className="text-emerald-700 font-medium">{t('free')}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-[#1C1B1A] border-t border-stone-200/60 pt-3">
                <span>{t('total')}</span>
                <span className="text-[#C5A059]">₺{totalPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Customer Details & Submit Form */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200/80 sticky top-28 space-y-6">
            <div className="flex items-center gap-3 border-b border-stone-200/60 pb-4">
              <ShieldCheck className="w-6 h-6 text-[#C5A059]" />
              <h2 className="text-xl font-serif font-semibold text-[#1C1B1A]">
                {t('customerDetails')}
              </h2>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                  {t('fullName')} *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Örn: Ahmet Yılmaz"
                  className="w-full px-4 py-3.5 rounded-xl border border-stone-300 focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 outline-none transition-all text-sm bg-stone-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                  {t('email')} *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Örn: ahmet@example.com"
                  className="w-full px-4 py-3.5 rounded-xl border border-stone-300 focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 outline-none transition-all text-sm bg-stone-50/50"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-2xl bg-[#1C1B1A] text-[#FAF8F5] font-semibold text-base shadow-xl hover:bg-[#2D2B2A] transition-all duration-200 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
                >
                  {isSubmitting ? t('placingOrder') : t('placeOrder')}
                </button>
              </div>

              <p className="text-[11px] text-stone-400 text-center leading-relaxed">
                Siparişinizi tamamlayarak kullanım koşullarını ve gizlilik politikasını kabul etmiş olursunuz.
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
