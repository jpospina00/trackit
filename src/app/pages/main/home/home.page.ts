import { Component, inject, OnInit } from '@angular/core';
import { Order } from 'src/app/models/orders.model';
import { Product } from 'src/app/models/products.model';
import { PurchasedProduct } from 'src/app/models/purchased-product';
import { User } from 'src/app/models/user.model';
import { ApiService } from 'src/app/services/api.services';
import { CartService } from 'src/app/services/cart.service';
import { UtilsService } from 'src/app/services/utils.services';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';
import { ShoppinCartsComponent } from 'src/app/shared/components/shoppin-carts/shoppin-carts.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {

  utilsSvc = inject(UtilsService);
  cardSvc = inject(CartService);
  apiSvc = inject(ApiService);

  products: Product[] = [];
  avalaibleOrders: Order[] = [
    // { id: '12345', status: 'En camino', carrier: 'DHL', paymentMethod: 'Tarjeta', total: 150000, address: 'Calle Falsa 123' },
    // { id: '67890', status: 'Entregado', carrier: 'FedEx', paymentMethod: 'Efectivo', total: 200000, address: 'Avenida Siempre Viva 742' },
  ];
  searchQuery: string = '';
  filteredProducts: any[] = [];
  filteredOrders: any[] = [];
  categories: any = [];
  llevar: any = [];
  selectedCategory: string = '';
  page: number = 1;


  ngOnInit() {
    console.log("user");
    console.log(this.user());
    if (this.user().role === 'Delivery') {
      this.filteredOrders = this.avalaibleOrders;
    }
    else {
      this.filteredProducts = this.products;
    }
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesCategory = this.selectedCategory === '' || p.categoryName === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }

  filterOrders() {
    this.filteredOrders = this.avalaibleOrders.filter(p => {
      const matchesSearch = p.orderId.toLowerCase().includes(this.searchQuery.toLowerCase()) || p.deliveryAddress.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesSearch;
    });
  }

  openCategoryFilter() {
    // Aquí puedes abrir un modal o alert para seleccionar una categoría
    console.log("Abrir filtro de categorías");
  }

  user(): User {
    return this.utilsSvc.getLocalStorage('user');
  }

  addToCart(product: Product) {
    const quantity = Number(product.quantity);

    if (!quantity || quantity < 1) {
      this.utilsSvc.presentToast({
        message: 'Ingresa una cantidad válida.',
        color: 'danger',
        duration: 2000,
      });
      return;
    }

    if (quantity > product.stock!) {
      this.utilsSvc.presentToast({
        message: `Solo hay ${product.stock} unidades disponibles.`,
        color: 'warning',
        duration: 2000,
      });
      return;
    }
    const purchasedProduct: PurchasedProduct = {
      ...product,
      quantity: product.quantity || 1
    };
    this.cardSvc.addToCart(purchasedProduct);
    console.log('Añadir al carrito:', purchasedProduct);
  }
  deleteProduct(product: Product) {
    this.apiSvc.deleteProduct(product.code!).subscribe({
      next: (response) => {
        console.log("Respuesta del servidor:", response);
        this.utilsSvc.presentToast({
          message: 'Producto eliminado correctamente',
          color: 'success',
          duration: 2000,
        });
        this.getProducts();
      },
      error: (err) => {
        console.error("Error en la petición:", err);
        this.utilsSvc.presentToast({
          message: err.error?.message || 'Error al eliminar el producto',
          color: 'danger',
          duration: 2000,
        });
      },
    });
    console.log('Eliminar producto:', product);
  }

  logout() {
    this.utilsSvc.logout();
  }

  ionViewWillEnter() {
    if (this.user().role === 'Delivery') {
      this.getOrders();
    }
    else {
      this.getProducts();
    }
  }

  getProducts() {
    this.apiSvc.getProducts().subscribe({
      next: (response) => {
        console.log("Respuesta del servidor:", response);
        this.products = response.map((p: any) => ({
          ...p,
          quantity: 1,
          stock: p.quantity // copia el valor de quantity a stock
        }));
        this.filteredProducts = this.products;
        this.categories = [...new Set(this.products.map(p => p.categoryName))];
      },
      error: (err) => {
        console.error("Error en la petición:", err);
        this.utilsSvc.presentToast({
          message: err.error?.message || 'Error al obtener los productos',
          color: 'danger',
          duration: 2000,
        });
      },
    });
  };

  getOrders() {
    this.apiSvc.getAvaliableOrders().subscribe({
      next: (response) => {
        console.log("Respuesta del servidor:", response);
        this.avalaibleOrders = response.filter((order: any) => order.deliveryName === 'Processing');
        this.filteredOrders = this.avalaibleOrders;
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

  assignOrderToCarrier(order: Order) {
    this.apiSvc.getProductsByOrderId(order.orderId).subscribe({
      next: (productsResponse) => {
        console.log("Productos de la orden:", productsResponse);
        order.products = productsResponse;

        // Ahora sí, luego de tener los productos, asignas el pedido
        this.apiSvc.assignOrderToCarrier(order.deliveryId!, this.user().id!, order.orderId).subscribe({
          next: (assignResponse) => {
            console.log('orden: ', order);
            console.log("Respuesta del servidor:", assignResponse);
            const orderPayload = {
              userId: Number(order.userId), // Si viene como string
              deliveryAddress: order.deliveryAddress,
              paymentTypeId: order.paymentTypeId,
              paymentStatusId: order.paymentStatusId,
              products: order.products?.map(p => ({
                productId: p.productId,
                quantity: p.quantity,
                total: p.total
              }))
            };
            this.apiSvc.updatedOrder(order.orderId, orderPayload).subscribe({
              next: (updateResponse) => {
                console.log("Orden actualizada:", updateResponse);
                this.utilsSvc.presentToast({
                  message: 'Pedido asignado correctamente',
                  color: 'success',
                  duration: 2000,
                });
                this.getOrders();
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
          error: (err) => {
            console.error("Error en la petición:", err);
            this.utilsSvc.presentToast({
              message: err.error?.message || 'Error al asignar el pedido',
              color: 'danger',
              duration: 2000,
            });
          },
        });
      },
      error: (err) => {
        console.error("Error en la petición:", err);
        this.utilsSvc.presentToast({
          message: err.error?.message || 'Error al asignar el pedido',
          color: 'danger',
          duration: 2000,
        });
      },
    });
  }



  // ========= Agregar o actualizar un producto =========
  async addUpdateProduct(Product?: Product) {
    const data = await this.utilsSvc.presentModal({
      component: AddUpdateProductComponent,
      cssClass: 'add-update-modal',
      componentProps: {
        product: Product,
      },
    });
    if (data?.reload) {
      console.log("Recargando órdenes...");
      this.getProducts();
    }
  }

  // ========= Ver carrito de compras =========
  viewCart() {
    this.utilsSvc.presentModal({
      component: ShoppinCartsComponent,
      cssClass: 'cart-modal',
    });
  }


}
