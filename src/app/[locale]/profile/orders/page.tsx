'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { supabase } from '@/lib/supabase';
import { Order } from '@/types/database.types';
import { Link, useRouter } from '@/navigation';
import { Package, Clock, CheckCircle2, Truck, ArrowLeft, Mail, User, ShieldCheck } from 'lucide-react';

export default function CustomerOrdersPage() {
  const t = useTranslations('Profile');
  const router = useRouter();

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDataAndOrders = async () => {
      setLoading(true);
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push('/login');
        return;
      }

      const email = data.user.email || '';
      setUserEmail(email);
      setUserName(data.user.user_metadata?.full_name || email.split('@')[0]);

      try {
        const { data: orderData, error } = await supabase
          .from('orders')
          .select('*')
          .eq('customer_email', email)
          .order('created_at', { ascending: false });

        if (!error && orderData) {
          setOrders(orderData as Order[]);
        }
      } catch (err) {
        console.error('Error fetching customer orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDataAndOrders();
  }, [router]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          label: 'Tamamlandı',
          classes: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        };
      case 'shipped':
        return {
          label: 'Kargolandı',
          classes: 'bg-blue-50 text-blue-800 border-blue-200',
          icon: <Truck className="w-3.5 h-3.5 text-blue-600" />
        };
      default:
        return {
          label: 'Hazırlanıyor / Bekliyor',
          classes: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: <Clock className="w-3.5 h-3.5 text-amber-600" />
        };
    }
  };

  return (
    <main className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1B1A] text-[#FAF8F5] text-[10px] font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Müşteri Hesabı</span>
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
          <span>Alışverişe Devam Et</span>
        </Link>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#1C1B1A] text-[#C5A059] rounded-2xl flex items-center justify-center font-serif text-xl font-bold">
            {userName ? userName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-stone-900">{userName}</h3>
            <p className="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-stone-400" />
              <span>{userEmail}</span>
            </p>
          </div>
        </div>

        <div className="text-xs text-stone-500 bg-stone-50 px-4 py-2 rounded-xl border border-stone-200/60">
          Toplam Sipariş: <span className="font-bold text-stone-900">{orders.length} Adet</span>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        <h2 className="text-xl font-serif font-bold text-[#1C1B1A] flex items-center gap-2">
          <Package className="w-5 h-5 text-[#C5A059]" />
          <span>{t('myOrders')}</span>
        </h2>

        {loading ? (
          <div className="text-center py-16 text-stone-400 font-serif animate-pulse">
            Siparişleriniz yükleniyor...
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/80 space-y-4">
            <Package className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className="text-lg font-serif font-semibold text-stone-800">
              {t('noOrders')}
            </h3>
            <Link
              href="/#collections"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1C1B1A] text-[#FAF8F5] rounded-xl text-xs font-semibold hover:bg-[#2D2B2A] transition-colors"
            >
              <span>Koleksiyonu Keşfet</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const badge = getStatusBadge(order.status);
              const dateFormatted = new Date(order.created_at).toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
                    <div>
                      <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                        Sipariş Tarihi: {dateFormatted}
                      </span>
                      <p className="text-xs text-stone-500 font-mono mt-0.5">
                        Kayıt kılıf ID: {order.product_id}
                      </p>
                    </div>

                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.classes}`}>
                      {badge.icon}
                      <span>{badge.label}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="space-y-0.5">
                      <span className="text-stone-500 text-xs">Miktar:</span>
                      <p className="font-semibold text-stone-900">{order.quantity} Adet Ürün</p>
                    </div>

                    <div className="text-right">
                      <span className="text-stone-500 text-xs">Toplam Tutar:</span>
                      <p className="font-bold text-base text-[#1C1B1A]">
                        ₺{order.total_price?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
