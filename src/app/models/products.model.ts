export interface Product {
    name: string;
    unitPrice: number;
    description: string;
    id?: string;
    imageUrl?: string;
    stock?: number;
    categoryName?: string;
    categoryId?: number
    quantity?: number;
}