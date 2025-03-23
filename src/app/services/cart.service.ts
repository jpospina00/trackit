import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PurchasedProduct } from '../models/purchased-product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: PurchasedProduct[] = []; // Carrito en memoria
  private cartSubject = new BehaviorSubject<PurchasedProduct[]>([]); // Observable para cambios en el carrito

  cart$ = this.cartSubject.asObservable(); // Exponer el observable para que otros componentes lo usen

  constructor() {}

  // Agregar un producto al carrito
  addToCart(product: PurchasedProduct) {
    this.cart.push(product);
    this.cartSubject.next([...this.cart]); // Notificar a los suscriptores del carrito
  }

  // Obtener todos los productos del carrito
  getCart() {
    return this.cart;
  }

  // Eliminar un producto del carrito
  removeFromCart(index: number) {
    this.cart.splice(index, 1);
    this.cartSubject.next([...this.cart]); // Actualizar el estado
  }

  // Vaciar el carrito
  clearCart() {
    this.cart = [];
    this.cartSubject.next([]);
  }
}
