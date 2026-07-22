'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Package, ShoppingCart, LogOut, ShieldCheck, ExternalLink } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setCheckingAuth(false);
      return;
    }

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setIsAuthenticated(false);
        router.push('/admin/login');
      } else {
        setIsAuthenticated(true);
      }
      setCheckingAuth(false);
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session && pathname !== '/admin/login') {
          setIsAuthenticated(false);
          router.push('/admin/login');
        } else if (session) {
          setIsAuthenticated(true);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [pathname, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-stone-100/70 flex items-center justify-center">
        <div className="text-stone-500 font-serif animate-pulse flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
          <span>Admin Dashboard Yükleniyor...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-stone-100/70 text-[#1C1B1A] flex flex-col md:flex-row">
      {/* Desktop Sidebar (md and above) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-stone-200/80 fixed inset-y-0 left-0 z-40 p-6 justify-between shadow-2xs">
        <div className="space-y-8">
          {/* Brand Logo */}
          <Link
            href="/admin/products"
            className="flex items-center gap-2 font-serif text-2xl font-bold text-[#1C1B1A] tracking-wider"
          >
            <span>Book <span className="text-[#C5A059] font-sans font-light italic text-lg">&</span> Case</span>
            <span className="bg-[#1C1B1A] text-[#FAF8F5] text-[9px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full font-sans ml-1">
              Admin
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <Link
              href="/admin/products"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                pathname.startsWith('/admin/products')
                  ? 'bg-[#1C1B1A] text-[#FAF8F5] font-semibold shadow-md'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              <Package className="w-4 h-4 text-[#C5A059]" />
              <span>Ürün Yönetimi</span>
            </Link>

            <Link
              href="/admin/orders"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                pathname.startsWith('/admin/orders')
                  ? 'bg-[#1C1B1A] text-[#FAF8F5] font-semibold shadow-md'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              <ShoppingCart className="w-4 h-4 text-[#C5A059]" />
              <span>Sipariş Yönetimi</span>
            </Link>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="space-y-2 pt-6 border-t border-stone-200/80">
          <Link
            href="/tr"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200/80 text-stone-700 hover:bg-stone-100 text-xs font-medium transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <span>Mağazayı Gör</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
          </Link>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-stone-600 hover:text-rose-600 hover:bg-rose-50 text-xs font-medium transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="md:hidden bg-white border-b border-stone-200/80 px-4 h-14 flex items-center justify-between sticky top-0 z-40 shadow-2xs">
        <Link
          href="/admin/products"
          className="font-serif text-lg font-bold text-[#1C1B1A] tracking-wider"
        >
          Book <span className="text-[#C5A059] italic font-sans font-light">&</span> Case <span className="text-xs bg-[#1C1B1A] text-white px-2 py-0.5 rounded-full font-sans font-normal ml-1">Admin</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/tr"
            target="_blank"
            className="p-2 text-stone-500 hover:text-[#C5A059]"
            title="Mağazayı Gör"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>

          <button
            onClick={handleSignOut}
            className="p-2 text-stone-500 hover:text-rose-600 cursor-pointer"
            title="Çıkış Yap"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-10 pb-24 md:pb-10">
        {children}
      </main>

      {/* Mobile Bottom Tab Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-stone-200/80 px-6 py-2 flex justify-around items-center shadow-lg">
        <Link
          href="/admin/products"
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-colors cursor-pointer ${
            pathname.startsWith('/admin/products')
              ? 'text-[#1C1B1A] font-bold'
              : 'text-stone-400 hover:text-stone-700'
          }`}
        >
          <Package className="w-5 h-5 text-[#C5A059]" />
          <span className="text-[11px]">Ürünler</span>
        </Link>

        <Link
          href="/admin/orders"
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-colors cursor-pointer ${
            pathname.startsWith('/admin/orders')
              ? 'text-[#1C1B1A] font-bold'
              : 'text-stone-400 hover:text-stone-700'
          }`}
        >
          <ShoppingCart className="w-5 h-5 text-[#C5A059]" />
          <span className="text-[11px]">Siparişler</span>
        </Link>
      </nav>
    </div>
  );
}
