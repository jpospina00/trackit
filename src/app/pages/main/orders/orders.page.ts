import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from 'src/app/models/orders.model';
import { PurchasedProduct } from 'src/app/models/purchased-product';
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

  orders: Order[] = [
    { id: '12345', status: 'En camino', carrier: 'DHL', paymentMethod: 'Tarjeta', total: 150000 },
    { id: '67890', status: 'Entregado', carrier: 'FedEx', paymentMethod: 'Efectivo', total: 200000 }
  ];

  ngOnInit() {
  }

   // ========= Agregar o actualizar un producto =========
    viewProduct(orderId: string) {
      const Product: PurchasedProduct = {
        id: '12345',
        name: 'Producto 1',
        price: 100,
        description: 'Descripción del producto 1',
        stock: 10,
        category: 'Electrónica',
        urlImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8N-942sY2xhOFYMle0IbLhUcjyBraDoqQig&s',
        quantity: 1,
      };
      this.utilsSvc.presentModal({
        component: ViewOrderProductsComponent,
        cssClass: 'add-update-modal',
        componentProps: {
          product: Product,
        },
      });
    }

}
