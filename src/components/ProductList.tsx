import { supabase } from '@/lib/supabase';
import { Product } from '@/types/database.types';
import ProductCard from './ProductCard';

const DEMO_PRODUCTS: Product[] = [
  {
    id: 'demo-1',
    title: 'El Yapımı Deri A5 Defter',
    title_tr: 'El Yapımı Deri A5 Defter',
    title_en: 'Handcrafted Leather A5 Notebook',
    title_nl: 'Handgemaakt Leren A5 Notitieboek',
    description: 'Hakiki İtalyan derisinden üretilmiş, dolma kalem dostu 120gr fildişi kağıt.',
    description_tr: 'Hakiki İtalyan derisinden üretilmiş, dolma kalem dostu 120gr fildişi kağıt.',
    description_en: 'Crafted from genuine Italian leather with fountain pen friendly 120gsm ivory paper.',
    description_nl: 'Gemaakt van echt Italiaans leer met vulpenvriendelijk 120 grams ivoorpapier.',
    price: 650,
    image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
    stock: 12,
    created_at: new Date().toISOString()
  },
  {
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
    image_url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800',
    stock: 8,
    created_at: new Date().toISOString()
  },
  {
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
    image_url: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&q=80&w=800',
    stock: 5,
    created_at: new Date().toISOString()
  },
  {
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
    image_url: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=800',
    stock: 15,
    created_at: new Date().toISOString()
  }
];

export default async function ProductList() {
  let products: Product[] = [];

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      products = DEMO_PRODUCTS;
    } else {
      products = data as Product[];
    }
  } catch {
    products = DEMO_PRODUCTS;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
