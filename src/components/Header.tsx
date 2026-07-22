'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export default function Header() {
  const t = useTranslations('Header');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  const getTotalItems = useCartStore((state) => state.getTotalItems);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalItems = mounted ? getTotalItems() : 0;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FAF8F5]/90 backdrop-blur-md shadow-xs border-b border-stone-200/60 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
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
              href="/#about"
              className="text-stone-700 hover:text-[#C5A059] transition-colors duration-200"
            >
              {t('about')}
            </Link>
            <Link
              href="/#contact"
              className="text-stone-700 hover:text-[#C5A059] transition-colors duration-200"
            >
              {t('contact')}
            </Link>
          </nav>

          {/* Right Actions: Language Switcher + Cart + Mobile Toggle */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            {/* Cart Button linking to Checkout */}
            <Link
              href="/checkout"
              aria-label={t('cart')}
              className="relative p-2 rounded-full text-[#1C1B1A] hover:bg-stone-200/50 transition-colors flex items-center justify-center cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 ? (
                <span className="absolute -top-1 -right-1 bg-[#1C1B1A] text-[#FAF8F5] text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center border border-[#FAF8F5] shadow-xs">
                  {totalItems}
                </span>
              ) : (
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#C5A059] rounded-full animate-pulse"></span>
              )}
            </Link>

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

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-x-0 top-[64px] bg-[#FAF8F5]/98 backdrop-blur-xl z-40 md:hidden flex flex-col justify-between p-6 transition-all duration-300 ease-in-out border-b border-stone-200/80 ${
          isMobileMenuOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto h-[calc(100vh-64px)]'
            : 'opacity-0 -translate-y-4 pointer-events-none h-0 overflow-hidden'
        }`}
      >
        <nav className="flex flex-col gap-6 text-center pt-10">
          <Link
            href="/#collections"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-2xl font-serif text-[#1C1B1A] hover:text-[#C5A059] transition-colors"
          >
            {t('collections')}
          </Link>
          <Link
            href="/#about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-2xl font-serif text-[#1C1B1A] hover:text-[#C5A059] transition-colors"
          >
            {t('about')}
          </Link>
          <Link
            href="/#contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-2xl font-serif text-[#1C1B1A] hover:text-[#C5A059] transition-colors"
          >
            {t('contact')}
          </Link>
          <Link
            href="/checkout"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-2xl font-serif text-[#C5A059] hover:text-[#1C1B1A] transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-6 h-6" />
            <span>{t('cart')} ({totalItems})</span>
          </Link>
        </nav>

        <div className="flex flex-col items-center gap-6 pb-12 border-t border-stone-200/60 pt-6">
          <LanguageSwitcher />
          <p className="text-xs text-stone-500 font-mono tracking-widest uppercase">
            Book n Case • Handcrafted Luxury
          </p>
        </div>
      </div>
    </header>
  );
}
