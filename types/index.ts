export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    salePrice?: number;
    slug: string;
    images: string[];
    category: string;
    rating: number;
    reviewCount: number;
    inStock: boolean;
    tags?: string[];
    features?: string[];
    ingredients?: string[];
    certifications?: string[];
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
}

export interface CartItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    slug: string;
}

export interface User {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
}

export interface Review {
    id: string;
    productId: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
}
