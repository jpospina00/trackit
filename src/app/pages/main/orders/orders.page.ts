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
    const userRole: String = this.user().role!;
    if (userRole === 'Delivery') {
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
        const purchaseProducts = (response as any[]).map(p => ({
        ...p,
        code: p.productId,
        productId: undefined // opcional: eliminar el campo original
      }));
        console.log("Productos comprados:", purchaseProducts);
      // Obtener los detalles de todos los productos en paralelo
      const productDetailsPromises = purchaseProducts.map(item =>
        this.apiSvc.getProductById(item.code!).toPromise()
      );

      const productDetails = await Promise.all(productDetailsPromises);

      // Combinar la información de compra con la del producto
      const combinedProducts = purchaseProducts.map((purchase, index) => ({
        ...purchase,
        ...productDetails[index]
      }));

      // Abrir el modal con los productos combinados
      const data = await this.utilsSvc.presentModal({
        component: ViewOrderProductsComponent,
        cssClass: 'add-update-modal',
        componentProps: {
          products: combinedProducts,
          role: this.user().role,
          orderId: orderId,
          orderStatus: this.selectedStatus,
        },
      });

      if (data?.reload) {
        console.log("Recargando órdenes...");
        if (this.user().role === 'Delivery') {
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
