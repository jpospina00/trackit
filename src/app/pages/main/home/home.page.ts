import { Component, inject, OnInit } from '@angular/core';
import { Product } from 'src/app/models/products.model';
import { PurchasedProduct } from 'src/app/models/purchased-product';
import { User } from 'src/app/models/user.model';
import { CartService } from 'src/app/services/cart.service';
import { UtilsService } from 'src/app/services/utils.services';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {

  utilsSvc = inject(UtilsService);
  cardSvc = inject(CartService);

  products: Product[] = [];
  searchQuery: string = '';
  filteredProducts: any[] = [];
  categories: any = [];
  llevar: any = [];
  selectedCategory: string = ''; 
  page: number = 1;
  

  ngOnInit() {
    console.log("user");
    console.log(this.user());
    this.filteredProducts = this.products;
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesCategory = this.selectedCategory === '' || p.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
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
    const purchasedProduct: PurchasedProduct = {
        ...product,
        quantity: product.quantity || 1 
    };
    this.cardSvc.addToCart(purchasedProduct);
    console.log('Añadir al carrito:', purchasedProduct);
}
  editProduct(product: Product) {
    console.log('Editar producto:', product);
  }
  deleteProduct(product: Product) {
    console.log('Eliminar producto:', product);
  }

  logout() {
    this.utilsSvc.logout();
  }

  ionViewWillEnter() {
    this.getProducts();
  }

  getProducts() {
    // this.utilsSvc.getProducts();
    this.products = [
      {
        name: 'Producto 1',
        price: 100,
        description: 'Descripción del producto 1',
        stock: 10,
        category: 'Electrónica',
        urlImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8N-942sY2xhOFYMle0IbLhUcjyBraDoqQig&s'
      },
      {
        name: 'Producto 2',
        price: 200,
        description: 'Descripción del producto 2',
        stock: 20,
        category: 'Ropa',
        urlImage: 'https://d1ih8jugeo2m5m.cloudfront.net/2024/08/ideas_para_tienda_de_ropa_infantil.jpg'
      },
      {
        name: 'Producto 3',
        price: 300,
        description: 'Descripción del producto 3',
        stock: 30,
        category: 'Hogar',
        urlImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs4nNmqqUQ_wZQz6hncRM8BixWc2WJJI4T1Q&s'
      },
      {
        name: 'Producto 1',
        price: 100,
        description: 'Descripción del producto 1',
        stock: 10,
        category: 'Electrónica',
        urlImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8N-942sY2xhOFYMle0IbLhUcjyBraDoqQig&s'
      },
      {
        name: 'Producto 2',
        price: 200,
        description: 'Descripción del producto 2',
        stock: 20,
        category: 'Ropa',
        urlImage: 'https://d1ih8jugeo2m5m.cloudfront.net/2024/08/ideas_para_tienda_de_ropa_infantil.jpg'
      },
      {
        name: 'Producto 3',
        price: 300,
        description: 'Descripción del producto 3',
        stock: 30,
        category: 'Hogar',
        urlImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs4nNmqqUQ_wZQz6hncRM8BixWc2WJJI4T1Q&s'
      },
      {
        name: 'Producto 1',
        price: 100,
        description: 'Descripción del producto 1',
        stock: 10,
        category: 'Electrónica',
        urlImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8N-942sY2xhOFYMle0IbLhUcjyBraDoqQig&s'
      },
      {
        name: 'Producto 2',
        price: 200,
        description: 'Descripción del producto 2',
        stock: 20,
        category: 'Ropa',
        urlImage: 'https://d1ih8jugeo2m5m.cloudfront.net/2024/08/ideas_para_tienda_de_ropa_infantil.jpg'
      },
      {
        name: 'Producto 3',
        price: 300,
        description: 'Descripción del producto 3',
        stock: 30,
        category: 'Hogar',
        urlImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs4nNmqqUQ_wZQz6hncRM8BixWc2WJJI4T1Q&s'
      },
      {
        name: 'Producto 1',
        price: 100,
        description: 'Descripción del producto 1',
        stock: 10,
        category: 'Electrónica',
        urlImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8N-942sY2xhOFYMle0IbLhUcjyBraDoqQig&s'
      },
      {
        name: 'Producto 2',
        price: 200,
        description: 'Descripción del producto 2',
        stock: 20,
        category: 'Ropa',
        urlImage: 'https://d1ih8jugeo2m5m.cloudfront.net/2024/08/ideas_para_tienda_de_ropa_infantil.jpg'
      },
      {
        name: 'Producto 30',
        price: 300,
        description: 'Descripción del producto 3',
        stock: 30,
        category: 'Hogar',
        urlImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs4nNmqqUQ_wZQz6hncRM8BixWc2WJJI4T1Q&s'
      }
    ] as Product[];
    this.filteredProducts = this.products;
    this.categories = this.products.map(p => p.category);
  };


  // ========= Agregar o actualizar un producto =========
  addUpdateProduct() {
    this.utilsSvc.presentModal({
      component: AddUpdateProductComponent,
      cssClass: 'add-update-modal',
    });
  }



}
