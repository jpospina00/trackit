import { Component, inject, OnInit } from '@angular/core';
import { PurchasedProduct } from 'src/app/models/purchased-product';
import { CartService } from 'src/app/services/cart.service';
import { UtilsService } from 'src/app/services/utils.services';

@Component({
  selector: 'app-shoppin-carts',
  templateUrl: './shoppin-carts.component.html',
  styleUrls: ['./shoppin-carts.component.scss'],
  standalone: false
})
export class ShoppinCartsComponent  implements OnInit {
  cart: PurchasedProduct[] = [];
  cardSvc = inject(CartService);
  utilsSvc = inject(UtilsService);
  page: number = 1;
  total: number = 0;


  constructor() { }

  ngOnInit() {
    this.cardSvc.cart$.subscribe((items) => {
      console.log('Carrito:', items);
      this.cart = items; // Se actualiza el carrito con los productos agregados
    });
    this.cardSvc.total$.subscribe(total => {
      this.total = total;
    });
  }

  removeFromCart(index: number) {
    this.cardSvc.removeFromCart(index);
    
  }

  clearCart() {
    this.cardSvc.clearCart();
  }

  proceedToCheckout() {
    console.log('Redirigiendo a la compra...');
    this.utilsSvc.routerLink('/main/checkout');
    this.utilsSvc.dismissModal();
    // Aquí podrías redirigir a la página de pago o mostrar un modal
  }

}
