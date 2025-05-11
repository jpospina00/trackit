import { Component, inject, input, Input, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.services';
import { ShoppinCartsComponent } from '../shoppin-carts/shoppin-carts.component';
import { CartService } from 'src/app/services/cart.service';
import { PurchasedProduct } from 'src/app/models/purchased-product';
import { NotificationsComponent } from '../notifications/notifications.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false
})
export class HeaderComponent  implements OnInit {

  @Input() title!: string;
  @Input() isModal!: boolean;
  @Input() backButton!: boolean;
  @Input() shoppingCart!: boolean;
  @Input() notifications!: boolean;
  @Input() showMenu!: boolean;

  utilsSvc = inject(UtilsService);
  cardSvc = inject(CartService);
  cart: PurchasedProduct[] = [];
  constructor() { }

  ngOnInit() {
    if(this.shoppingCart) {
    this.cardSvc.cart$.subscribe((items) => {
      console.log('Carrito:', items);
      this.cart = items; // Se actualiza el carrito con los productos agregados
    });
  }
  }

  openSettings() {
    console.log('Abrir ajustes');
    // Aquí podrías redirigir a una página de configuración
  }
  
  dismissModal() {
    console.log('Cerrar modal');
    this.utilsSvc.dismissModal();
    // Aquí podrías cerrar el modal
  }

  openCart() {
    console.log('Abrir carrito de compras');
    this.utilsSvc.presentModal({
          component: ShoppinCartsComponent,
          cssClass: 'cart-modal',
        });
    // Aquí podrías redirigir a la página del carrito
  }
  
  openNotifications() {
    console.log('Abrir notificaciones');
    this.utilsSvc.presentModal({
          component: NotificationsComponent,
          cssClass: 'cart-modal',
        });
    // Aquí podrías redirigir a la página de notificaciones o mostrar un modal
  }
}
