'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Order } from '@/types/database.types';
import { ShoppingCart, RefreshCw, Clock, User, Mail, Calendar, CheckCircle2, Truck, AlertCircle, XCircle } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);

    try {
      const { error } = await (supabase.from('orders') as any)
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) {
        alert(`Durum güncelleme hatası: ${error.message}`);
      } else {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err: any) {
      console.error('Status update error:', err);
    } finally {
      setUpdatingId(null);
    }
  };

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
      case 'cancelled':
        return {
          label: 'İptal Edildi',
          classes: 'bg-rose-50 text-rose-800 border-rose-200',
          icon: <XCircle className="w-3.5 h-3.5 text-rose-600" />
        };
      default:
        return {
          label: 'Bekliyor',
          classes: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: <Clock className="w-3.5 h-3.5 text-amber-600" />
        };
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1B1A]">
            Sipariş Yönetimi
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm font-light">
            Gelen siparişlerin durumlarını görüntüleyin ve güncelleyin.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs font-medium hover:bg-stone-50 transition-colors shadow-2xs cursor-pointer min-h-[44px]"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Siparişleri Yenile</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-stone-400 font-serif animate-pulse">
          Siparişler yükleniyor...
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center text-stone-400 font-serif border border-stone-200/80">
          Henüz alınan bir sipariş bulunmamaktadır.
        </div>
      ) : (
        <>
          {/* Mobile Order Cards View (hidden on md and up) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {orders.map((order) => {
              const badge = getStatusBadge(order.status);
              const dateFormatted = new Date(order.created_at).toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      <span>{dateFormatted}</span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.classes}`}
                    >
                      {badge.icon}
                      <span>{badge.label}</span>
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm font-bold text-stone-900">
                      <User className="w-4 h-4 text-[#C5A059]" />
                      <span>{order.customer_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <Mail className="w-3.5 h-3.5 text-stone-400" />
                      <span>{order.customer_email}</span>
                    </div>
                  </div>

                  <div className="bg-stone-50 rounded-xl p-3 text-xs space-y-1 border border-stone-200/60">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Ürün ID:</span>
                      <span className="font-mono text-stone-700 max-w-[150px] truncate">{order.product_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Miktar:</span>
                      <span className="font-semibold text-stone-900">{order.quantity} Adet</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-[#1C1B1A] pt-1 border-t border-stone-200/50">
                      <span>Toplam:</span>
                      <span className="text-[#C5A059]">
                        ₺{order.total_price?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {/* Status Select Input */}
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1">
                      Sipariş Durumunu Güncelle
                    </label>
                    <select
                      value={order.status || 'pending'}
                      disabled={updatingId === order.id}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-xs font-semibold text-stone-800 outline-none focus:border-[#C5A059] min-h-[40px] cursor-pointer"
                    >
                      <option value="pending">Bekliyor (Pending)</option>
                      <option value="shipped">Kargolandı (Shipped)</option>
                      <option value="completed">Tamamlandı (Completed)</option>
                      <option value="cancelled">İptal Edildi (Cancelled)</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View (hidden on mobile) */}
          <div className="hidden md:block bg-white rounded-3xl p-6 shadow-xs border border-stone-200/80">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 text-xs font-semibold uppercase tracking-wider text-stone-500">
                    <th className="py-3.5 px-4">Tarih</th>
                    <th className="py-3.5 px-4">Müşteri</th>
                    <th className="py-3.5 px-4">E-posta</th>
                    <th className="py-3.5 px-4">Ürün ID</th>
                    <th className="py-3.5 px-4 text-center">Adet</th>
                    <th className="py-3.5 px-4">Toplam Tutar</th>
                    <th className="py-3.5 px-4 text-right">Sipariş Durumu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-sm">
                  {orders.map((order) => {
                    const badge = getStatusBadge(order.status);
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
                          {dateFormatted}
                        </td>
                        <td className="py-4 px-4 font-semibold text-stone-900 whitespace-nowrap">
                          {order.customer_name}
                        </td>
                        <td className="py-4 px-4 text-stone-600 text-xs whitespace-nowrap">
                          {order.customer_email}
                        </td>
                        <td className="py-4 px-4 font-mono text-xs text-stone-500 max-w-[120px] truncate">
                          {order.product_id}
                        </td>
                        <td className="py-4 px-4 text-center font-semibold text-stone-900">
                          {order.quantity}
                        </td>
                        <td className="py-4 px-4 font-semibold text-[#1C1B1A] whitespace-nowrap">
                          ₺{order.total_price?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          <select
                            value={order.status || 'pending'}
                            disabled={updatingId === order.id}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="px-3 py-1.5 rounded-xl border border-stone-300 bg-stone-50 text-xs font-semibold text-stone-800 outline-none focus:border-[#C5A059] cursor-pointer"
                          >
                            <option value="pending">Bekliyor</option>
                            <option value="shipped">Kargolandı</option>
                            <option value="completed">Tamamlandı</option>
                            <option value="cancelled">İptal Edildi</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
