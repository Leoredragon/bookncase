'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) {
        setErrorMsg(error.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
      } else if (data.session) {
        router.push('/admin/products');
      }
    } catch {
      setErrorMsg('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-stone-200/80 space-y-8">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-[#1C1B1A] text-[#C5A059] rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#1C1B1A]">
            Admin Paneli
          </h1>
          <p className="text-stone-500 text-sm font-light">
            Book n Case yönetim sistemine erişmek için giriş yapın.
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
              E-posta Adresi
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-4 top-4" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bookncase.com"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-stone-300 focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 outline-none text-sm bg-stone-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
              Şifre
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-4 top-4" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-stone-300 focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 outline-none text-sm bg-stone-50/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-2xl bg-[#1C1B1A] text-[#FAF8F5] font-semibold text-sm shadow-xl hover:bg-[#2D2B2A] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}</span>
            <ArrowRight className="w-4 h-4 text-[#C5A059]" />
          </button>
        </form>
      </div>
    </main>
  );
}
