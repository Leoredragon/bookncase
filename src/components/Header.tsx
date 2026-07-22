'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import SearchModal from './SearchModal';
import { ShoppingBag, Heart, User, Search, Menu, X, LogOut, Package } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { supabase } from '@/lib/supabase';

export default function Header() {
  const t = useTranslations('Header');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const wishlistItems = useWishlistStore((state) => state.items);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Check user auth session
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserEmail(data.user?.email || null);
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setUserEmail(session?.user?.email || null);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      authListener.subscription.unsubscribe();
    };
  }, []);

  const totalCartItems = mounted ? getTotalItems() : 0;
  const totalWishlistItems = mounted ? wishlistItems.length : 0;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUserEmail(null);
    setIsUserMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAF8F5]/85 backdrop-blur-md shadow-xs border-b border-stone-200/60 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <Link
              href="/"
              className="group flex items-center gap-2 text-2xl sm:text-3xl font-serif font-bold tracking-wider text-[#1C1B1A] transition-colors"
            >
              <span>Book <span className="text-[#C5A059] font-sans font-light text-xl italic">&</span> Case</span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
              <Link
                href="/#collections"
                className="text-stone-700 hover:text-[#C5A059] transition-colors duration-200"
              >
                {t('collections')}
              </Link>
              <Link
                href="/about"
                className="text-stone-700 hover:text-[#C5A059] transition-colors duration-200"
              >
                {t('about')}
              </Link>
              <Link
                href="/contact"
                className="text-stone-700 hover:text-[#C5A059] transition-colors duration-200"
              >
                {t('contact')}
              </Link>
            </nav>

            {/* Right Side Icons & Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>

              {/* Search Icon */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-full text-[#1C1B1A] hover:bg-stone-200/50 transition-colors cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-stone-700 hover:text-[#C5A059]" />
              </button>

              {/* Wishlist Heart Icon */}
              <Link
                href="/wishlist"
                aria-label={t('wishlist')}
                className="relative p-2 rounded-full text-[#1C1B1A] hover:bg-stone-200/50 transition-colors flex items-center justify-center cursor-pointer"
              >
                <Heart className="w-5 h-5 text-stone-700 hover:text-rose-600" />
                {totalWishlistItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center border border-[#FAF8F5]">
                    {totalWishlistItems}
                  </span>
                )}
              </Link>

              {/* Cart Icon */}
              <Link
                href="/checkout"
                aria-label={t('cart')}
                className="relative p-2 rounded-full text-[#1C1B1A] hover:bg-stone-200/50 transition-colors flex items-center justify-center cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5 text-stone-700 hover:text-[#1C1B1A]" />
                {totalCartItems > 0 ? (
                  <span className="absolute -top-1 -right-1 bg-[#1C1B1A] text-[#FAF8F5] text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center border border-[#FAF8F5]">
                    {totalCartItems}
                  </span>
                ) : (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#C5A059] rounded-full animate-pulse"></span>
                )}
              </Link>

              {/* Customer User Account Dropdown / Link */}
              <div className="relative">
                {userEmail ? (
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="p-2 rounded-full text-[#1C1B1A] hover:bg-stone-200/50 transition-colors flex items-center justify-center cursor-pointer border border-[#C5A059]/40 bg-[#C5A059]/10"
                    aria-label="User account"
                  >
                    <User className="w-5 h-5 text-[#C5A059]" />
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="p-2 rounded-full text-[#1C1B1A] hover:bg-stone-200/50 transition-colors flex items-center justify-center cursor-pointer"
                    aria-label="Sign in"
                  >
                    <User className="w-5 h-5 text-stone-700 hover:text-[#C5A059]" />
                  </Link>
                )}

                {/* User Dropdown */}
                {userEmail && isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 space-y-1 z-50">
                    <div className="px-3 py-2 border-b border-stone-100">
                      <p className="text-[10px] text-stone-400 uppercase font-semibold">Giriş Yapıldı</p>
                      <p className="text-xs font-semibold text-stone-800 truncate">{userEmail}</p>
                    </div>
                    <Link
                      href="/profile/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-stone-700 hover:bg-stone-100 transition-colors"
                    >
                      <Package className="w-4 h-4 text-[#C5A059]" />
                      <span>Sipariş Geçmişim</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Çıkış Yap</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-[#1C1B1A] hover:bg-stone-200/50 rounded-lg transition-colors cursor-pointer"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <div
          className={`fixed inset-x-0 top-[64px] bg-[#FAF8F5]/98 backdrop-blur-xl z-40 md:hidden flex flex-col justify-between p-6 transition-all duration-300 ease-in-out border-b border-stone-200/80 ${
            isMobileMenuOpen
              ? 'opacity-100 translate-y-0 pointer-events-auto h-[calc(100vh-64px)]'
              : 'opacity-0 -translate-y-4 pointer-events-none h-0 overflow-hidden'
          }`}
        >
          <nav className="flex flex-col gap-6 text-center pt-8">
            <Link
              href="/#collections"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-serif text-[#1C1B1A] hover:text-[#C5A059] transition-colors"
            >
              {t('collections')}
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-serif text-[#1C1B1A] hover:text-[#C5A059] transition-colors"
            >
              {t('about')}
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-serif text-[#1C1B1A] hover:text-[#C5A059] transition-colors"
            >
              {t('contact')}
            </Link>
            <Link
              href="/wishlist"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-serif text-[#1C1B1A] hover:text-[#C5A059] transition-colors flex items-center justify-center gap-2"
            >
              <Heart className="w-6 h-6 text-rose-600" />
              <span>{t('wishlist')} ({totalWishlistItems})</span>
            </Link>
            <Link
              href="/checkout"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-serif text-[#C5A059] hover:text-[#1C1B1A] transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-6 h-6" />
              <span>{t('cart')} ({totalCartItems})</span>
            </Link>
            {userEmail ? (
              <Link
                href="/profile/orders"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl font-serif text-stone-800 hover:text-[#C5A059] transition-colors"
              >
                Hesabım & Siparişlerim
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl font-serif text-stone-800 hover:text-[#C5A059] transition-colors"
              >
                {t('login')}
              </Link>
            )}
          </nav>

          <div className="flex flex-col items-center gap-6 pb-12 border-t border-stone-200/60 pt-6">
            <LanguageSwitcher />
            <p className="text-xs text-stone-500 font-mono tracking-widest uppercase">
              Book n Case • Luxury Handcrafted
            </p>
          </div>
        </div>
      </header>

      {/* Search Overlay Modal Component */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
