import { setRequestLocale } from 'next-intl/server';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types/database.types';
import ProductGallery from '@/components/ProductGallery';
import AddToCartButton from '@/components/AddToCartButton';
import { Link } from '@/navigation';
import { ArrowLeft, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { notFound } from 'next/navigation';

const DEMO_PRODUCTS: Record<string, Product> = {
  'demo-1': {
    id: 'demo-1',
    title: 'El Yapımı Deri A5 Defter',
    title_tr: 'El Yapımı Deri A5 Defter',
    title_en: 'Handcrafted Leather A5 Notebook',
    title_nl: 'Handgemaakt Leren A5 Notitieboek',
    description: 'Hakiki İtalyan derisinden üretilmiş, dolma kalem dostu 120gr fildişi kağıt. Usta zanaatkarlar tarafından geleneksel ciltleme teknikleriyle el dikişi yapılarak hazırlanmıştır.',
    description_tr: 'Hakiki İtalyan derisinden üretilmiş, dolma kalem dostu 120gr fildişi kağıt. Usta zanaatkarlar tarafından geleneksel ciltleme teknikleriyle el dikişi yapılarak hazırlanmıştır.',
    description_en: 'Crafted from genuine Italian leather with fountain pen friendly 120gsm ivory paper. Hand-stitched by master artisans using traditional bookbinding techniques.',
    description_nl: 'Gemaakt van echt Italiaans leer met vulpenvriendelijk 120 grams ivoorpapier. Met de hand gestikt door meester-ambachtslieden met behulp van traditionele inbindtechnieken.',
    price: 650,
    image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000',
    gallery_urls: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=1000'
    ],
    stock: 12,
    created_at: new Date().toISOString()
  },
  'demo-2': {
    id: 'demo-2',
    title: 'Süet Defter & Tablet Kılıfı',
    title_tr: 'Süet Defter & Tablet Kılıfı',
    title_en: 'Suede Book & Tablet Case',
    title_nl: 'Suède Boek & Tablet Hoes',
    description: 'Yumuşak süet dokusu ve koruyucu iç astarı ile defterleriniz ve tabletiniz için ideal.',
    description_tr: 'Yumuşak süet dokusu ve koruyucu iç astarı ile defterleriniz ve tabletiniz için ideal.',
    description_en: 'Ideal for your notebooks and tablet with soft suede texture and protective lining.',
    description_nl: 'Ideaal voor uw notitieboeken en tablet met zachte suède textuur en beschermende voering.',
    price: 850,
    image_url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=1000',
    gallery_urls: [
      'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000'
    ],
    stock: 8,
    created_at: new Date().toISOString()
  },
  'demo-3': {
    id: 'demo-3',
    title: 'Vintage Deri Ajanda',
    title_tr: 'Vintage Deri Ajanda',
    title_en: 'Vintage Leather Planner',
    title_nl: 'Vintage Leren Agenda',
    description: 'Değiştirilebilir iç defter mekanizmasına sahip zamansız bir organizatör.',
    description_tr: 'Değiştirilebilir iç defter mekanizmasına sahip zamansız bir organizatör.',
    description_en: 'A timeless planner featuring a refillable notebook insert system.',
    description_nl: 'Een tijdloze agenda met een navulbaar notitieboeksysteem.',
    price: 920,
    image_url: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&q=80&w=1000',
    gallery_urls: [
      'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&q=80&w=1000'
    ],
    stock: 5,
    created_at: new Date().toISOString()
  },
  'demo-4': {
    id: 'demo-4',
    title: 'Minimalist Deri Kalemlik & Kılıf',
    title_tr: 'Minimalist Deri Kalemlik & Kılıf',
    title_en: 'Minimalist Leather Pen Case',
    title_nl: 'Minimalistische Leren Pen Hoes',
    description: 'Zarif pirinç fermuarı ve el dikişli deri detayları ile özel kalemlik.',
    description_tr: 'Zarif pirinç fermuarı ve el dikişli deri detayları ile özel kalemlik.',
    description_en: 'Special pen case with elegant brass zipper and hand-stitched leather details.',
    description_nl: 'Speciale pennenhoes met elegante koperen rits en handgestikte leren details.',
    price: 390,
    image_url: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=1000',
    gallery_urls: [
      'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=1000'
    ],
    stock: 15,
    created_at: new Date().toISOString()
  }
};

export default async function ProductDetailPage({
  params
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  let product: Product | null = null;

  if (id.startsWith('demo-')) {
    product = DEMO_PRODUCTS[id] || DEMO_PRODUCTS['demo-1'];
  } else {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        product = data as Product;
      } else {
        product = DEMO_PRODUCTS['demo-1'];
      }
    } catch {
      product = DEMO_PRODUCTS['demo-1'];
    }
  }

  if (!product) {
    notFound();
  }

  const localizedTitle =
    (product[`title_${locale}` as keyof Product] as string) ||
    product.title_tr ||
    product.title;

  const localizedDescription =
    (product[`description_${locale}` as keyof Product] as string) ||
    product.description_tr ||
    product.description;

  return (
    <main className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Back Button */}
      <div className="mb-8">
        <Link
          href="/#collections"
          className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-[#1C1B1A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Koleksiyona Dön</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Left Column: Product Gallery */}
        <div className="lg:col-span-7">
          <ProductGallery
            mainImage={product.image_url}
            galleryUrls={product.gallery_urls}
          />
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1C1B1A] text-[#FAF8F5] text-[11px] font-semibold tracking-widest uppercase shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Book n Case Original</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1C1B1A] tracking-tight">
              {localizedTitle}
            </h1>

            <div className="flex items-baseline gap-4 pt-2">
              <span className="text-3xl font-bold text-[#1C1B1A]">
                ₺{product.price?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                product.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              }`}>
                {product.stock > 0 ? `${product.stock} Adet Stokta` : 'Stokta Yok'}
              </span>
            </div>
          </div>

          <div className="border-t border-b border-stone-200/80 py-6 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Ürün Detayları
            </h3>
            <p className="text-stone-700 font-light leading-relaxed text-base">
              {localizedDescription}
            </p>
          </div>

          {/* Add to Cart Button */}
          <AddToCartButton product={product} />

          {/* Value Badges */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-200/60 text-xs text-stone-600">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-100/70 border border-stone-200/60">
              <Truck className="w-4 h-4 text-[#C5A059]" />
              <span>Ücretsiz Hızlı Kargo</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-100/70 border border-stone-200/60">
              <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
              <span>%100 El Yapımı Garantisi</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
