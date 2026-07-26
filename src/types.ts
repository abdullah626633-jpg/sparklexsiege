export type CategoryType = 'bracelets' | 'bangles' | 'pendants' | 'rings' | 'earrings' | 'jewellery-sets' | 'studs';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: CategoryType;
  price: number;
  formattedPrice?: string;
  priceSubtitle?: string;
  compareAtPrice?: number;
  isNew?: boolean;
  isSale?: boolean;
  featured?: boolean;
  images: string[];
  description: string;
  material: string;
  sizes?: string[];
  colors?: string[];
  colorImages?: Record<string, string>;
  specifications: { key: string; value: string }[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  details: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
}

export type PageType = 
  | 'home' 
  | 'shop' 
  | 'category' 
  | 'product' 
  | 'cart' 
  | 'checkout' 
  | 'about' 
  | 'contact' 
  | 'privacy' 
  | 'terms';

export interface CategoryInfo {
  id: CategoryType;
  name: string;
  description: string;
  image: string;
}
