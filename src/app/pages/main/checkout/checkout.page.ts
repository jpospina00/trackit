import { Component, inject, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { UtilsService } from 'src/app/services/utils.services';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  standalone: false
})
export class CheckoutPage implements OnInit {

  shippingAddress: string = '';
  paymentMethod: string = '';
  total: number = 0;

  constructor() { }

  utilsSvc = inject(UtilsService);
    cardSvc = inject(CartService);
  

  ngOnInit() {
    this.total = this.cardSvc.getTotal();
  }

  confirmPurchase() {
    if (!this.shippingAddress || !this.paymentMethod) {
      alert('Por favor, completa todos los campos');
      return;
    }

    // Aquí puedes enviar los datos a un backend o procesar la compra
    console.log('Compra confirmada con:', {
      direccion: this.shippingAddress,
      metodoPago: this.paymentMethod,
      total: this.total,
    });

    // Limpiar carrito
    this.cardSvc.clearCart();

    // Redirigir a la página de confirmación
    this.utilsSvc.routerLink('/main/checkout');
  }
}

