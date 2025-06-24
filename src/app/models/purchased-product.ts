export interface PurchasedProduct {
    name: string;
    unitPrice: number;
    description: string;
    code?: string;
    imageUrl?: string;
    stock?: number;
    categoryName?: string;
    categoryId?: number
    quantity: number;
}