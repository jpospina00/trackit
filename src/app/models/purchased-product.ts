export interface PurchasedProduct {
    name: string;
    price: number;
    description: string;
    id?: string;
    urlImage?: string;
    stock: number;
    category: string;
    quantity: number;
}