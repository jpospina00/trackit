import { Component, inject, Input, OnInit } from '@angular/core';
import { PurchasedProduct } from 'src/app/models/purchased-product';
import { User } from 'src/app/models/user.model';
import { ApiService } from 'src/app/services/api.services';
import { UtilsService } from 'src/app/services/utils.services';

@Component({
  selector: 'app-view-order-products',
  templateUrl: './view-order-products.component.html',
  styleUrls: ['./view-order-products.component.scss'],
  standalone: false
})
export class ViewOrderProductsComponent implements OnInit {

  @Input() products!: PurchasedProduct[];
  @Input() role!: string;
  @Input() orderId!: string;
  @Input() orderStatus!: string;
  @Input() order!: any;
  apiSvc = inject(ApiService);
  utilsSvc = inject(UtilsService);
  constructor() { }

  ngOnInit() {
    console.log("Productos del pedido:", this.products);
    console.log(this.order)
  }

  user(): User {
      return this.utilsSvc.getLocalStorage('user');
    }

  advanceOrderStatus() {
    // Aquí colocas la lógica para avanzar al siguiente estado
    console.log('Pasando al siguiente estado...');
    this.apiSvc.getProductsByOrderId(this.orderId).subscribe({
      next: (response) => {
        console.log("Productos del pedido:", response);
        const orderPayload = {
          orderId: this.orderId,
          userId: Number(this.order.userId),
          deliveryAddress: this.order.deliveryAddress,
          paymentTypeId: this.order.paymentTypeId,
          paymentStatusId: this.order.paymentStatusId,
          products: response.map((p: any) => ({
            productId: p.productId,
            quantity: p.quantity,
            total: p.total,
          }))
        };
        this.apiSvc.closeOrder(this.order.deliveryId, this.user().id!, this.orderId).subscribe({
          next: (response) => {
            console.log("Pedido cerrado:", response);
            this.apiSvc.updatedOrder(this.orderId, orderPayload).subscribe({
              next: (updateResponse) => {
                console.log("Orden actualizada:", updateResponse);
                this.utilsSvc.presentToast({
                  message: 'Pedido asignado correctamente',
                  color: 'success',
                  duration: 2000,
                });
                this.utilsSvc.dismissModal({ reload: true });
              },
              error: (updateError) => {
                console.error("Error al actualizar la orden:", updateError);
                this.utilsSvc.presentToast({
                  message: updateError.error?.message || 'Error al asignar el pedido',
                  color: 'danger',
                  duration: 2000,
                });
              }
            });
          },
          error: (error) => {
            console.error("Error al cerrar el pedido:", error);
            // Aquí puedes manejar el error, como mostrar un mensaje de error al usuario
          }
        });
      }
    });

    // this.apiSvc.advanceOrderStatus(this.orderId, 'Entregado').subscribe({
    //   next: (response) => {
    //     console.log("Estado del pedido actualizado:", response);
    //     this.utilsSvc.dismissModal({ reload: true });
    //     // Aquí puedes agregar lógica adicional, como cerrar el modal o mostrar un mensaje de éxito
    //   },
    //   error: (error) => {
    //     console.error("Error al actualizar el estado del pedido:", error);
    //     // Aquí puedes manejar el error, como mostrar un mensaje de error al usuario
    //   }
    // });
  }


}
