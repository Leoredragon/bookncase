'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { supabase } from '@/lib/supabase';
import { Link, useRouter } from '@/navigation';
import { Mail, Lock, ArrowRight, User as UserIcon } from 'lucide-react';

export default function CustomerRegisterPage() {
  const t = useTranslations('Auth');
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim()
          }
        }
      });

      if (error) {
        setErrorMsg(error.message || 'Kayıt işlemi başarısız. Lütfen tekrar deneyin.');
      } else if (data.session) {
        router.push('/');
      } else {
        router.push('/login');
      }
    } catch {
      setErrorMsg('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-md mx-auto flex items-center justify-center">
      <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-stone-200/80 space-y-8 w-full">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1C1B1A] text-[#FAF8F5] text-[10px] font-semibold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
            <span>BOOK N CASE ATELIER</span>
          </div>

          <h1 className="text-3xl font-serif font-bold text-[#1C1B1A]">
            {t('registerTitle')}
          </h1>
          <p className="text-stone-500 text-sm font-light">
            {t('registerSubtitle')}
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
              {t('fullName')}
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-stone-400 absolute left-4 top-4" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Örn: Ahmet Yılmaz"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-stone-300 focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 outline-none text-sm bg-stone-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
              {t('email')}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-4 top-4" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@domain.com"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-stone-300 focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 outline-none text-sm bg-stone-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
              {t('password')}
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
            <span>{loading ? 'Kayıt Olunuyor...' : t('registerButton')}</span>
            <ArrowRight className="w-4 h-4 text-[#C5A059]" />
          </button>
        </form>

        <div className="text-center pt-4 border-t border-stone-100 text-xs text-stone-500">
          <span>{t('hasAccount')} </span>
          <Link href="/login" className="font-semibold text-[#1C1B1A] underline hover:text-[#C5A059]">
            {t('signInLink')}
          </Link>
        </div>
      </div>
    </main>
  );
}
