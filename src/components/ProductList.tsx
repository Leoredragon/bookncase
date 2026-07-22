import { supabase } from '@/lib/supabase';
import { Product } from '@/types/database.types';
import ProductCard from './ProductCard';

const DEMO_PRODUCTS: Product[] = [
  {
    id: 'demo-1',
    title: 'Vintage Deri Seyahat Defteri',
    title_tr: 'Vintage Deri Seyahat Defteri',
    title_en: 'Vintage Leather Travel Journal',
    title_nl: 'Vintage Leren Reisdagboek',
    description: 'Hakiki İtalyan derisinden el işçiliği ile üretilmiş, dolma kalem dostu 120gr fildişi kağıt.',
    description_tr: 'Hakiki İtalyan derisinden el işçiliği ile üretilmiş, dolma kalem dostu 120gr fildişi kağıt.',
    description_en: 'Crafted from genuine Italian leather with fountain pen friendly 120gsm ivory paper.',
    description_nl: 'Gemaakt van echt Italiaans leer met vulpenvriendelijk 120 grams ivoorpapier.',
    price: 850,
    image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1000',
    stock: 25,
    created_at: new Date().toISOString()
  },
  {
    id: 'demo-2',
    title: 'Minimalist Keten Kapaklı Ajanda',
    title_tr: 'Minimalist Keten Kapaklı Ajanda',
    title_en: 'Minimalist Linen Cover Planner',
    title_nl: 'Minimalistische Linnen Planner',
    description: 'Keten dokulu sert kapak ve zamansız tarihsiz planlayıcı tasarımı.',
    description_tr: 'Keten dokulu sert kapak ve zamansız tarihsiz planlayıcı tasarımı.',
    description_en: 'Ideal for your daily thoughts with linen textured hard cover and undated layout.',
    description_nl: 'Ideaal voor uw dagelijkse gedachten met linnen textuur kaft en ongedateerde indeling.',
    price: 600,
    image_url: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=1000',
    stock: 50,
    created_at: new Date().toISOString()
  },
  {
    id: 'demo-3',
    title: 'Sınırlı Üretim Altın Varaklı Defter',
    title_tr: 'Sınırlı Üretim Altın Varaklı Defter',
    title_en: 'Limited Edition Gold Foil Notebook',
    title_nl: 'Limited Edition Goudfolie Notitieboek',
    description: 'Siyah mat kapak üzerine altın varak detaylar ve dikişli iç yapısı.',
    description_tr: 'Siyah mat kapak üzerine altın varak detaylar ve dikişli iç yapısı.',
    description_en: 'Gold foil details on a matte black cover with stitched spine.',
    description_nl: 'Goudfolie details op een matzwarte kaft met genaaide rug.',
    price: 1200,
    image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000',
    stock: 10,
    created_at: new Date().toISOString()
  },
  {
    id: 'demo-4',
    title: 'Süet Defter & Tablet Kılıfı',
    title_tr: 'Süet Defter & Tablet Kılıfı',
    title_en: 'Suede Book & Tablet Case',
    title_nl: 'Suède Boek & Tablet Hoes',
    description: 'Yumuşak süet dokusu ve koruyucu iç astarı ile defterleriniz için ideal kılıf.',
    description_tr: 'Yumuşak süet dokusu ve koruyucu iç astarı ile defterleriniz için ideal kılıf.',
    description_en: 'Ideal protective case for your notebooks with soft suede texture.',
    description_nl: 'Ideale beschermhoes voor uw notitieboeken met zachte suède textuur.',
    price: 850,
    image_url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=1000',
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
