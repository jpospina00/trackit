import { Component, inject, input, Input, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.services';
import { ShoppinCartsComponent } from '../shoppin-carts/shoppin-carts.component';
import { CartService } from 'src/app/services/cart.service';
import { PurchasedProduct } from 'src/app/models/purchased-product';
import { NotificationsComponent } from '../notifications/notifications.component';
import { ApiService } from 'src/app/services/api.services';

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
  notificationsList: any[] = [];
  notificationCount: number = 0;

  utilsSvc = inject(UtilsService);
  cardSvc = inject(CartService);
  cart: PurchasedProduct[] = [];

  apiSvc = inject(ApiService);

  private intervalId: any;
  constructor() { }

   ngOnInit() {
    if (this.shoppingCart) {
      this.cardSvc.cart$.subscribe((items) => {
        this.cart = items;
      });
    }

    if (this.notifications) {
      const user = this.utilsSvc.getLocalStorage('user');
      if (user) {
        this.loadNotifications();
        this.intervalId = setInterval(() => {
          const user = this.utilsSvc.getLocalStorage('user');
          if (user) {
            this.loadNotifications();
          } else {
            clearInterval(this.intervalId); // detener si no hay usuario
          }
        }, 10000);
      }
    }
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
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
  
  async openNotifications() {
    console.log('Abrir notificaciones');
    const data = await this.utilsSvc.presentModal({
          component: NotificationsComponent,
          cssClass: 'cart-modal',
        });
    // Aquí podrías redirigir a la página de notificaciones o mostrar un modal
    console.log('Datos de notificaciones:', data);
    if (data?.reload) {
      this.loadNotifications(); // Recargar notificaciones si es necesario
    }
  }

  loadNotifications() {
  const user = this.utilsSvc.getLocalStorage('user');

  if (user) {
    this.apiSvc.getNotifications(user.id).subscribe({
      next: (notis) => {
        this.notificationsList = notis.map((n: any) => ({
          id: n.id,
          message: n.message,
          ...n
        }));

        // Supón que todas las notificaciones no leídas tienen un campo `read: false`
        this.notificationCount = this.notificationsList.filter(n => !n.read).length;
        console.log('Notificaciones:', this.notificationsList);
      },
      error: (err) => {
        console.error('Error al cargar notificaciones:', err);
      }
    });
  }
}
}
