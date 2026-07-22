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
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-stone-500 font-serif animate-pulse flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
          <span>Oturum kontrol ediliyor...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1B1A]">
      {/* Top Admin Header Bar */}
      <header className="bg-[#1C1B1A] text-[#FAF8F5] border-b border-stone-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/admin/products"
              className="flex items-center gap-2 font-serif text-xl font-bold text-[#FAF8F5] tracking-wider"
            >
              <span>Book <span className="text-[#C5A059] font-sans font-light italic text-base">&</span> Case</span>
              <span className="bg-[#C5A059] text-[#1C1B1A] text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full font-sans ml-1">
                Admin
              </span>
            </Link>

            {/* Navigation Tabs */}
            <nav className="hidden sm:flex items-center gap-1 ml-6">
              <Link
                href="/admin/products"
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                  pathname.startsWith('/admin/products')
                    ? 'bg-stone-800 text-[#C5A059] font-semibold'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Ürünler</span>
              </Link>
              <Link
                href="/admin/orders"
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                  pathname.startsWith('/admin/orders')
                    ? 'bg-stone-800 text-[#C5A059] font-semibold'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Siparişler</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/tr"
              target="_blank"
              className="hidden md:inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-[#C5A059] transition-colors"
            >
              <span>Siteyi Gör</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleSignOut}
              className="px-3.5 py-2 rounded-xl bg-stone-800 text-stone-300 hover:text-rose-400 hover:bg-stone-700 text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Sub-bar */}
        <div className="sm:hidden flex border-t border-stone-800 bg-stone-900/80 px-4 py-2 gap-2">
          <Link
            href="/admin/products"
            className={`flex-1 text-center py-2 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 ${
              pathname.startsWith('/admin/products')
                ? 'bg-stone-800 text-[#C5A059]'
                : 'text-stone-400'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Ürünler</span>
          </Link>
          <Link
            href="/admin/orders"
            className={`flex-1 text-center py-2 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 ${
              pathname.startsWith('/admin/orders')
                ? 'bg-stone-800 text-[#C5A059]'
                : 'text-stone-400'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Siparişler</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
