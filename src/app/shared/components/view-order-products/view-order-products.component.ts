import { Component, inject, Input, OnInit } from '@angular/core';
import { PurchasedProduct } from 'src/app/models/purchased-product';
import { ApiService } from 'src/app/services/api.services';
import { UtilsService } from 'src/app/services/utils.services';

@Component({
  selector: 'app-view-order-products',
  templateUrl: './view-order-products.component.html',
  styleUrls: ['./view-order-products.component.scss'],
  standalone: false
})
export class ViewOrderProductsComponent  implements OnInit {

  @Input() products!: PurchasedProduct[];
  @Input() role!: string;
  @Input() orderId!: string;
  @Input() orderStatus!: string;
  apiSvc = inject(ApiService);
  utilsSvc = inject(UtilsService);
  constructor() { }

  ngOnInit() {
    console.log("Productos del pedido:", this.products);
  }
  
  advanceOrderStatus() {
  // Aquí colocas la lógica para avanzar al siguiente estado
  console.log('Pasando al siguiente estado...');
  this.apiSvc.advanceOrderStatus(this.orderId, 'Entregado').subscribe({
    next: (response) => {
      console.log("Estado del pedido actualizado:", response);
      this.utilsSvc.dismissModal({reload: true});
      // Aquí puedes agregar lógica adicional, como cerrar el modal o mostrar un mensaje de éxito
    },
    error: (error) => {
      console.error("Error al actualizar el estado del pedido:", error);
      // Aquí puedes manejar el error, como mostrar un mensaje de error al usuario
    }
  });
}


}
