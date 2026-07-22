'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Order } from '@/types/database.types';
import { ShoppingCart, RefreshCw, Clock, User, Mail, Calendar } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setOrders(data as Order[]);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#1C1B1A]">
            Sipariş Yönetimi
          </h1>
          <p className="text-stone-500 text-sm font-light">
            Müşteriler tarafından verilen tüm siparişlerin listesi.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs font-medium hover:bg-stone-50 transition-colors shadow-2xs cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Yenile</span>
        </button>
      </div>

      {/* Orders Table Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200/80 space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#1C1B1A] text-[#C5A059] rounded-xl">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-serif font-semibold text-[#1C1B1A]">
              Tüm Siparişler
            </h2>
          </div>
          <span className="text-sm font-sans font-normal text-stone-500">
            Toplam {orders.length} sipariş kaydı
          </span>
        </div>

        {loading ? (
          <div className="text-center py-16 text-stone-400 font-serif animate-pulse">
            Siparişler yükleniyor...
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 text-stone-400 font-serif">
            Henüz alınan bir sipariş bulunmamaktadır.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-xs font-semibold uppercase tracking-wider text-stone-500">
                  <th className="py-3.5 px-4">Tarih</th>
                  <th className="py-3.5 px-4">Müşteri</th>
                  <th className="py-3.5 px-4">E-posta</th>
                  <th className="py-3.5 px-4">Ürün ID</th>
                  <th className="py-3.5 px-4 text-center">Miktar</th>
                  <th className="py-3.5 px-4">Toplam Tutar</th>
                  <th className="py-3.5 px-4 text-right">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {orders.map((order) => {
                  const dateFormatted = new Date(order.created_at).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <tr key={order.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-4 px-4 text-stone-500 text-xs whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          <span>{dateFormatted}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-semibold text-stone-900 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-stone-400" />
                          <span>{order.customer_name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-stone-600 text-xs whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-stone-400" />
                          <span>{order.customer_email}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono text-xs text-stone-500 max-w-[140px] truncate">
                        {order.product_id}
                      </td>
                      <td className="py-4 px-4 text-center font-semibold text-stone-900">
                        {order.quantity}
                      </td>
                      <td className="py-4 px-4 font-semibold text-[#1C1B1A] whitespace-nowrap">
                        ₺{order.total_price?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span className="capitalize">{order.status || 'Beklemede'}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
