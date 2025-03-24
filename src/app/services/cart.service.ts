import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PurchasedProduct } from '../models/purchased-product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: PurchasedProduct[] = []; // Carrito en memoria
  private cartSubject = new BehaviorSubject<PurchasedProduct[]>([]); // Observable para cambios en el carrito
  private totalSubject = new BehaviorSubject<number>(0); // Observable para el total

  cart$ = this.cartSubject.asObservable(); // Exponer el observable del carrito
  total$ = this.totalSubject.asObservable(); // Exponer el observable del total

  constructor() {}

  // Agregar un producto al carrito si no está ya agregado
  addToCart(product: PurchasedProduct) {
    const existingProduct = this.cart.find(p => p.name === product.name);

    if (existingProduct) {
      console.log('El producto ya está en el carrito.');
      return;
    }

    this.cart.push(product);
    this.updateCartState();
    console.log('Añadido al carrito:', product);
  }

  // Obtener todos los productos del carrito
  getCart(): PurchasedProduct[] {
    return this.cart;
  }

  // Obtener el total actual del carrito
  getTotal(): number {
    return this.totalSubject.value;
  }

  // Eliminar un producto del carrito
  removeFromCart(index: number) {
    if (index >= 0 && index < this.cart.length) {
      this.cart.splice(index, 1);
      this.updateCartState();
    }
  }

  // Vaciar el carrito
  clearCart() {
    this.cart = [];
    this.updateCartState();
  }

  // Actualizar el estado del carrito y el total
  private updateCartState() {
    this.cartSubject.next([...this.cart]); // Notificar cambios en el carrito
    const newTotal = this.cart.reduce((sum, item) => sum + (item.price || 0), 0);
    this.totalSubject.next(newTotal); // Notificar el nuevo total
  }
}
