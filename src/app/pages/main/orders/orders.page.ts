import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from 'src/app/models/orders.model';
import { PurchasedProduct } from 'src/app/models/purchased-product';
import { User } from 'src/app/models/user.model';
import { ApiService } from 'src/app/services/api.services';
import { UtilsService } from 'src/app/services/utils.services';
import { ViewOrderProductsComponent } from 'src/app/shared/components/view-order-products/view-order-products.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
  standalone: false
})
export class OrdersPage implements OnInit {

  constructor() { }

  router = inject(Router);
  utilsSvc = inject(UtilsService);
  apiSvc = inject(ApiService);
  status: any = ['En camino', 'Entregado'];
  selectedStatus: string = this.status[0]; // Estado seleccionado por defecto

  orders: Order[] = [];

  ngOnInit() {
  }

  ionViewWillEnter() {
    const userRole: String = this.user().role;
    if (userRole === 'domiciliario') {
      this.getOrdersCarrier();
    } else {
      this.getOrders();
    }


  }

  user(): User {
      return this.utilsSvc.getLocalStorage('user');
    }

   // ========= Agregar o actualizar un producto =========
    viewProduct(orderId: string) {
      console.log("Ver productos del pedido con ID:", orderId);
      this.apiSvc.getOrderById(orderId).subscribe({
      next: async (response) => {
        console.log("Respuesta del servidor:", response);
        const products = response;
        const data = await this.utilsSvc.presentModal({
        component: ViewOrderProductsComponent,
        cssClass: 'add-update-modal',
        componentProps: {
          products: products,
          role: this.user().role,
          orderId: orderId,
          orderStatus: this.selectedStatus,
        },
      });

      if (data?.reload) {
        console.log("Recargando órdenes...");
        if (this.user().role === 'domiciliario') {
          this.getOrdersCarrier();
        } else {
          this.getOrders();
        }
      }
      },
      error: (err) => {
        console.error("Error en la petición:", err);
        this.utilsSvc.presentToast({
          message: err.error?.message || 'Error al obtener los pedidos',
          color: 'danger',
          duration: 2000,
        });
      },
    });
      
      
    }

    getOrders() {
    this.apiSvc.getOrdersByUser(this.user().id!).subscribe({
      next: (response) => {
        console.log("Respuesta del servidor:", response);
        this.orders = response;
      },
      error: (err) => {
        console.error("Error en la petición:", err);
        this.utilsSvc.presentToast({
          message: err.error?.message || 'Error al obtener los pedidos',
          color: 'danger',
          duration: 2000,
        });
      },
    });
  };

  getOrdersCarrier() {
    this.apiSvc.getOrdersByCarrier(this.user().id!, this.selectedStatus).subscribe({
      next: (response) => {
        console.log("Respuesta del servidor:", response);
        this.orders = response;
      },
      error: (err) => {
        console.error("Error en la petición:", err);
        this.utilsSvc.presentToast({
          message: err.error?.message || 'Error al obtener los pedidos',
          color: 'danger',
          duration: 2000,
        });
      },
    });
  };

  setStatus(status: string) {
    this.selectedStatus = status;
    console.log("Estado seleccionado:", this.selectedStatus);
      this.getOrdersCarrier();

  }

}
