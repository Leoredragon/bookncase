export interface Product {
  id: string;
  title: string;
  title_tr?: string;
  title_en?: string;
  title_nl?: string;
  description: string;
  description_tr?: string;
  description_en?: string;
  description_nl?: string;
  price: number;
  image_url: string;
  stock: number;
  created_at: string;
}

export interface Order {
  id: string;
  product_id: string;
  quantity: number;
  total_price: number;
  customer_name: string;
  customer_email: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | string;
  created_at: string;
}

export type Database = {
  public: {
    Tables: {
      products: {
        Row: Product;
        Insert: Partial<Product> & { title: string; price: number };
        Update: Partial<Product>;
        Relationships: [];
      };
      orders: {
        Row: Order;
        Insert: Partial<Order> & { product_id: string; quantity: number; total_price: number; customer_name: string; customer_email: string };
        Update: Partial<Order>;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
